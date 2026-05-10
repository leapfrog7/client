import { useState } from "react";
import PropTypes from "prop-types";

const DISPLAY_UNITS = [
  { value: "plain", label: "Plain number", divisor: 1, suffix: "" },
  { value: "rupees", label: "₹ Rupees", divisor: 1, suffix: "" },
  { value: "thousand", label: "Thousands", divisor: 1000, suffix: " thousand" },
  { value: "lakh", label: "Lakhs", divisor: 100000, suffix: " lakh" },
  { value: "crore", label: "Crores", divisor: 10000000, suffix: " crore" },
  { value: "million", label: "Million", divisor: 1000000, suffix: " million" },
  {
    value: "billion",
    label: "Billion",
    divisor: 1000000000,
    suffix: " billion",
  },
];

const getDisplayUnit = (unitValue) => {
  return (
    DISPLAY_UNITS.find((unit) => unit.value === unitValue) || DISPLAY_UNITS[0]
  );
};

const formatNumber = (value, displayUnitValue) => {
  const unit = getDisplayUnit(displayUnitValue);
  const convertedValue = Number(value || 0) / unit.divisor;

  const formatted = convertedValue.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

  if (unit.value === "rupees") {
    return `₹${formatted}`;
  }

  return `${formatted}${unit.suffix}`;
};

export default function NumericAnalysis({
  columns = [],
  selectedColumnIndex = "",
  numericResult,
  onSelectColumn,
}) {
  const [displayUnit, setDisplayUnit] = useState("plain");

  const numericFriendlyColumns = columns.filter((column) =>
    ["Measure", "Number"].includes(column.role),
  );

  const selectableColumns = numericFriendlyColumns.length
    ? numericFriendlyColumns
    : columns;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Totals and numbers
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Use this for amount, quantity, expenditure, budget, posts, cases and
            similar numeric columns.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selectedColumnIndex}
            onChange={(event) => onSelectColumn?.(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
          >
            <option value="">Select numeric column</option>
            {selectableColumns.map((column) => (
              <option key={column.columnIndex} value={column.columnIndex}>
                {column.header}
              </option>
            ))}
          </select>

          <select
            value={displayUnit}
            onChange={(event) => setDisplayUnit(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
          >
            {DISPLAY_UNITS.map((unit) => (
              <option key={unit.value} value={unit.value}>
                Show as {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!numericResult ? (
        <div className="mt-4 rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
          Select a column to calculate total, average, highest and lowest value.
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <div className="font-semibold">{numericResult.context}</div>
            <p className="mt-1 text-xs text-blue-800">
              {numericResult.caution}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Display format only. The underlying values are not changed.
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Total"
              value={formatNumber(numericResult.total, displayUnit)}
            />
            <SummaryCard
              label="Average"
              value={formatNumber(numericResult.average, displayUnit)}
            />
            <SummaryCard
              label="Lowest"
              value={`${formatNumber(numericResult.min, displayUnit)}${
                numericResult.minRowNumber
                  ? ` · Row ${numericResult.minRowNumber}`
                  : ""
              }`}
            />
            <SummaryCard
              label="Highest"
              value={`${formatNumber(numericResult.max, displayUnit)}${
                numericResult.maxRowNumber
                  ? ` · Row ${numericResult.maxRowNumber}`
                  : ""
              }`}
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SummaryCard
              label="Numeric values"
              value={numericResult.numericCount}
            />
            <SummaryCard
              label="Blank values"
              value={numericResult.blankCount}
            />
            <SummaryCard
              label="Non-numeric values"
              value={numericResult.nonNumericCount}
            />
          </div>
        </>
      )}
    </div>
  );
}

NumericAnalysis.propTypes = {
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
  onSelectColumn: PropTypes.func,
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
