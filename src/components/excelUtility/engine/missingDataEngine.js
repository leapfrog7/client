const isBlankValue = (value) => {
  if (value === null || value === undefined) return true;
  return String(value).trim() === "";
};

const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") return "";

  if (value instanceof Date) {
    return value.toLocaleDateString("en-IN");
  }

  return String(value);
};

export const buildMissingDataAnalysis = ({ sheet, columnIndex }) => {
  if (!sheet || columnIndex === null || columnIndex === undefined) {
    return null;
  }

  const headers = sheet.headers || [];
  const rows = sheet.rows || [];
  const columnName = headers[columnIndex] || `Column ${columnIndex + 1}`;

  const missingRows = rows
    .map((row, index) => ({
      rowNumber: index + 1,
      row,
      value: row[columnIndex],
    }))
    .filter((item) => isBlankValue(item.value));

  const resultRows = missingRows.map((item) => {
    const rowObject = {
      "Row No.": item.rowNumber,
    };

    headers.forEach((header, index) => {
      rowObject[header || `Column ${index + 1}`] = formatCellValue(
        item.row[index],
      );
    });

    return rowObject;
  });

  return {
    type: "missing-data",
    columnIndex,
    columnName,
    totalRows: rows.length,
    missingCount: missingRows.length,
    presentCount: rows.length - missingRows.length,
    missingPercentage: rows.length
      ? (missingRows.length / rows.length) * 100
      : 0,
    rows: resultRows,
  };
};
