import { useMemo, useState } from "react";
import { readWorkbookFile } from "../engine/workbookReader";

const INITIAL_STATE = {
  workbook: null,
  activeSheetName: "",
  isLoading: false,
  error: "",
};

export default function useWorkbook() {
  const [state, setState] = useState(INITIAL_STATE);

  const activeSheet = useMemo(() => {
    if (!state.workbook?.sheets?.length) return null;

    return (
      state.workbook.sheets.find(
        (sheet) => sheet.name === state.activeSheetName,
      ) || state.workbook.sheets[0]
    );
  }, [state.workbook, state.activeSheetName]);

  const loadWorkbook = async (file) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: "",
    }));

    try {
      const workbook = await readWorkbookFile(file);

      setState({
        workbook,
        activeSheetName: workbook.sheets[0]?.name || "",
        isLoading: false,
        error: "",
      });
    } catch (error) {
      setState({
        workbook: null,
        activeSheetName: "",
        isLoading: false,
        error:
          error?.message ||
          "Unable to read this file. Please try another .xlsx file.",
      });
    }
  };

  const selectSheet = (sheetName) => {
    setState((prev) => ({
      ...prev,
      activeSheetName: sheetName,
      error: "",
    }));
  };

  const resetWorkbook = () => {
    setState(INITIAL_STATE);
  };

  return {
    workbook: state.workbook,
    activeSheet,
    activeSheetName: state.activeSheetName,
    isLoading: state.isLoading,
    error: state.error,
    hasWorkbook: Boolean(state.workbook),
    loadWorkbook,
    selectSheet,
    resetWorkbook,
  };
}
