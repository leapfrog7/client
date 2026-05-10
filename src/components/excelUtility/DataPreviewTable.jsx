import PropTypes from "prop-types";

const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  if (value instanceof Date) {
    return value.toLocaleDateString("en-IN");
  }

  return String(value);
};

export default function DataPreviewTable({
  headers = [],
  rows = [],
  hasWorkbook = false,
  sheetName = "",
  rowLimit = 25,
}) {
  const hasPreview = hasWorkbook && headers.length > 0;
  const visibleRows = rows.slice(0, Number(rowLimit));

  if (!hasPreview) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="text-sm font-semibold text-slate-700">
          Upload an Excel file to see preview
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Your original file will remain unchanged.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Uploaded data</h3>
          <p className="mt-1 text-xs text-slate-500">
            Showing {visibleRows.length} of {rows.length} rows from {sheetName}.
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Preview only
        </span>
      </div>

      <div className="max-h-[560px] overflow-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={`${header}-${index}`}
                  className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length || 1}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No data rows found in this sheet.
                </td>
              </tr>
            ) : (
              visibleRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, cellIndex) => (
                    <td
                      key={`${header}-${rowIndex}-${cellIndex}`}
                      className="max-w-[240px] whitespace-nowrap px-4 py-3 text-slate-700"
                      title={formatCellValue(row[cellIndex])}
                    >
                      <span className="block truncate">
                        {formatCellValue(row[cellIndex])}
                      </span>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataPreviewTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string),
  rows: PropTypes.arrayOf(PropTypes.array),
  hasWorkbook: PropTypes.bool,
  sheetName: PropTypes.string,
  rowLimit: PropTypes.number,
};
