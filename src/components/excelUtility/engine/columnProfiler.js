const SAMPLE_LIMIT = 200;

const isBlankValue = (value) => {
  if (value === null || value === undefined) return true;
  return String(value).trim() === "";
};

const normaliseText = (value) => {
  return String(value ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
};

const normaliseForComparison = (value) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return normaliseText(value).toLowerCase();
};

const isNumericLike = (value) => {
  if (value === null || value === undefined || value === "") return false;
  if (value instanceof Date) return false;

  const text = normaliseText(value)
    .replace(/,/g, "")
    .replace(/₹/g, "")
    .replace(/%/g, "")
    .trim();

  if (!text) return false;

  return !Number.isNaN(Number(text));
};

const isDateLike = (value) => {
  if (!value) return false;
  if (value instanceof Date) return true;

  const text = normaliseText(value);
  if (!text) return false;

  const commonIndianDatePattern = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/;

  const isoDatePattern = /^\d{4}-\d{1,2}-\d{1,2}$/;

  return commonIndianDatePattern.test(text) || isoDatePattern.test(text);
};

const isBooleanLike = (value) => {
  if (value === true || value === false) return true;

  const text = normaliseText(value).toLowerCase();

  return [
    "yes",
    "no",
    "y",
    "n",
    "true",
    "false",
    "active",
    "inactive",
    "approved",
    "pending",
    "completed",
    "not completed",
  ].includes(text);
};

const looksLikeLongDescription = (values = []) => {
  const nonBlankValues = values.filter((value) => !isBlankValue(value));

  if (!nonBlankValues.length) return false;

  const averageLength =
    nonBlankValues.reduce(
      (total, value) => total + normaliseText(value).length,
      0,
    ) / nonBlankValues.length;

  return averageLength >= 45;
};

const getColumnStats = (values = []) => {
  const nonBlankValues = values.filter((value) => !isBlankValue(value));

  const uniqueValues = new Set(
    nonBlankValues.map((value) => normaliseForComparison(value)),
  );

  const duplicateCount = Math.max(nonBlankValues.length - uniqueValues.size, 0);

  return {
    totalChecked: values.length,
    nonBlankCount: nonBlankValues.length,
    missingCount: values.length - nonBlankValues.length,
    uniqueCount: uniqueValues.size,
    duplicateCount,
    uniqueRatio: nonBlankValues.length
      ? uniqueValues.size / nonBlankValues.length
      : 0,
  };
};

const inferRawType = ({
  sampledNonBlankValues,
  numericCount,
  dateCount,
  booleanCount,
}) => {
  const total = sampledNonBlankValues.length;

  if (!total) return "empty";

  if (dateCount / total >= 0.75) return "date-like";
  if (numericCount / total >= 0.75) return "number-like";
  if (booleanCount / total >= 0.75) return "status/flag-like";

  return "text-like";
};

