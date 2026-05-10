import PropTypes from "prop-types";

const roleBadgeClass = (role = "") => {
  switch (role) {
    case "Identifier":
      return "bg-purple-50 text-purple-700 border-purple-100";
    case "Measure":
    case "Number":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "Date field":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Category":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Status / Flag":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "Description":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
};

export default function ColumnRolePanel({ columns = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Detected columns
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Detection is based on column behaviour, not fixed ministry formats.
          </p>
        </div>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          {columns.length} columns
        </span>
      </div>

      <div className="mt-4 max-h-[420px] space-y-2 overflow-auto pr-1">
        {!columns.length ? (
          <div className="rounded-xl bg-white px-3 py-4 text-sm text-slate-500">
            No columns detected yet.
          </div>
        ) : (
          columns.map((column) => (
            <div
              key={`${column.header}-${column.columnIndex}`}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">
                    {column.header}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {column.rawType} · {column.uniqueCount} unique ·{" "}
                    {column.missingCount} missing
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 py-1 text-xs font-semibold ${roleBadgeClass(
                    column.role,
                  )}`}
                >
                  {column.role}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600">
                {column.suggestedUse}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

ColumnRolePanel.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      columnIndex: PropTypes.number,
      header: PropTypes.string,
      rawType: PropTypes.string,
      role: PropTypes.string,
      suggestedUse: PropTypes.string,
      missingCount: PropTypes.number,
      uniqueCount: PropTypes.number,
    }),
  ),
};
