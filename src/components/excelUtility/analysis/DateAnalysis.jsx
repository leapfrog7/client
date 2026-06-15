import { useState } from "react";
import PropTypes from "prop-types";
import { formatDateForDisplay } from "../engine/dateAnalysisEngine";
import AnalysisDownloadButton from "./AnalysisDownloadButton";
import AnalysisCopyActions from "./AnalysisCopyActions";
import {
  buildDateSummaryText,
  buildDateTableRows,
} from "../utils/analysisTextFormatters";
import AnalysisControlBar from "./AnalysisControlBar";
import AddToReportButton from "./AddToReportButton";

const DATE_FORMATS = [
  { value: "dd/mm/yyyy", label: "DD/MM/YYYY" },
  { value: "dd-mmm-yyyy", label: "01 Jan 2026" },
  { value: "dd-mmmm-yyyy", label: "01 January 2026" },
  { value: "mmm-yyyy", label: "Jan 2026" },
  { value: "mmmm-yyyy", label: "January 2026" },
];

export default function DateAnalysis({
  columns = [],
  selectedColumnIndex = "",
  dateResult,
  onSelectColumn,
  originalFileName = "analysis-output.xlsx",
  onAddReportItem,
}) {
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [viewMode, setViewMode] = useState("chart");

  const dateFriendlyColumns = columns.filter((column) =>
    ["Date field"].includes(column.role),
  );
  const [selectedYear, setSelectedYear] = useState("");

  const selectableColumns = dateFriendlyColumns.length
    ? dateFriendlyColumns
    : columns;

  const availableYears = dateResult?.yearWise || [];

  const activeYear = selectedYear || availableYears[0]?.year || "";

  const monthRowsForSelectedYear =
    dateResult?.monthWiseByYear?.[activeYear] || [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Date analysis
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Use this for receipt date, disposal date, sanction date, due date,
            month, year and similar date fields.
          </p>
        </div>

        <AnalysisControlBar>
          <select
            value={selectedColumnIndex}
            onChange={(event) => onSelectColumn?.(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
          >
            <option value="">Select date column</option>
            {selectableColumns.map((column) => (
              <option key={column.columnIndex} value={column.columnIndex}>
                {column.header}
              </option>
            ))}
          </select>

          <select
            value={dateFormat}
            onChange={(event) => setDateFormat(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
          >
            {DATE_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                Show as {format.label}
              </option>
            ))}
          </select>
          <AnalysisDownloadButton
            result={dateResult}
            analysisType="dates"
            originalFileName={originalFileName}
            label="Download"
          />
          <AddToReportButton
            result={dateResult}
            type="dates"
            title={`Date analysis for ${dateResult?.columnName || "Column"}`}
            summaryText={buildDateSummaryText(dateResult)}
            tableRows={buildDateTableRows(dateResult)}
            onAddToReport={onAddReportItem}
          />
          <AnalysisCopyActions
            summaryText={buildDateSummaryText(dateResult)}
            tableRows={buildDateTableRows(dateResult)}
          />
        </AnalysisControlBar>
      </div>

      {!dateResult ? (
        <div className="mt-4 rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
          Select a date column to see date range and month-wise summary.
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <div className="font-semibold">Indian date display by default</div>
            <p className="mt-1 text-xs text-blue-800">
              Dates are shown in DD/MM/YYYY unless you select another display
              format. Original file values are not changed.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Rows checked" value={dateResult.totalRows} />
            <SummaryCard
              label="Valid dates"
              value={dateResult.validDateCount}
            />
            <SummaryCard label="Blank values" value={dateResult.blankCount} />
            <SummaryCard
              label="Invalid / unclear"
              value={dateResult.invalidCount}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SummaryCard
              label="Earliest date"
              value={formatDateForDisplay(dateResult.earliestDate, dateFormat)}
            />
            <SummaryCard
              label="Latest date"
              value={formatDateForDisplay(dateResult.latestDate, dateFormat)}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Date distribution
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Select a year to view month-wise distribution for that year.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={activeYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
              >
                {availableYears.map((item) => (
                  <option key={item.year} value={item.year}>
                    {item.year}
                  </option>
                ))}
              </select>

              <div className="rounded-2xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    viewMode === "table"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600"
                  }`}
                >
                  Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("chart")}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                    viewMode === "chart"
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600"
                  }`}
                >
                  Chart
                </button>
              </div>
            </div>
          </div>

          {viewMode === "chart" ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <SimpleBarChart
                title="Year-wise count"
                rows={dateResult.yearWise}
                labelKey="year"
                selectedKey={activeYear}
                onSelectKey={setSelectedYear}
              />

              <SimpleBarChart
                title={`Month-wise count for ${activeYear || "selected year"}`}
                rows={monthRowsForSelectedYear}
                labelKey="label"
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <DateSummaryTable
                title="Year-wise count"
                firstColumn="Year"
                rows={dateResult.yearWise}
                labelKey="year"
                selectedKey={activeYear}
                onSelectKey={setSelectedYear}
              />

              <DateSummaryTable
                title={`Month-wise count for ${activeYear || "selected year"}`}
                firstColumn="Month"
                rows={monthRowsForSelectedYear}
                labelKey="label"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

DateAnalysis.propTypes = {
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
    monthWiseByYear: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          monthKey: PropTypes.string,
          label: PropTypes.string,
          count: PropTypes.number,
        }),
      ),
    ),
  }),
  onSelectColumn: PropTypes.func,
  originalFileName: PropTypes.string,
  onAddReportItem: PropTypes.func,
};

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 truncate text-base font-bold text-slate-900">
        {value || "—"}
      </div>
    </div>
  );
}

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const DATE_CHART_COLORS = {
  year: "#131D8F",
  q1: "#6972DB", // Jan-Mar
  q2: "#69D9DB", // Apr-Jun
  q3: "#E677C1", // Jul-Sep
  q4: "#E6BA77", // Oct-Dec
};

