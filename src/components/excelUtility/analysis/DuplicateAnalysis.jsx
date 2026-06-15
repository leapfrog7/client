import PropTypes from "prop-types";
import AnalysisDownloadButton from "./AnalysisDownloadButton";
import AnalysisCopyActions from "./AnalysisCopyActions";
import { buildDuplicateSummaryText } from "../utils/analysisTextFormatters";
import AnalysisControlBar from "./AnalysisControlBar";
import AddToReportButton from "./AddToReportButton";

export default function DuplicateAnalysis({
  columns = [],
  selectedColumnIndex = "",
  duplicateResult,
  isProcessing = false,
  originalFileName = "analysis-output.xlsx",
  onSelectColumn,
  onAddReportItem,
}) {
  const identifierFriendlyColumns = columns.filter((column) =>
    ["Identifier", "Text", "Category"].includes(column.role),
  );

  const selectableColumns = identifierFriendlyColumns.length
    ? identifierFriendlyColumns
    : columns;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Duplicate check
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Find repeated values in columns like mobile number, bill number,
            file number, ID or name.
          </p>
        </div>

        <AnalysisControlBar>
          <select
            value={selectedColumnIndex}
            onChange={(event) => onSelectColumn?.(event.target.value)}
            disabled={isProcessing}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select column</option>
            {selectableColumns.map((column) => (
              <option key={column.columnIndex} value={column.columnIndex}>
                {column.header}
              </option>
            ))}
          </select>

          <AnalysisDownloadButton
            result={duplicateResult}
            analysisType="duplicates"
            originalFileName={originalFileName}
            label="Download"
          />
          <AddToReportButton
            result={duplicateResult}
            type="duplicates"
            title={`Duplicate check for ${duplicateResult?.columnName || "Column"}`}
            summaryText={buildDuplicateSummaryText(duplicateResult)}
            tableRows={duplicateResult?.rows || []}
            onAddToReport={onAddReportItem}
          />
          <AnalysisCopyActions
            summaryText={buildDuplicateSummaryText(duplicateResult)}
            tableRows={duplicateResult?.rows || []}
          />
        </AnalysisControlBar>
      </div>

      {isProcessing ? (
        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />
            <div>
              <div className="text-sm font-semibold text-blue-950">
                Checking duplicate values
              </div>
              <p className="mt-1 text-xs text-blue-800">
                Larger sheets may take a few seconds. Please keep this page
                open.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!duplicateResult && !isProcessing ? (
        <div className="mt-4 rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
          Select a column to check duplicate values.
        </div>
      ) : null}

      {duplicateResult && !isProcessing ? (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Rows checked"
              value={duplicateResult.totalRows}
            />
            <SummaryCard
              label="Duplicate groups"
              value={duplicateResult.duplicateGroupsCount}
            />
            <SummaryCard
              label="Duplicate records"
              value={duplicateResult.duplicateRecordCount}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Checking duplicates in{" "}
            <span className="font-semibold">{duplicateResult.columnName}</span>.
            Blank values are ignored.
          </div>

          <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  {duplicateResult.rows.length ? (
                    Object.keys(duplicateResult.rows[0]).map((header) => (
                      <th
                        key={header}
                        className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                      >
                        {header}
                      </th>
                    ))
                  ) : (
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Result
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {!duplicateResult.rows.length ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-500">
                      No duplicate values found in this column.
                    </td>
                  </tr>
                ) : (
                  duplicateResult.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.entries(row).map(([key, value]) => (
                        <td
                          key={`${rowIndex}-${key}`}
                          className="max-w-[240px] whitespace-nowrap px-4 py-3 text-slate-700"
                          title={String(value)}
                        >
                          <span className="block truncate">{value || "—"}</span>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}

DuplicateAnalysis.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      columnIndex: PropTypes.number,
      header: PropTypes.string,
      role: PropTypes.string,
    }),
  ),
  selectedColumnIndex: PropTypes.oneOfType([
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
  isProcessing: PropTypes.bool,
  onSelectColumn: PropTypes.func,
  originalFileName: PropTypes.string,
  onAddReportItem: PropTypes.func,
};

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 truncate text-base font-bold text-slate-900">
        {value}
      </div>
    </div>
  );
}

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
