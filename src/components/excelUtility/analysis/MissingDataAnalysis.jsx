import PropTypes from "prop-types";
import AnalysisDownloadButton from "./AnalysisDownloadButton";
import AnalysisCopyActions from "./AnalysisCopyActions";
import { buildMissingSummaryText } from "../utils/analysisTextFormatters";
import AnalysisControlBar from "./AnalysisControlBar";
import AddToReportButton from "./AddToReportButton";

const formatPercentage = (value) => `${Number(value || 0).toFixed(1)}%`;

export default function MissingDataAnalysis({
  columns = [],
  selectedColumnIndex = "",
  missingResult,
  originalFileName = "analysis-output.xlsx",
  onSelectColumn,
  onAddReportItem,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Missing data check
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Find rows where an important column is blank.
          </p>
        </div>

        <AnalysisControlBar>
          <select
            value={selectedColumnIndex}
            onChange={(event) => onSelectColumn?.(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
          >
            <option value="">Select column</option>
            {columns.map((column) => (
              <option key={column.columnIndex} value={column.columnIndex}>
                {column.header}
              </option>
            ))}
          </select>

          <AnalysisDownloadButton
            result={missingResult}
            analysisType="missing"
            originalFileName={originalFileName}
            label="Download"
          />
          <AddToReportButton
            result={missingResult}
            type="missing"
            title={`Missing values in ${missingResult?.columnName || "Column"}`}
            summaryText={buildMissingSummaryText(missingResult)}
            tableRows={missingResult?.rows || []}
            onAddToReport={onAddReportItem}
          />
          <AnalysisCopyActions
            summaryText={buildMissingSummaryText(missingResult)}
            tableRows={missingResult?.rows || []}
          />
        </AnalysisControlBar>
      </div>

      {!missingResult ? (
        <div className="mt-4 rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
          Select a column to find missing values.
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <SummaryCard label="Rows checked" value={missingResult.totalRows} />
            <SummaryCard label="Missing" value={missingResult.missingCount} />
            <SummaryCard label="Present" value={missingResult.presentCount} />
            <SummaryCard
              label="Missing share"
              value={formatPercentage(missingResult.missingPercentage)}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Showing rows where{" "}
            <span className="font-semibold">{missingResult.columnName}</span> is
            blank.
          </div>

          <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  {missingResult.rows.length ? (
                    Object.keys(missingResult.rows[0]).map((header) => (
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
                {!missingResult.rows.length ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-slate-500">
                      No missing values found in this column.
                    </td>
                  </tr>
                ) : (
                  missingResult.rows.map((row, rowIndex) => (
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
      )}
    </div>
  );
}

MissingDataAnalysis.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      columnIndex: PropTypes.number,
      header: PropTypes.string,
    }),
  ),
  selectedColumnIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  originalFileName: PropTypes.string,
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
  onSelectColumn: PropTypes.func,
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
