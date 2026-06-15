import ExcelJS from "exceljs";

const safeSheetName = (name = "Sheet") => {
  return String(name)
    .replace(/[\\/*[\]:?]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 31);
};

const safeFileName = (name = "analysis-output") => {
  return String(name)
    .replace(/\.[^/.]+$/, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();

  anchor.remove();
  URL.revokeObjectURL(url);
};

const applyHeaderStyle = (worksheet) => {
  const headerRow = worksheet.getRow(1);

  headerRow.font = { bold: true };
  headerRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEFF6FF" },
    };

    cell.border = {
      top: { style: "thin", color: { argb: "FFD7E3F4" } },
      left: { style: "thin", color: { argb: "FFD7E3F4" } },
      bottom: { style: "thin", color: { argb: "FFD7E3F4" } },
      right: { style: "thin", color: { argb: "FFD7E3F4" } },
    };
  });
};

const autoFitColumns = (worksheet) => {
  worksheet.columns.forEach((column) => {
    let maxLength = 12;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const value =
        cell.value === null || cell.value === undefined
          ? ""
          : String(cell.value);

      maxLength = Math.max(maxLength, value.length + 2);
    });

    column.width = Math.min(maxLength, 45);
  });
};

const addRowsFromObjects = ({ workbook, sheetName, rows = [] }) => {
  const worksheet = workbook.addWorksheet(safeSheetName(sheetName));

  if (!rows.length) {
    worksheet.addRow(["Result"]);
    worksheet.addRow(["No rows available"]);
    autoFitColumns(worksheet);
    return worksheet;
  }

  const headers = Object.keys(rows[0]);

  worksheet.addRow(headers);

  rows.forEach((row) => {
    worksheet.addRow(headers.map((header) => row[header]));
  });

  applyHeaderStyle(worksheet);
  autoFitColumns(worksheet);
  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  return worksheet;
};

const addSummarySheet = ({ workbook, rows = [] }) => {
  const worksheet = workbook.addWorksheet("Summary");

  worksheet.addRow(["Item", "Value"]);

  rows.forEach((row) => {
    worksheet.addRow([row.label, row.value]);
  });

  applyHeaderStyle(worksheet);
  autoFitColumns(worksheet);

  return worksheet;
};

const exportCountAnalysis = ({ workbook, result }) => {
  addSummarySheet({
    workbook,
    rows: [
      { label: "Analysis", value: "Count by Column" },
      { label: "Column", value: result.columnName },
      { label: "Rows checked", value: result.totalRows },
      { label: "Groups found", value: result.totalGroups },
      { label: "Blank values", value: result.blankCount },
      { label: "Top value", value: result.topValue },
      { label: "Top count", value: result.topCount },
    ],
  });

  addRowsFromObjects({
    workbook,
    sheetName: "Count Result",
    rows: (result.items || []).map((item) => ({
      [result.columnName || "Value"]: item.value,
      Count: item.count,
      Percentage: Number(item.percentage || 0).toFixed(2),
    })),
  });
};

const exportMissingDataAnalysis = ({ workbook, result }) => {
  addSummarySheet({
    workbook,
    rows: [
      { label: "Analysis", value: "Missing Data" },
      { label: "Column", value: result.columnName },
      { label: "Rows checked", value: result.totalRows },
      { label: "Missing values", value: result.missingCount },
      { label: "Present values", value: result.presentCount },
      {
        label: "Missing percentage",
        value: `${Number(result.missingPercentage || 0).toFixed(2)}%`,
      },
    ],
  });

  addRowsFromObjects({
    workbook,
    sheetName: "Missing Rows",
    rows: result.rows || [],
  });
};

const exportDuplicateAnalysis = ({ workbook, result }) => {
  addSummarySheet({
    workbook,
    rows: [
      { label: "Analysis", value: "Duplicate Check" },
      { label: "Column", value: result.columnName },
      { label: "Rows checked", value: result.totalRows },
      { label: "Duplicate groups", value: result.duplicateGroupsCount },
      { label: "Duplicate records", value: result.duplicateRecordCount },
    ],
  });

  addRowsFromObjects({
    workbook,
    sheetName: "Duplicate Rows",
    rows: result.rows || [],
  });
};

const exportNumericAnalysis = ({ workbook, result }) => {
  addSummarySheet({
    workbook,
    rows: [
      { label: "Analysis", value: "Totals and Numbers" },
      { label: "Column", value: result.columnName },
      { label: "Context", value: result.context },
      { label: "Rows checked", value: result.totalRows },
      { label: "Numeric values", value: result.numericCount },
      { label: "Blank values", value: result.blankCount },
      { label: "Non-numeric values", value: result.nonNumericCount },
      { label: "Total", value: result.total },
      { label: "Average", value: result.average },
      { label: "Lowest", value: result.min },
      { label: "Lowest row", value: result.minRowNumber || "" },
      { label: "Highest", value: result.max },
      { label: "Highest row", value: result.maxRowNumber || "" },
    ],
  });
};

const exportDateAnalysis = ({ workbook, result }) => {
  addSummarySheet({
    workbook,
    rows: [
      { label: "Analysis", value: "Date Analysis" },
      { label: "Column", value: result.columnName },
      { label: "Rows checked", value: result.totalRows },
      { label: "Valid dates", value: result.validDateCount },
      { label: "Blank values", value: result.blankCount },
      { label: "Invalid / unclear", value: result.invalidCount },
      { label: "Earliest date", value: result.earliestDate || "" },
      { label: "Latest date", value: result.latestDate || "" },
    ],
  });

  addRowsFromObjects({
    workbook,
    sheetName: "Year-wise Count",
    rows: (result.yearWise || []).map((item) => ({
      Year: item.year,
      Count: item.count,
    })),
  });

  addRowsFromObjects({
    workbook,
    sheetName: "Month-wise Count",
    rows: (result.monthWise || []).map((item) => ({
      Month: item.label,
      Count: item.count,
    })),
  });
};

const exportTimeAnalysis = ({ workbook, result }) => {
  addSummarySheet({
    workbook,
    rows: [
      { label: "Analysis", value: "Time Analysis" },
      { label: "Column", value: result.columnName },
      { label: "Rows checked", value: result.totalRows },
      { label: "Valid times", value: result.validTimeCount },
      { label: "Blank values", value: result.blankCount },
      { label: "Invalid / unclear", value: result.invalidCount },
      { label: "Earliest time", value: result.earliestTime ?? "" },
      { label: "Latest time", value: result.latestTime ?? "" },
    ],
  });

  addRowsFromObjects({
    workbook,
    sheetName: "Hour-wise Count",
    rows: (result.hourWise || []).map((item) => ({
      Hour: item.label,
      Count: item.count,
    })),
  });

  addRowsFromObjects({
    workbook,
    sheetName: "AM PM Split",
    rows: (result.periodWise || []).map((item) => ({
      Period: item.period,
      Count: item.count,
    })),
  });
};

export const downloadAnalysisWorkbook = async ({
  result,
  analysisType,
  originalFileName = "analysis-output.xlsx",
}) => {
  if (!result) {
    throw new Error("No analysis result is available for download.");
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Undersigned Excel Utility";
  workbook.created = new Date();

  if (analysisType === "count") {
    exportCountAnalysis({ workbook, result });
  } else if (analysisType === "missing") {
    exportMissingDataAnalysis({ workbook, result });
  } else if (analysisType === "duplicates") {
    exportDuplicateAnalysis({ workbook, result });
  } else if (analysisType === "totals") {
    exportNumericAnalysis({ workbook, result });
  } else if (analysisType === "dates") {
    exportDateAnalysis({ workbook, result });
  } else if (analysisType === "time") {
    exportTimeAnalysis({ workbook, result });
  } else {
    throw new Error("This analysis type is not supported for download.");
  }

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = `${safeFileName(originalFileName)}-${analysisType}-analysis.xlsx`;

  downloadBlob(blob, fileName);
};
