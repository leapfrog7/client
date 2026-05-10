import PropTypes from "prop-types";

export default function SheetSelector({
  sheets = [],
  activeSheetName = "",
  onSelectSheet,
}) {
  const hasSheets = sheets.length > 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900">Sheets</h2>
      <p className="mt-1 text-xs text-slate-500">
        Select the sheet you want to work on.
      </p>

      <div className="mt-4 space-y-2">
        {!hasSheets ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            No sheet available
          </div>
        ) : (
          sheets.map((sheet) => {
            const isActive = sheet.name === activeSheetName;

            return (
              <button
                key={sheet.name}
                type="button"
                onClick={() => onSelectSheet?.(sheet.name)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  isActive
                    ? "border-blue-200 bg-blue-50 text-blue-900"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-semibold">{sheet.name}</span>
                  <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs text-slate-500">
                    {sheet.rowCount} rows
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

SheetSelector.propTypes = {
  sheets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rowCount: PropTypes.number,
    }),
  ),
  activeSheetName: PropTypes.string,
  onSelectSheet: PropTypes.func,
};
