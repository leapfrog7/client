const EXCEL_EPOCH_OFFSET = 25569;

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

const isLikelyExcelDateSerial = (value) => {
  return typeof value === "number" && value >= 25000 && value <= 60000;
};

const excelSerialToDate = (serial) => {
  const utcDays = Math.floor(serial - EXCEL_EPOCH_OFFSET);
  const utcValue = utcDays * 86400 * 1000;
  return new Date(utcValue);
};

const parseIndianDate = (text) => {
  const match = text.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2}|\d{4})$/);

  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  let year = Number(match[3]);

  if (year < 100) {
    year += year >= 50 ? 1900 : 2000;
  }

  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? date : null;
};

const parseIsoDate = (text) => {
  const match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? date : null;
};

export const parseDateValue = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (isLikelyExcelDateSerial(value)) {
    return excelSerialToDate(value);
  }

  if (isBlankValue(value)) return null;

  const text = normaliseText(value);

  return parseIndianDate(text) || parseIsoDate(text);
};

const formatMonthKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

const sortDateAsc = (a, b) => a.getTime() - b.getTime();

export const formatDateForDisplay = (date, format = "dd/mm/yyyy") => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (format === "dd/mm/yyyy") {
    return `${day}/${month}/${year}`;
  }

  if (format === "dd-mmm-yyyy") {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (format === "dd-mmmm-yyyy") {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  if (format === "mmm-yyyy") {
    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  }

  if (format === "mmmm-yyyy") {
    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  }

  return `${day}/${month}/${year}`;
};

export const buildDateAnalysis = ({ sheet, columnIndex }) => {
  if (!sheet || columnIndex === null || columnIndex === undefined) {
    return null;
  }

  const headers = sheet.headers || [];
  const rows = sheet.rows || [];
  const columnName = headers[columnIndex] || `Column ${columnIndex + 1}`;

  const parsedItems = rows.map((row, index) => {
    const rawValue = row[columnIndex];
    const parsedDate = parseDateValue(rawValue);

    return {
      rowNumber: index + 1,
      rawValue,
      parsedDate,
    };
  });

  const validItems = parsedItems.filter((item) => item.parsedDate);
  const validDates = validItems
    .map((item) => item.parsedDate)
    .sort(sortDateAsc);

  const blankCount = parsedItems.filter((item) =>
    isBlankValue(item.rawValue),
  ).length;
  const invalidCount = rows.length - blankCount - validItems.length;

  const monthMap = new Map();
  const yearMap = new Map();
  const yearMonthMap = new Map();

  validItems.forEach((item) => {
    const date = item.parsedDate;
    const monthKey = formatMonthKey(date);
    const yearKey = String(date.getFullYear());

    monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
    yearMap.set(yearKey, (yearMap.get(yearKey) || 0) + 1);

    if (!yearMonthMap.has(yearKey)) {
      yearMonthMap.set(yearKey, new Map());
    }

    const monthMapForYear = yearMonthMap.get(yearKey);
    monthMapForYear.set(monthKey, (monthMapForYear.get(monthKey) || 0) + 1);
  });

  const monthWise = Array.from(monthMap.entries())
    .map(([monthKey, count]) => ({
      monthKey,
      label: getMonthLabel(monthKey),
      count,
    }))
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  const yearWise = Array.from(yearMap.entries())
    .map(([year, count]) => ({
      year,
      count,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));

  const monthWiseByYear = Array.from(yearMonthMap.entries()).reduce(
    (acc, [year, monthEntries]) => {
      acc[year] = Array.from(monthEntries.entries())
        .map(([monthKey, count]) => ({
          monthKey,
          label: getMonthLabel(monthKey),
          count,
        }))
        .sort((a, b) => a.monthKey.localeCompare(b.monthKey));

      return acc;
    },
    {},
  );

  return {
    type: "date-analysis",
    columnIndex,
    columnName,
    totalRows: rows.length,
    validDateCount: validItems.length,
    blankCount,
    invalidCount,
    earliestDate: validDates[0] || null,
    latestDate: validDates[validDates.length - 1] || null,
    monthWise,
    yearWise,
    monthWiseByYear,
  };
};
