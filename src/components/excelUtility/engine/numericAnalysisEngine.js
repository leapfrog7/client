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

const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return null;

  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  const cleaned = normaliseText(value)
    .replace(/,/g, "")
    .replace(/₹/g, "")
    .replace(/rs\.?/gi, "")
    .replace(/inr/gi, "")
    .replace(/%/g, "")
    .trim();

  if (!cleaned) return null;

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
};

const inferNumberContext = ({ header = "", values = [] }) => {
  const headerText = normaliseText(header).toLowerCase();

  const amountHints = [
    "amount",
    "amt",
    "cost",
    "value",
    "expenditure",
    "budget",
    "sanction",
    "bill",
    "salary",
    "pay",
    "arrear",
    "fee",
    "price",
    "rate",
    "grant",
    "fund",
  ];

  const quantityHints = [
    "quantity",
    "qty",
    "count",
    "number of",
    "no. of",
    "posts",
    "cases",
    "units",
    "days",
    "months",
  ];

  const percentHints = ["percent", "percentage", "%"];

  const identifierHints = [
    "id",
    "code",
    "mobile",
    "phone",
    "aadhaar",
    "pan",
    "account",
    "file no",
    "reference",
  ];

  const hasHint = (hints) => hints.some((hint) => headerText.includes(hint));

  if (hasHint(identifierHints)) {
    return {
      context: "Likely Identifier",
      caution:
        "This column looks numeric but may be an ID/reference. Totals may not be meaningful.",
    };
  }

  if (hasHint(amountHints)) {
    return {
      context: "Likely Currency / Amount",
      caution: "Suitable for total, average, highest and lowest amount.",
    };
  }

  if (hasHint(percentHints)) {
    return {
      context: "Likely Percentage",
      caution:
        "Average may be useful. Total percentage may not always be meaningful.",
    };
  }

  if (hasHint(quantityHints)) {
    return {
      context: "Likely Quantity / Count",
      caution: "Suitable for total, average, highest and lowest values.",
    };
  }

  const nonBlankNumbers = values
    .map(parseNumber)
    .filter((value) => value !== null);

  if (!nonBlankNumbers.length) {
    return {
      context: "No numeric values found",
      caution: "This column does not appear suitable for totals.",
    };
  }

  const betweenZeroAndOne = nonBlankNumbers.filter(
    (value) => value >= 0 && value <= 1,
  ).length;

  const excelDateSerials = nonBlankNumbers.filter(
    (value) => value >= 25000 && value <= 60000,
  ).length;

  if (betweenZeroAndOne / nonBlankNumbers.length >= 0.8) {
    return {
      context: "Likely Time / Fraction",
      caution:
        "Excel may store time as a fraction of a day. Totals may need separate time handling.",
    };
  }

  if (excelDateSerials / nonBlankNumbers.length >= 0.8) {
    return {
      context: "Likely Excel Date Serial",
      caution:
        "Excel may store dates as numbers. Date analysis should be handled separately.",
    };
  }

  return {
    context: "General Number",
    caution:
      "Suitable for basic numeric summary if this column represents amount, quantity, or count.",
  };
};

const formatNumber = (value) => {
  return Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

export const buildNumericAnalysis = ({ sheet, columnIndex }) => {
  if (!sheet || columnIndex === null || columnIndex === undefined) {
    return null;
  }

  const headers = sheet.headers || [];
  const rows = sheet.rows || [];
  const columnName = headers[columnIndex] || `Column ${columnIndex + 1}`;

  const rawValues = rows.map((row) => row[columnIndex]);
  const numericValues = rawValues
    .map((value, index) => ({
      rowNumber: index + 1,
      value: parseNumber(value),
      rawValue: value,
    }))
    .filter((item) => item.value !== null);

  const blankCount = rawValues.filter(isBlankValue).length;
  const nonNumericCount = rows.length - blankCount - numericValues.length;

  const values = numericValues.map((item) => item.value);
  const total = values.reduce((sum, value) => sum + value, 0);
  const average = values.length ? total / values.length : 0;
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;

  const minRow = numericValues.find((item) => item.value === min);
  const maxRow = numericValues.find((item) => item.value === max);

  const context = inferNumberContext({
    header: columnName,
    values: rawValues,
  });

  return {
    type: "numeric-analysis",
    columnIndex,
    columnName,
    context: context.context,
    caution: context.caution,
    totalRows: rows.length,
    numericCount: numericValues.length,
    blankCount,
    nonNumericCount,
    total,
    average,
    min,
    max,
    minRowNumber: minRow?.rowNumber || null,
    maxRowNumber: maxRow?.rowNumber || null,
    formatted: {
      total: formatNumber(total),
      average: formatNumber(average),
      min: formatNumber(min),
      max: formatNumber(max),
    },
  };
};
