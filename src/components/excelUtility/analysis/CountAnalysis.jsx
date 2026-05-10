import PropTypes from "prop-types";

const formatPercentage = (value) => {
  return `${Number(value || 0).toFixed(1)}%`;
};

export default function CountAnalysis({
  columns = [],
  selectedColumnIndex = "",
  countResult,
  onSelectColumn,
}) {
  const categoryFriendlyColumns = columns.filter((column) =>
    ["Category", "Status / Flag", "Text"].includes(column.role),
  );

  const selectableColumns = categoryFriendlyColumns.length
    ? categoryFriendlyColumns
    : columns;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Count by column
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Useful for office, section, status, designation, type, category and
            similar columns.
          </p>
        </div>

        <select
          value={selectedColumnIndex}
          onChange={(event) => onSelectColumn?.(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
        >
          <option value="">Select column</option>
          {selectableColumns.map((column) => (
            <option key={column.columnIndex} value={column.columnIndex}>
              {column.header}
            </option>
          ))}
        </select>
      </div>

      {!countResult ? (
        <div className="mt-4 rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
          Select a column to see count summary.
        </div>
      ) : (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <SummaryCard label="Rows checked" value={countResult.totalRows} />
            <SummaryCard label="Groups found" value={countResult.totalGroups} />
            <SummaryCard label="Blank values" value={countResult.blankCount} />
            <SummaryCard
              label="Top value"
              value={`${countResult.topValue} (${countResult.topCount})`}
            />
          </div>

          <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {countResult.columnName}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Count
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Share
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {countResult.items.map((item) => (
                  <tr key={item.value}>
                    <td className="max-w-[420px] px-4 py-3 text-slate-700">
                      <span className="block truncate" title={item.value}>
                        {item.value}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">
                      {item.count}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {formatPercentage(item.percentage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

CountAnalysis.propTypes = {
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
