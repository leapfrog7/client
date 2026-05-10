import { useState } from "react";
import { cleanSheetData } from "../engine/dataCleaner";
import { mergeWorkbookSheets } from "../engine/mergeEngine";

const INITIAL_RESULT = {
  type: "",
  title: "",
  description: "",
  headers: [],
  rows: [],
  previewRows: [],
  summary: null,
  compatibility: null,
};

export default function useExcelActions() {
  const [result, setResult] = useState(INITIAL_RESULT);

  const cleanData = (sheet) => {
    const cleanedData = cleanSheetData(sheet);

    setResult({
      type: "clean-data",
      title: "Clean data result",
      description:
        "Extra spaces, invisible characters, and fully blank rows or columns have been removed. Dates, numbers and currency values are not converted.",
      headers: cleanedData.headers,
      rows: cleanedData.rows,
      previewRows: cleanedData.previewRows,
      summary: cleanedData.summary,
    });
  };

  const mergeSheets = (workbook) => {
    const mergedData = mergeWorkbookSheets(workbook);

    setResult({
      type: "merge-sheets",
      title: "Merged sheet result",
      description:
        "Sheets have been merged using matching column headers. Different headers are kept as separate columns. Similar-looking headers are reported but not merged automatically.",
      headers: mergedData.headers,
      rows: mergedData.rows,
      previewRows: mergedData.previewRows,
      summary: mergedData.summary,
      compatibility: mergedData.compatibility,
    });
  };

  const clearResult = () => {
    setResult(INITIAL_RESULT);
  };

  return {
    result,
    hasResult: Boolean(result.type),
    cleanData,
    mergeSheets,
    clearResult,
  };
}
