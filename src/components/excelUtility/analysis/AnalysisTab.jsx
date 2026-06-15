import { useState } from "react";
import PropTypes from "prop-types";
import QuickSummary from "./QuickSummary";
import ColumnRolePanel from "./ColumnRolePanel";
import SuggestedActions from "./SuggestedActions";
import CountAnalysis from "./CountAnalysis";
import MissingDataAnalysis from "./MissingDataAnalysis";
import DuplicateAnalysis from "./DuplicateAnalysis";
import NumericAnalysis from "./NumericAnalysis";
import DateAnalysis from "./DateAnalysis";
import TimeAnalysis from "./TimeAnalysis";

const ANALYSIS_TABS = [
  { id: "overview", label: "Overview" },
  { id: "count", label: "Count" },
  { id: "missing", label: "Missing Data" },
  { id: "duplicates", label: "Duplicates" },
  { id: "totals", label: "Totals" },
  { id: "dates", label: "Dates" },
  { id: "time", label: "Time" },
  { id: "report", label: "Report" },
];

export default function AnalysisTab({
  hasWorkbook = false,
  analysis,
  originalFileName = "analysis-output.xlsx",

  selectedCountColumnIndex = "",
  countResult,
  onSelectCountColumn,

  selectedMissingColumnIndex = "",
  missingResult,
  onSelectMissingColumn,

  selectedDuplicateColumnIndex = "",
  duplicateResult,
  onSelectDuplicateColumn,
  isDuplicateProcessing = false,

  selectedNumericColumnIndex = "",
  numericResult,
  onSelectNumericColumn,

  selectedDateColumnIndex = "",
  dateResult,
  onSelectDateColumn,

  selectedTimeColumnIndex = "",
  timeResult,
  onSelectTimeColumn,

  reportItems = [],
  reportItemCount = 0,
  hasReportItems = false,
  onAddReportItem,
  onRemoveReportItem,
  onClearReport,
}) {
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("overview");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Analysis</h2>
          <p className="mt-1 text-sm text-slate-500">
            Understand your sheet without formulas or pivot tables.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Behaviour-based detection
        </span>
      </div>

      {!hasWorkbook ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
          Upload an Excel file to view summary and analysis tools.
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <div className="inline-flex min-w-full gap-2 rounded-2xl bg-slate-100 p-1 sm:min-w-0">
          {ANALYSIS_TABS.map((tab) => {
            const tabLabel =
              tab.id === "report" && reportItemCount
                ? `Report (${reportItemCount})`
                : tab.label;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveAnalysisTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeAnalysisTab === tab.id
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        {activeAnalysisTab === "overview" ? (
          <div className="grid gap-4 xl:grid-cols-[0.8fr_1.4fr_0.8fr]">
            <QuickSummary summary={analysis?.summary} />
            <ColumnRolePanel columns={analysis?.columns || []} />
            <SuggestedActions actions={analysis?.suggestedActions || []} />
          </div>
        ) : null}

        {activeAnalysisTab === "count" ? (
          <CountAnalysis
            columns={analysis?.columns || []}
            selectedColumnIndex={selectedCountColumnIndex}
            countResult={countResult}
            originalFileName={originalFileName}
            onSelectColumn={onSelectCountColumn}
            onAddReportItem={onAddReportItem}
          />
        ) : null}

        {activeAnalysisTab === "missing" ? (
          <MissingDataAnalysis
            columns={analysis?.columns || []}
            selectedColumnIndex={selectedMissingColumnIndex}
            missingResult={missingResult}
            originalFileName={originalFileName}
            onSelectColumn={onSelectMissingColumn}
            onAddReportItem={onAddReportItem}
          />
        ) : null}

        {activeAnalysisTab === "duplicates" ? (
          <DuplicateAnalysis
            columns={analysis?.columns || []}
            selectedColumnIndex={selectedDuplicateColumnIndex}
            duplicateResult={duplicateResult}
            isProcessing={isDuplicateProcessing}
            originalFileName={originalFileName}
            onSelectColumn={onSelectDuplicateColumn}
            onAddReportItem={onAddReportItem}
          />
        ) : null}

        {activeAnalysisTab === "totals" ? (
          <NumericAnalysis
            columns={analysis?.columns || []}
            selectedColumnIndex={selectedNumericColumnIndex}
            numericResult={numericResult}
            originalFileName={originalFileName}
            onSelectColumn={onSelectNumericColumn}
            onAddReportItem={onAddReportItem}
          />
        ) : null}

        {activeAnalysisTab === "dates" ? (
          <DateAnalysis
            columns={analysis?.columns || []}
            selectedColumnIndex={selectedDateColumnIndex}
            dateResult={dateResult}
            originalFileName={originalFileName}
            onSelectColumn={onSelectDateColumn}
            onAddReportItem={onAddReportItem}
          />
        ) : null}

        {activeAnalysisTab === "time" ? (
          <TimeAnalysis
            columns={analysis?.columns || []}
            selectedColumnIndex={selectedTimeColumnIndex}
            timeResult={timeResult}
            originalFileName={originalFileName}
            onSelectColumn={onSelectTimeColumn}
            onAddReportItem={onAddReportItem}
          />
        ) : null}

        {activeAnalysisTab === "report" ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Analysis report
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Selected analysis items will appear here.
                </p>
              </div>

              <button
                type="button"
                disabled={!hasReportItems}
                onClick={onClearReport}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear report
              </button>
            </div>

            {!hasReportItems ? (
              <div className="mt-4 rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
                No analysis added yet. Use “Add to Report” from any analysis
                tab.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {reportItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase text-slate-400">
                          Item {index + 1} · {item.type}
                        </div>
                        <h4 className="mt-1 text-sm font-bold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="mt-2 text-sm text-slate-600">
                          {item.summaryText}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveReportItem?.(item.id)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-800">
                  Combined download will be added in the next step.
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

AnalysisTab.propTypes = {
  hasWorkbook: PropTypes.bool,
  originalFileName: PropTypes.string,

  analysis: PropTypes.shape({
    summary: PropTypes.shape({
      totalRows: PropTypes.number,
      totalColumns: PropTypes.number,
      blankCells: PropTypes.number,
      duplicateRows: PropTypes.number,
      columnsWithMissingValues: PropTypes.number,
    }),

    columns: PropTypes.arrayOf(
      PropTypes.shape({
        columnIndex: PropTypes.number,
        header: PropTypes.string,
        rawType: PropTypes.string,
        role: PropTypes.string,
        suggestedUse: PropTypes.string,
        missingCount: PropTypes.number,
        uniqueCount: PropTypes.number,
        duplicateCount: PropTypes.number,
        totalChecked: PropTypes.number,
        nonBlankCount: PropTypes.number,
        uniqueRatio: PropTypes.number,
        sampleSize: PropTypes.number,
        confidence: PropTypes.string,
      }),
    ),

    suggestedActions: PropTypes.arrayOf(PropTypes.string),
  }),

  selectedCountColumnIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  countResult: PropTypes.shape({
    type: PropTypes.string,
    columnIndex: PropTypes.number,
    columnName: PropTypes.string,
    totalRows: PropTypes.number,
    totalGroups: PropTypes.number,
    blankCount: PropTypes.number,
    topValue: PropTypes.string,
    topCount: PropTypes.number,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        count: PropTypes.number,
        percentage: PropTypes.number,
      }),
    ),
  }),

  onSelectCountColumn: PropTypes.func,

  selectedMissingColumnIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  missingResult: PropTypes.shape({
    type: PropTypes.string,
    columnIndex: PropTypes.number,
    columnName: PropTypes.string,
    totalRows: PropTypes.number,
    missingCount: PropTypes.number,
    presentCount: PropTypes.number,
    missingPercentage: PropTypes.number,
    rows: PropTypes.arrayOf(PropTypes.object),
  }),

  onSelectMissingColumn: PropTypes.func,

  selectedDuplicateColumnIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  duplicateResult: PropTypes.shape({
    type: PropTypes.string,
    columnIndex: PropTypes.number,
    columnName: PropTypes.string,
    totalRows: PropTypes.number,
    duplicateGroupsCount: PropTypes.number,
    duplicateRecordCount: PropTypes.number,
    duplicateGroups: PropTypes.arrayOf(PropTypes.object),
    rows: PropTypes.arrayOf(PropTypes.object),
  }),

  onSelectDuplicateColumn: PropTypes.func,
  isDuplicateProcessing: PropTypes.bool,

  selectedNumericColumnIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  numericResult: PropTypes.shape({
    type: PropTypes.string,
    columnIndex: PropTypes.number,
    columnName: PropTypes.string,
    context: PropTypes.string,
    caution: PropTypes.string,
    totalRows: PropTypes.number,
    numericCount: PropTypes.number,
    blankCount: PropTypes.number,
    nonNumericCount: PropTypes.number,
    total: PropTypes.number,
    average: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    minRowNumber: PropTypes.number,
    maxRowNumber: PropTypes.number,
    formatted: PropTypes.shape({
      total: PropTypes.string,
      average: PropTypes.string,
      min: PropTypes.string,
      max: PropTypes.string,
    }),
  }),

  onSelectNumericColumn: PropTypes.func,

  selectedDateColumnIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  dateResult: PropTypes.shape({
    type: PropTypes.string,
    columnIndex: PropTypes.number,
    columnName: PropTypes.string,
    totalRows: PropTypes.number,
    validDateCount: PropTypes.number,
    blankCount: PropTypes.number,
    invalidCount: PropTypes.number,
    earliestDate: PropTypes.instanceOf(Date),
    latestDate: PropTypes.instanceOf(Date),
    monthWise: PropTypes.arrayOf(
      PropTypes.shape({
        monthKey: PropTypes.string,
        label: PropTypes.string,
        count: PropTypes.number,
      }),
    ),
    yearWise: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.string,
        count: PropTypes.number,
      }),
    ),
  }),

  onSelectDateColumn: PropTypes.func,

  selectedTimeColumnIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  timeResult: PropTypes.shape({
    type: PropTypes.string,
    columnIndex: PropTypes.number,
    columnName: PropTypes.string,
    totalRows: PropTypes.number,
    validTimeCount: PropTypes.number,
    blankCount: PropTypes.number,
    invalidCount: PropTypes.number,
    earliestTime: PropTypes.number,
    latestTime: PropTypes.number,
    hourWise: PropTypes.arrayOf(
      PropTypes.shape({
        hourKey: PropTypes.string,
        label: PropTypes.string,
        count: PropTypes.number,
      }),
    ),
    periodWise: PropTypes.arrayOf(
      PropTypes.shape({
        period: PropTypes.string,
        count: PropTypes.number,
      }),
    ),
  }),

  onSelectTimeColumn: PropTypes.func,

  reportItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
      title: PropTypes.string,
      summaryText: PropTypes.string,
      tableRows: PropTypes.arrayOf(PropTypes.object),
      tableHeaders: PropTypes.arrayOf(PropTypes.string),
      createdAt: PropTypes.string,
    }),
  ),
  reportItemCount: PropTypes.number,
  hasReportItems: PropTypes.bool,
  reportSummaryText: PropTypes.string,
  onAddReportItem: PropTypes.func,
  onRemoveReportItem: PropTypes.func,
  onClearReport: PropTypes.func,
};
