export const buildCountSummaryText = (result) => {
  if (!result) return "";

  return `Count analysis was carried out for "${result.columnName}". Out of ${result.totalRows} rows, ${result.totalGroups} groups were found. Blank values: ${result.blankCount}. Top value: ${result.topValue} (${result.topCount}).`;
};

export const buildCountTableRows = (result) => {
  if (!result?.items?.length) return [];

  return result.items.map((item) => ({
    [result.columnName || "Value"]: item.value,
    Count: item.count,
    Percentage: `${Number(item.percentage || 0).toFixed(2)}%`,
  }));
};

export const buildMissingSummaryText = (result) => {
  if (!result) return "";

  return `Missing data check was carried out for "${result.columnName}". Out of ${result.totalRows} rows, ${result.missingCount} values were missing and ${result.presentCount} values were present. Missing share: ${Number(result.missingPercentage || 0).toFixed(2)}%.`;
};

export const buildDuplicateSummaryText = (result) => {
  if (!result) return "";

  return `Duplicate check was carried out for "${result.columnName}". Out of ${result.totalRows} rows, ${result.duplicateGroupsCount} duplicate groups involving ${result.duplicateRecordCount} records were found. Blank values were ignored.`;
};

export const buildNumericSummaryText = (result) => {
  if (!result) return "";

  return `Totals analysis was carried out for "${result.columnName}". Numeric values found: ${result.numericCount}. Total: ${result.formatted?.total}. Average: ${result.formatted?.average}. Lowest: ${result.formatted?.min}. Highest: ${result.formatted?.max}. Context: ${result.context}.`;
};

export const buildNumericTableRows = (result) => {
  if (!result) return [];

  return [
    { Item: "Column", Value: result.columnName },
    { Item: "Context", Value: result.context },
    { Item: "Rows checked", Value: result.totalRows },
    { Item: "Numeric values", Value: result.numericCount },
    { Item: "Blank values", Value: result.blankCount },
    { Item: "Non-numeric values", Value: result.nonNumericCount },
    { Item: "Total", Value: result.total },
    { Item: "Average", Value: result.average },
    { Item: "Lowest", Value: result.min },
    { Item: "Highest", Value: result.max },
  ];
};

export const buildDateSummaryText = (result) => {
  if (!result) return "";

  return `Date analysis was carried out for "${result.columnName}". Out of ${result.totalRows} rows, ${result.validDateCount} valid dates were found. Blank values: ${result.blankCount}. Invalid/unclear values: ${result.invalidCount}.`;
};

export const buildDateTableRows = (result) => {
  if (!result) return [];

  return [
    ...(result.yearWise || []).map((item) => ({
      Type: "Year-wise",
      Period: item.year,
      Count: item.count,
    })),
    ...(result.monthWise || []).map((item) => ({
      Type: "Month-wise",
      Period: item.label,
      Count: item.count,
    })),
  ];
};

export const buildTimeSummaryText = (result) => {
  if (!result) return "";

  return `Time analysis was carried out for "${result.columnName}". Out of ${result.totalRows} rows, ${result.validTimeCount} valid times were found. Blank values: ${result.blankCount}. Invalid/unclear values: ${result.invalidCount}.`;
};

export const buildTimeTableRows = (result) => {
  if (!result) return [];

  return [
    ...(result.hourWise || []).map((item) => ({
      Type: "Hour-wise",
      Period: item.label,
      Count: item.count,
    })),
    ...(result.periodWise || []).map((item) => ({
      Type: "AM/PM",
      Period: item.period,
      Count: item.count,
    })),
  ];
};
