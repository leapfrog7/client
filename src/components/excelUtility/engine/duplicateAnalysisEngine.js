const isBlankValue = (value) => {
  if (value === null || value === undefined) return true;
  return String(value).trim() === "";
};

const normaliseValue = (value) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
};

const getDisplayValue = (value) => {
  if (value instanceof Date) {
    return value.toLocaleDateString("en-IN");
  }

  return String(value ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ");
};

const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") return "";

  if (value instanceof Date) {
    return value.toLocaleDateString("en-IN");
  }

  return String(value);
};

export const buildDuplicateAnalysis = ({ sheet, columnIndex }) => {
  if (!sheet || columnIndex === null || columnIndex === undefined) {
    return null;
  }

  const headers = sheet.headers || [];
  const rows = sheet.rows || [];
  const columnName = headers[columnIndex] || `Column ${columnIndex + 1}`;

  const valueMap = new Map();

  rows.forEach((row, index) => {
    const value = row[columnIndex];

    if (isBlankValue(value)) return;

    const key = normaliseValue(value);

    if (!valueMap.has(key)) {
      valueMap.set(key, {
        value: getDisplayValue(value),
        count: 0,
        rowNumbers: [],
        rows: [],
      });
    }

    const entry = valueMap.get(key);
    entry.count += 1;
    entry.rowNumbers.push(index + 1);
    entry.rows.push(row);
  });

  const duplicateGroups = Array.from(valueMap.values())
    .filter((entry) => entry.count > 1)
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

  const duplicateRows = duplicateGroups.flatMap((group) =>
    group.rows.map((row, rowIndex) => {
      const rowObject = {
        "Duplicate Value": group.value,
        "Duplicate Count": group.count,
        "Row No.": group.rowNumbers[rowIndex],
      };

      headers.forEach((header, index) => {
        rowObject[header || `Column ${index + 1}`] = formatCellValue(
          row[index],
        );
      });

      return rowObject;
    }),
  );

  const duplicateRecordCount = duplicateGroups.reduce(
    (total, group) => total + group.count,
    0,
  );

  return {
    type: "duplicate-data",
    columnIndex,
    columnName,
    totalRows: rows.length,
    duplicateGroupsCount: duplicateGroups.length,
    duplicateRecordCount,
    duplicateGroups,
    rows: duplicateRows,
  };
};
