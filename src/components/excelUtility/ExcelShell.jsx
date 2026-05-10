import { useState, useMemo, useEffect } from "react";
import SafetyNotice from "./SafetyNotice";
import ExcelUploader from "./ExcelUploader";
import WorkbookSummary from "./WorkbookSummary";
import SheetSelector from "./SheetSelector";
import BasicUtilitiesTab from "./basic/BasicUtilitiesTab";
import AnalysisTab from "./analysis/AnalysisTab";
import PreviewWorkspace from "./PreviewWorkspace";
import useWorkbook from "./hooks/useWorkbook";
import useExcelActions from "./hooks/useExcelActions";
import DownloadPanel from "./DownloadPanel";
import { buildQuickAnalysis } from "./engine/analysisEngine";
import { buildCountAnalysis } from "./engine/countAnalysisEngine";
import { buildMissingDataAnalysis } from "./engine/missingDataEngine";
import { buildDuplicateAnalysis } from "./engine/duplicateAnalysisEngine";
import { buildNumericAnalysis } from "./engine/numericAnalysisEngine";
import { buildDateAnalysis } from "./engine/dateAnalysisEngine";

const TABS = [
  { id: "basic", label: "Basic Utilities" },
  { id: "analysis", label: "Analysis" },
];

export default function ExcelShell() {
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedCountColumnIndex, setSelectedCountColumnIndex] = useState("");
  // const [selectedCountColumnIndex, setSelectedCountColumnIndex] = useState("");
  const [selectedMissingColumnIndex, setSelectedMissingColumnIndex] =
    useState("");
  const [selectedDuplicateColumnIndex, setSelectedDuplicateColumnIndex] =
    useState("");
  const [duplicateResult, setDuplicateResult] = useState(null);
  const [isDuplicateProcessing, setIsDuplicateProcessing] = useState(false);
  const [selectedNumericColumnIndex, setSelectedNumericColumnIndex] =
    useState("");
  const [selectedDateColumnIndex, setSelectedDateColumnIndex] = useState("");

  const {
    workbook,
    activeSheet,
    activeSheetName,
    isLoading,
    error,
    hasWorkbook,
    loadWorkbook,
    selectSheet,
    resetWorkbook,
  } = useWorkbook();

  const { result, hasResult, cleanData, clearResult, mergeSheets } =
    useExcelActions();

  const handleCleanData = () => {
    if (!activeSheet) return;
    cleanData(activeSheet);
  };

  const handleResetWorkbook = () => {
    resetWorkbook();
    clearResult();
    setSelectedCountColumnIndex("");
    setSelectedMissingColumnIndex("");
    setSelectedDuplicateColumnIndex("");
    setSelectedNumericColumnIndex("");
    setSelectedDateColumnIndex("");
    setDuplicateResult(null);
    setIsDuplicateProcessing(false);
  };

  const handleMergeSheets = () => {
    console.log("Merge clicked", workbook);
    if (!workbook) return;
    mergeSheets(workbook);
  };

  const handleSelectCountColumn = (columnIndex) => {
    setSelectedCountColumnIndex(columnIndex);
  };

  const analysis = useMemo(() => {
    if (!activeSheet) return null;
    return buildQuickAnalysis(activeSheet);
  }, [activeSheet]);

  const countResult = useMemo(() => {
    if (!activeSheet || selectedCountColumnIndex === "") return null;

    return buildCountAnalysis({
      sheet: activeSheet,
      columnIndex: Number(selectedCountColumnIndex),
    });
  }, [activeSheet, selectedCountColumnIndex]);

  const missingResult = useMemo(() => {
    if (!activeSheet || selectedMissingColumnIndex === "") return null;

    return buildMissingDataAnalysis({
      sheet: activeSheet,
      columnIndex: Number(selectedMissingColumnIndex),
    });
  }, [activeSheet, selectedMissingColumnIndex]);

  const handleSelectMissingColumn = (columnIndex) => {
    console.log("Missing column selected:", columnIndex);
    setSelectedMissingColumnIndex(columnIndex);
  };

  useEffect(() => {
    if (!activeSheet || selectedDuplicateColumnIndex === "") {
      setDuplicateResult(null);
      setIsDuplicateProcessing(false);
      return undefined;
    }

    let isCancelled = false;

    setIsDuplicateProcessing(true);
    setDuplicateResult(null);

    const timerId = window.setTimeout(() => {
      const result = buildDuplicateAnalysis({
        sheet: activeSheet,
        columnIndex: Number(selectedDuplicateColumnIndex),
      });

      if (!isCancelled) {
        setDuplicateResult(result);
        setIsDuplicateProcessing(false);
      }
    }, 50);

    return () => {
      isCancelled = true;
      window.clearTimeout(timerId);
    };
  }, [activeSheet, selectedDuplicateColumnIndex]);

  const handleSelectDuplicateColumn = (columnIndex) => {
    setSelectedDuplicateColumnIndex(columnIndex);
  };

  const numericResult = useMemo(() => {
    if (!activeSheet || selectedNumericColumnIndex === "") return null;

    return buildNumericAnalysis({
      sheet: activeSheet,
      columnIndex: Number(selectedNumericColumnIndex),
    });
  }, [activeSheet, selectedNumericColumnIndex]);

  const handleSelectNumericColumn = (columnIndex) => {
    setSelectedNumericColumnIndex(columnIndex);
  };

  const dateResult = useMemo(() => {
    if (!activeSheet || selectedDateColumnIndex === "") return null;

    return buildDateAnalysis({
      sheet: activeSheet,
      columnIndex: Number(selectedDateColumnIndex),
    });
  }, [activeSheet, selectedDateColumnIndex]);

  const handleSelectDateColumn = (columnIndex) => {
    setSelectedDateColumnIndex(columnIndex);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {isLoading ? <WorkbookLoadingOverlay /> : null}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Secure Excel Utility
              </p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                Simple Excel tools for office work
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Upload an Excel file, choose a plain-language action, preview
                the result, and download the output safely.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
              Files stay on your device
            </div>
          </div>
        </div>

        <SafetyNotice />

        {error ? (
          <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <div className="font-semibold">Could not read file</div>
            <p className="mt-1">{error}</p>
          </div>
        ) : null}

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr_1fr]">
          <ExcelUploader
            isLoading={isLoading}
            hasWorkbook={hasWorkbook}
            onFileSelect={loadWorkbook}
            onReset={handleResetWorkbook}
          />

          <WorkbookSummary
            fileName={workbook?.fileName || "No file uploaded"}
            sheetCount={workbook?.sheetCount || "—"}
            rowCount={activeSheet?.rowCount ?? "—"}
            columnCount={activeSheet?.columnCount ?? "—"}
          />

          <SheetSelector
            sheets={workbook?.sheets || []}
            activeSheetName={activeSheetName}
            onSelectSheet={(sheetName) => {
              selectSheet(sheetName);
              clearResult();
              setSelectedCountColumnIndex("");
              setSelectedMissingColumnIndex("");
              setSelectedDuplicateColumnIndex("");
              setSelectedNumericColumnIndex("");
              setSelectedDateColumnIndex("");
              setDuplicateResult(null);
              setIsDuplicateProcessing(false);
            }}
          />
        </section>

        <section className="mt-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    activeTab === tab.id
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "basic" ? (
            <BasicUtilitiesTab
              hasWorkbook={hasWorkbook}
              onCleanData={handleCleanData}
              onMergeSheets={handleMergeSheets}
            />
          ) : (
            <AnalysisTab
              hasWorkbook={hasWorkbook}
              analysis={analysis}
              selectedCountColumnIndex={selectedCountColumnIndex}
              countResult={countResult}
              onSelectCountColumn={handleSelectCountColumn}
              selectedMissingColumnIndex={selectedMissingColumnIndex}
              missingResult={missingResult}
              onSelectMissingColumn={handleSelectMissingColumn}
              selectedDuplicateColumnIndex={selectedDuplicateColumnIndex}
              duplicateResult={duplicateResult}
              isDuplicateProcessing={isDuplicateProcessing}
              onSelectDuplicateColumn={handleSelectDuplicateColumn}
              selectedNumericColumnIndex={selectedNumericColumnIndex}
              numericResult={numericResult}
              onSelectNumericColumn={handleSelectNumericColumn}
              selectedDateColumnIndex={selectedDateColumnIndex}
              dateResult={dateResult}
              onSelectDateColumn={handleSelectDateColumn}
            />
          )}
          <DownloadPanel
            hasResult={hasResult}
            result={result}
            originalFileName={workbook?.fileName || "excel-output.xlsx"}
            activeSheetName={activeSheet?.name || "Processed Sheet"}
          />
          <PreviewWorkspace
            activeSheet={activeSheet}
            hasWorkbook={hasWorkbook}
            result={result}
            hasResult={hasResult}
            onClearResult={clearResult}
          />
        </section>
      </section>
    </main>
  );
}

function WorkbookLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />

        <h2 className="mt-5 text-base font-bold text-slate-900">
          Reading Excel file
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Large files may take a little longer. Please keep this page open.
        </p>

        <div className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800">
          Your file is being processed inside this browser.
        </div>
      </div>
    </div>
  );
}