const inferRole = ({
  header,
  rawType,
  uniqueRatio,
  duplicateCount,
  missingCount,
  allValues,
  sampledValues,
}) => {
  const headerText = normaliseText(header).toLowerCase();

  const identifierHints = [
    "id",
    "code",
    "number",
    "no.",
    "no",
    "mobile",
    "phone",
    "aadhaar",
    "pan",
    "account",
    "bill",
    "receipt",
    "file",
    "reference",
    "sanction",
  ];

  const measureHints = [
    "amount",
    "total",
    "value",
    "cost",
    "expenditure",
    "budget",
    "quantity",
    "qty",
    "rate",
    "price",
    "salary",
    "pay",
  ];

  const dateHints = ["date", "month", "year", "period", "from", "to"];

  const statusHints = [
    "status",
    "stage",
    "approved",
    "pending",
    "completed",
    "active",
    "verified",
    "flag",
  ];

  const categoryHints = [
    "office",
    "section",
    "department",
    "ministry",
    "designation",
    "type",
    "category",
    "state",
    "district",
    "city",
  ];

  const hasHint = (hints) => hints.some((hint) => headerText.includes(hint));

  if (rawType === "date-like" || hasHint(dateHints)) {
    return {
      role: "Date field",
      suggestedUse: "Good for month-wise summary, age, or timeline review",
    };
  }

  if (rawType === "number-like" && hasHint(measureHints)) {
    return {
      role: "Measure",
      suggestedUse: "Good for total, average, highest and lowest values",
    };
  }

  if (rawType === "status/flag-like" || hasHint(statusHints)) {
    return {
      role: "Status / Flag",
      suggestedUse: "Good for approved/pending or completed/incomplete count",
    };
  }

  if (hasHint(identifierHints)) {
    return {
      role: "Identifier",
      suggestedUse: "Good for duplicate check and uniqueness review",
    };
  }

  if (
    uniqueRatio >= 0.9 &&
    duplicateCount <= Math.max(2, allValues.length * 0.02)
  ) {
    return {
      role: "Identifier",
      suggestedUse: "Good for duplicate check and uniqueness review",
    };
  }

  if (looksLikeLongDescription(sampledValues)) {
    return {
      role: "Description",
      suggestedUse: "Good for search and review, not ideal for totals",
    };
  }

  if (rawType === "number-like") {
    return {
      role: "Number",
      suggestedUse: "Good for numeric summary if this is an amount or quantity",
    };
  }

  if (hasHint(categoryHints) || uniqueRatio <= 0.5) {
    return {
      role: "Category",
      suggestedUse: "Good for count by office, section, status, type, etc.",
    };
  }

  if (missingCount > 0) {
    return {
      role: "Text",
      suggestedUse: "Good for missing value review and simple filtering",
    };
  }

  return {
    role: "Text",
    suggestedUse: "Good for review, search, and basic grouping if repeated",
  };
};

const getConfidence = ({
  nonBlankCount,
  rawType,
  uniqueRatio,
  duplicateCount,
}) => {
  if (nonBlankCount === 0) return "low";

  if (rawType !== "text-like") return "medium";

  if (uniqueRatio >= 0.9 && duplicateCount <= 2) return "medium";

  return "moderate";
};

export const profileColumns = ({ headers = [], rows = [] }) => {
  const sampledRows = rows.slice(0, SAMPLE_LIMIT);

  return headers.map((header, columnIndex) => {
    const allValues = rows.map((row) => row[columnIndex]);
    const sampledValues = sampledRows.map((row) => row[columnIndex]);

    const sampledNonBlankValues = sampledValues.filter(
      (value) => !isBlankValue(value),
    );

    const numericCount = sampledNonBlankValues.filter(isNumericLike).length;
    const dateCount = sampledNonBlankValues.filter(isDateLike).length;
    const booleanCount = sampledNonBlankValues.filter(isBooleanLike).length;

    const rawType = inferRawType({
      sampledNonBlankValues,
      numericCount,
      dateCount,
      booleanCount,
    });

    const stats = getColumnStats(allValues);

    const inferred = inferRole({
      header,
      rawType,
      uniqueRatio: stats.uniqueRatio,
      duplicateCount: stats.duplicateCount,
      missingCount: stats.missingCount,
      allValues,
      sampledValues,
    });

    return {
      columnIndex,
      header,
      rawType,
      role: inferred.role,
      suggestedUse: inferred.suggestedUse,

      totalChecked: stats.totalChecked,
      nonBlankCount: stats.nonBlankCount,
      missingCount: stats.missingCount,
      uniqueCount: stats.uniqueCount,
      duplicateCount: stats.duplicateCount,
      uniqueRatio: stats.uniqueRatio,

      sampleSize: sampledValues.length,
      confidence: getConfidence({
        nonBlankCount: stats.nonBlankCount,
        rawType,
        uniqueRatio: stats.uniqueRatio,
        duplicateCount: stats.duplicateCount,
      }),
    };
  });
};
