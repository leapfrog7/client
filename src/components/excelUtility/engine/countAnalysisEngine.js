const isBlankValue = (value) => {
  if (value === null || value === undefined) return true;
  return String(value).trim() === "";
};

const normaliseValue = (value) => {
  if (value instanceof Date) {
    return value.toLocaleDateString("en-IN");
  }

  return String(value ?? "")
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ");
};

const getDisplayValue = (value) => {
  if (isBlankValue(value)) return "(Blank)";
  return normaliseValue(value);
};

export const buildCountAnalysis = ({ sheet, columnIndex }) => {
  if (!sheet || columnIndex === null || columnIndex === undefined) {
    return null;
  }

  const headers = sheet.headers || [];
  const rows = sheet.rows || [];
  const columnName = headers[columnIndex] || `Column ${columnIndex + 1}`;

  const countMap = new Map();

  rows.forEach((row) => {
    const displayValue = getDisplayValue(row[columnIndex]);
    countMap.set(displayValue, (countMap.get(displayValue) || 0) + 1);
  });

  const items = Array.from(countMap.entries())
    .map(([value, count]) => ({
      value,
      count,
      percentage: rows.length ? (count / rows.length) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));

  const blankItem = items.find((item) => item.value === "(Blank)");
  const topItem = items[0] || null;

  return {
    type: "count-by-column",
    columnIndex,
    columnName,
    totalRows: rows.length,
    totalGroups: items.length,
    blankCount: blankItem?.count || 0,
    topValue: topItem?.value || "—",
    topCount: topItem?.count || 0,
    items,
  };
};
