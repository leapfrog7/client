import { profileColumns } from "./columnProfiler";

const isBlankValue = (value) => {
  if (value === null || value === undefined) return true;
  return String(value).trim() === "";
};

const countBlankCells = (headers = [], rows = []) => {
  return rows.reduce((total, row) => {
    const blankInRow = headers.reduce((count, _, index) => {
      return count + (isBlankValue(row[index]) ? 1 : 0);
    }, 0);

    return total + blankInRow;
  }, 0);
};

const countDuplicateRows = (rows = []) => {
  const seen = new Set();
  let duplicates = 0;

  rows.forEach((row) => {
    const key = JSON.stringify(
      row.map((value) =>
        value === null || value === undefined ? "" : String(value).trim(),
      ),
    );

    if (seen.has(key)) {
      duplicates += 1;
    } else {
      seen.add(key);
    }
  });

  return duplicates;
};

export const buildQuickAnalysis = (sheet) => {
  if (!sheet) {
    return {
      summary: {
        totalRows: 0,
        totalColumns: 0,
        blankCells: 0,
        duplicateRows: 0,
        columnsWithMissingValues: 0,
      },
      columns: [],
      suggestedActions: [],
    };
  }

  const headers = sheet.headers || [];
  const rows = sheet.rows || [];
  const columns = profileColumns({ headers, rows });

  const columnsWithMissingValues = columns.filter(
    (column) => column.missingCount > 0,
  ).length;

  const suggestedActions = columns
    .filter((column) =>
      [
        "Category",
        "Identifier",
        "Measure",
        "Date field",
        "Status / Flag",
      ].includes(column.role),
    )
    .slice(0, 8)
    .map((column) => {
      if (column.role === "Category") return `Count by ${column.header}`;
      if (column.role === "Identifier")
        return `Check duplicates in ${column.header}`;
      if (column.role === "Measure")
        return `Total / average of ${column.header}`;
      if (column.role === "Date field")
        return `Month-wise summary using ${column.header}`;
      if (column.role === "Status / Flag")
        return `Status count by ${column.header}`;

      return `Review ${column.header}`;
    });

  return {
    summary: {
      totalRows: rows.length,
      totalColumns: headers.length,
      blankCells: countBlankCells(headers, rows),
      duplicateRows: countDuplicateRows(rows),
      columnsWithMissingValues,
    },
    columns,
    suggestedActions,
  };
};
