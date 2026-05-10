import ExcelJS from "exceljs";

const SUPPORTED_EXTENSIONS = [".xlsx"];
import { EXCEL_LIMITS, EXCEL_MESSAGES } from "../utils/excelConstants";

const getFileExtension = (fileName = "") => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) return "";
  return fileName.slice(lastDotIndex).toLowerCase();
};

const isSupportedExcelFile = (file) => {
  if (!file?.name) return false;
  return SUPPORTED_EXTENSIONS.includes(getFileExtension(file.name));
};

const isMeaningfulCell = (value) => {
  if (value === null || value === undefined) return false;
  return String(value).trim() !== "";
};

const getCellDisplayValue = (cell) => {
  if (!cell) return "";

  const value = cell.value;

  if (value === null || value === undefined) return "";

  if (value instanceof Date) return value;

  if (typeof value === "object") {
    if (value.text) return value.text;
    if (value.result !== undefined) return value.result;

    if (value.richText) {
      return value.richText.map((item) => item.text || "").join("");
    }

    if (value.hyperlink && value.text) return value.text;
  }

  return value;
};

const rowToValues = (row, columnCount) => {
  return Array.from({ length: columnCount }, (_, index) => {
    const cell = row.getCell(index + 1);
    return getCellDisplayValue(cell);
  });
};

const getWorksheetColumnCount = (worksheet) => {
  let maxColumnCount = 0;

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    maxColumnCount = Math.max(maxColumnCount, row.cellCount);
  });

  return maxColumnCount;
};

const removeFullyEmptyTrailingRows = (rows = []) => {
  let lastMeaningfulIndex = rows.length - 1;

  while (lastMeaningfulIndex >= 0) {
    const rowHasValue = rows[lastMeaningfulIndex].some(isMeaningfulCell);

    if (rowHasValue) break;

    lastMeaningfulIndex -= 1;
  }

  return rows.slice(0, lastMeaningfulIndex + 1);
};

const countMeaningfulCells = (row = []) => {
  return row.filter(isMeaningfulCell).length;
};

const isMostlyTextRow = (row = []) => {
  const meaningfulCells = row.filter(isMeaningfulCell);

  if (!meaningfulCells.length) return false;

  const textCells = meaningfulCells.filter((value) => {
    if (value instanceof Date) return false;
    return Number.isNaN(Number(String(value).replace(/,/g, "")));
  });

  return textCells.length / meaningfulCells.length >= 0.6;
};

const hasDataBelow = (rows = [], rowIndex = 0) => {
  const nextRows = rows.slice(rowIndex + 1, rowIndex + 4);

  return nextRows.some((row) => countMeaningfulCells(row) >= 2);
};

const getFilledColumnIndexes = (row = []) => {
  return row
    .map((value, index) => (isMeaningfulCell(value) ? index : -1))
    .filter((index) => index !== -1);
};

const hasReasonableColumnSpread = (row = []) => {
  const indexes = getFilledColumnIndexes(row);

  if (indexes.length < 2) return false;

  const firstIndex = indexes[0];
  const lastIndex = indexes[indexes.length - 1];

  return lastIndex - firstIndex >= 1;
};

const getRowHeaderScore = (rows = [], rowIndex = 0) => {
  const row = rows[rowIndex] || [];
  const meaningfulCount = countMeaningfulCells(row);

  if (meaningfulCount < 2) return -1;

  let score = 0;

  score += meaningfulCount * 4;

  if (isMostlyTextRow(row)) score += 10;

  if (hasDataBelow(rows, rowIndex)) score += 12;

  if (hasReasonableColumnSpread(row)) score += 6;

  const previousRow = rows[rowIndex - 1] || [];
  const nextRow = rows[rowIndex + 1] || [];

  const previousCount = countMeaningfulCells(previousRow);
  const nextCount = countMeaningfulCells(nextRow);

  // Penalise title-like rows: few filled cells with blank space around.
  if (meaningfulCount <= 2 && nextCount >= meaningfulCount + 2) {
    score -= 8;
  }

  // Prefer a row followed by data of similar or greater spread.
  if (nextCount >= Math.max(2, meaningfulCount - 1)) {
    score += 6;
  }

  // Penalise rows that appear to be group headers above detailed headers.
  if (previousCount <= 1 && nextCount > meaningfulCount) {
    score -= 5;
  }

  return score;
};

const findLikelyHeaderRowIndex = (rows = []) => {
  if (!rows.length) return 0;

  let bestIndex = 0;
  let bestScore = -1;

  rows.forEach((_, index) => {
    const score = getRowHeaderScore(rows, index);

    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
};

const buildHeaders = (headerRow = [], columnCount = 0) => {
  return Array.from({ length: columnCount }, (_, index) => {
    const value = headerRow[index];

    if (isMeaningfulCell(value)) {
      return String(value).trim().replace(/\s+/g, " ");
    }

    return `Column ${index + 1}`;
  });
};

const removeLeadingBlankRows = (rows = []) => {
  const firstMeaningfulIndex = rows.findIndex(
    (row) => countMeaningfulCells(row) > 0,
  );

  if (firstMeaningfulIndex === -1) return [];

  return rows.slice(firstMeaningfulIndex);
};

const buildSheetModel = (worksheet) => {
  const columnCount = getWorksheetColumnCount(worksheet);
  const allRows = [];

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    allRows.push(rowToValues(row, columnCount));
  });

  const withoutTrailingBlankRows = removeFullyEmptyTrailingRows(allRows);
  const cleanedRows = removeLeadingBlankRows(withoutTrailingBlankRows);

  const headerRowIndex = cleanedRows.length
    ? findLikelyHeaderRowIndex(cleanedRows)
    : 0;

  const headers = buildHeaders(cleanedRows[headerRowIndex] || [], columnCount);
  const dataRows = cleanedRows.slice(headerRowIndex + 1);

  if (dataRows.length > EXCEL_LIMITS.MAX_DATA_ROWS) {
    throw new Error(`${worksheet.name}: ${EXCEL_MESSAGES.ROW_LIMIT_EXCEEDED}`);
  }

  return {
    id: String(worksheet.id),
    name: worksheet.name,
    rowCount: dataRows.length,
    columnCount,
    headerRowIndex,
    originalHeaderRowNumber: headerRowIndex + 1,
    headers,
    rows: dataRows,
    previewRows: dataRows.slice(0, EXCEL_LIMITS.MAX_PREVIEW_ROWS),
    isEmpty: cleanedRows.length === 0 || columnCount === 0,
  };
};

export const readWorkbookFile = async (file) => {
  if (!file) {
    throw new Error("Please select an Excel file.");
  }

  if (!isSupportedExcelFile(file)) {
    throw new Error("Please upload an .xlsx file.");
  }

  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();

  await workbook.xlsx.load(arrayBuffer);

  const sheets = workbook.worksheets.map(buildSheetModel);

  if (!sheets.length) {
    throw new Error("No sheet was found in this file.");
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    sheetCount: sheets.length,
    sheets,
  };
};