const getQuarterFromLabel = (label = "") => {
  const monthText = String(label).toLowerCase();

  if (["jan", "feb", "mar"].some((month) => monthText.includes(month))) {
    return "q1";
  }

  if (["apr", "may", "jun"].some((month) => monthText.includes(month))) {
    return "q2";
  }

  if (["jul", "aug", "sep"].some((month) => monthText.includes(month))) {
    return "q3";
  }

  if (["oct", "nov", "dec"].some((month) => monthText.includes(month))) {
    return "q4";
  }

  return "year";
};

const getDateBarColor = ({ title, label }) => {
  const isYearChart = String(title).toLowerCase().includes("year");

  if (isYearChart) {
    return DATE_CHART_COLORS.year;
  }

  const quarter = getQuarterFromLabel(label);
  return DATE_CHART_COLORS[quarter] || DATE_CHART_COLORS.year;
};

function SimpleBarChart({
  title,
  rows = [],
  labelKey,
  selectedKey = "",
  onSelectKey,
}) {
  const maxCount = rows.reduce((max, row) => Math.max(max, row.count || 0), 0);
  const isYearChart = String(title).toLowerCase().includes("year");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {rows.length} groups
        </span>
      </div>

      {!rows.length ? (
        <div className="mt-4 rounded-xl bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
          No date values found.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row) => {
            const width = maxCount ? (row.count / maxCount) * 100 : 0;
            const rowKey = row[labelKey];
            const isSelected = selectedKey && rowKey === selectedKey;

            return (
              <button
                key={rowKey}
                type="button"
                onClick={() => onSelectKey?.(rowKey)}
                className={`w-full rounded-xl p-2 text-left transition ${
                  isSelected
                    ? "bg-blue-50 ring-2 ring-blue-300"
                    : onSelectKey
                      ? "hover:bg-slate-50"
                      : ""
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="max-w-[180px] truncate font-medium text-slate-700">
                      {rowKey}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {row.count}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${width}%`,
                        backgroundColor: getDateBarColor({
                          title,
                          label: rowKey,
                        }),
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {!isYearChart ? <QuarterLegend /> : null}
    </div>
  );
}

SimpleBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string.isRequired,
  selectedKey: PropTypes.string,
  onSelectKey: PropTypes.func,
};

function QuarterLegend() {
  const items = [
    { label: "Jan-Mar", color: DATE_CHART_COLORS.q1 },
    { label: "Apr-Jun", color: DATE_CHART_COLORS.q2 },
    { label: "Jul-Sep", color: DATE_CHART_COLORS.q3 },
    { label: "Oct-Dec", color: DATE_CHART_COLORS.q4 },
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-3 rounded-xl bg-slate-50 px-3 py-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-xs">
          <span
            className="h-3 w-3 rounded-full border border-slate-300"
            style={{ backgroundColor: item.color }}
          />
          <span className="font-medium text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

SimpleBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string.isRequired,
  selectedKey: PropTypes.string,
  onSelectKey: PropTypes.func,
};

SimpleBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string.isRequired,
};

function DateSummaryTable({
  title,
  firstColumn,
  rows = [],
  labelKey,
  selectedKey = "",
  onSelectKey,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>

      <div className="max-h-[320px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                {firstColumn}
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Count
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {!rows.length ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No date values found.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const rowKey = row[labelKey];
                const isSelected = selectedKey && rowKey === selectedKey;

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onSelectKey?.(rowKey)}
                    className={`${
                      onSelectKey ? "cursor-pointer hover:bg-slate-50" : ""
                    } ${isSelected ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-4 py-3 text-slate-700">{rowKey}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {row.count}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DateSummaryTable.propTypes = {
  title: PropTypes.string.isRequired,
  firstColumn: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string.isRequired,
  selectedKey: PropTypes.string,
  onSelectKey: PropTypes.func,
};

DateSummaryTable.propTypes = {
  title: PropTypes.string.isRequired,
  firstColumn: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string.isRequired,
};
