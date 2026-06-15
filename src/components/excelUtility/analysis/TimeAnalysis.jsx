import { useState } from "react";
import PropTypes from "prop-types";
import { formatTimeForDisplay } from "../engine/timeAnalysisEngine";
import AnalysisDownloadButton from "./AnalysisDownloadButton";
import AnalysisCopyActions from "./AnalysisCopyActions";
import {
  buildTimeSummaryText,
  buildTimeTableRows,
} from "../utils/analysisTextFormatters";
import AnalysisControlBar from "./AnalysisControlBar";
import AddToReportButton from "./AddToReportButton";

const TIME_FORMATS = [
  { value: "hh:mm-a", label: "10:30 AM" },
  { value: "hh:mm:ss-a", label: "10:30:00 AM" },
  { value: "hh:mm-24", label: "14:30" },
  { value: "hh:mm:ss-24", label: "14:30:00" },
];

const TIME_CHART_COLORS = {
  am: "#2563eb",
  pm: "#7c3aed",
  morning: "#2563eb",
  afternoon: "#059669",
  evening: "#d97706",
  night: "#64748b",
};

const getHourColor = (label = "") => {
  const hour = Number(String(label).slice(0, 2));

  if (hour >= 6 && hour < 12) return TIME_CHART_COLORS.morning;
  if (hour >= 12 && hour < 17) return TIME_CHART_COLORS.afternoon;
  if (hour >= 17 && hour < 21) return TIME_CHART_COLORS.evening;

  return TIME_CHART_COLORS.night;
};

export default function TimeAnalysis({
  columns = [],
  selectedColumnIndex = "",
  timeResult,
  originalFileName = "analysis-output.xlsx",
  onSelectColumn,
  onAddReportItem,
}) {
  const [timeFormat, setTimeFormat] = useState("hh:mm-a");
  const [viewMode, setViewMode] = useState("chart");

  const timeFriendlyColumns = columns.filter((column) =>
    ["Time field", "Date-time field"].includes(column.role),
  );

  const selectableColumns = timeFriendlyColumns.length
    ? timeFriendlyColumns
    : columns;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Time analysis
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Use this for entry time, exit time, receipt time, dispatch time,
            meeting time and similar columns.
          </p>
        </div>

        <AnalysisControlBar>
          <select
            value={selectedColumnIndex}
            onChange={(event) => onSelectColumn?.(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
          >
            <option value="">Select time column</option>
            {selectableColumns.map((column) => (
              <option key={column.columnIndex} value={column.columnIndex}>
                {column.header}
              </option>
            ))}
          </select>

          <select
            value={timeFormat}
            onChange={(event) => setTimeFormat(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
          >
            {TIME_FORMATS.map((format) => (
              <option key={format.value} value={format.value}>
                Show as {format.label}
              </option>
            ))}
          </select>

          <AnalysisDownloadButton
            result={timeResult}
            analysisType="time"
            originalFileName={originalFileName}
            label="Download"
          />
          <AddToReportButton
            result={timeResult}
            type="time"
            title={`Time analysis for ${timeResult?.columnName || "Column"}`}
            summaryText={buildTimeSummaryText(timeResult)}
            tableRows={buildTimeTableRows(timeResult)}
            onAddToReport={onAddReportItem}
          />
          <AnalysisCopyActions
            summaryText={buildTimeSummaryText(timeResult)}
            tableRows={buildTimeTableRows(timeResult)}
          />
        </AnalysisControlBar>
      </div>

      {!timeResult ? (
        <div className="mt-4 rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
          Select a time column to see time range and hour-wise summary.
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <div className="font-semibold">
              Time values are handled separately
            </div>
            <p className="mt-1 text-xs text-blue-800">
              Excel may store time as a fraction of a day. This tool separates
              time from ordinary numbers.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Rows checked" value={timeResult.totalRows} />
            <SummaryCard
              label="Valid times"
              value={timeResult.validTimeCount}
            />
            <SummaryCard label="Blank values" value={timeResult.blankCount} />
            <SummaryCard
              label="Invalid / unclear"
              value={timeResult.invalidCount}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SummaryCard
              label="Earliest time"
              value={formatTimeForDisplay(timeResult.earliestTime, timeFormat)}
            />
            <SummaryCard
              label="Latest time"
              value={formatTimeForDisplay(timeResult.latestTime, timeFormat)}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Time distribution
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Hour-wise and AM/PM distribution of time values.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-1">
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
            </div>
          </div>

          {viewMode === "chart" ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <TimeBarChart
                title="Hour-wise count"
                rows={timeResult.hourWise}
                labelKey="label"
              />

              <TimeBarChart
                title="AM / PM split"
                rows={timeResult.periodWise}
                labelKey="period"
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <TimeSummaryTable
                title="Hour-wise count"
                firstColumn="Hour"
                rows={timeResult.hourWise}
                labelKey="label"
              />

              <TimeSummaryTable
                title="AM / PM split"
                firstColumn="Period"
                rows={timeResult.periodWise}
                labelKey="period"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

TimeAnalysis.propTypes = {
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
  originalFileName: PropTypes.string,
  onSelectColumn: PropTypes.func,
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

function TimeBarChart({ title, rows = [], labelKey }) {
  const maxCount = rows.reduce((max, row) => Math.max(max, row.count || 0), 0);
  const isPeriodChart = String(title).toLowerCase().includes("am");

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
          No time values found.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row) => {
            const width = maxCount ? (row.count / maxCount) * 100 : 0;
            const rowKey = row[labelKey];

            const color = isPeriodChart
              ? rowKey === "AM"
                ? TIME_CHART_COLORS.am
                : TIME_CHART_COLORS.pm
              : getHourColor(rowKey);

            return (
              <div key={rowKey} className="space-y-1">
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
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isPeriodChart ? <TimeLegend /> : null}
    </div>
  );
}

TimeBarChart.propTypes = {
  title: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string.isRequired,
};

function TimeLegend() {
  const items = [
    { label: "Morning", color: TIME_CHART_COLORS.morning },
    { label: "Afternoon", color: TIME_CHART_COLORS.afternoon },
    { label: "Evening", color: TIME_CHART_COLORS.evening },
    { label: "Night", color: TIME_CHART_COLORS.night },
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

function TimeSummaryTable({ title, firstColumn, rows = [], labelKey }) {
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
                  No time values found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row[labelKey]}>
                  <td className="px-4 py-3 text-slate-700">{row[labelKey]}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">
                    {row.count}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

TimeSummaryTable.propTypes = {
  title: PropTypes.string.isRequired,
  firstColumn: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string.isRequired,
};
