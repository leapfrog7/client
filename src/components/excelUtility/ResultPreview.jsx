import PropTypes from "prop-types";

const SUMMARY_LABELS = {
  rowsBefore: "Rows before",
  rowsAfter: "Rows after",
  blankRowsRemoved: "Blank rows removed",
  columnsBefore: "Columns before",
  columnsAfter: "Columns after",
  blankColumnsRemoved: "Blank columns removed",
  cellsCleaned: "Cells cleaned",

  sheetsFound: "Sheets found",
  sheetsMerged: "Sheets merged",
  sheetsSkipped: "Sheets skipped",
  rowsMerged: "Rows merged",
  columnsCreated: "Columns created",
  commonHeaders: "Common headers",
  differentHeaders: "Different headers",
  possibleSimilarHeaders: "Similar headers",
};

const formatCellValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  if (value instanceof Date) {
    return value.toLocaleDateString("en-IN");
  }

  return String(value);
};

export default function ResultPreview({
  result,
  hasResult,
  onClearResult,
  rowLimit = 25,
}) {
  if (!hasResult) return null;

  const headers = result?.headers || [];
  const allRows = result?.rows || result?.previewRows || [];
  const rows = allRows.slice(0, Number(rowLimit));
  const summary = result?.summary || {};
  const compatibility = result?.compatibility;

  return (
    <div className="rounded-3xl border border-blue-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Result preview
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-900">
            {result.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{result.description}</p>
        </div>

        <button
          type="button"
          onClick={onClearResult}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Clear result
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="rounded-2xl bg-blue-50 p-4">
            <div className="text-xs font-medium text-blue-700">
              {SUMMARY_LABELS[key] || key}
            </div>
            <div className="mt-1 text-xl font-bold text-blue-950">{value}</div>
          </div>
        ))}
      </div>

      {compatibility ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Merge compatibility
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                {compatibility.safetyMessage}
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-amber-800">
              {compatibility.safetyLevel}
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <HeaderList
              title="Common headers"
              items={compatibility.commonHeaders}
            />
            <HeaderList
              title="Different headers"
              items={compatibility.differentHeaders}
            />
            <SimilarHeaderList groups={compatibility.possibleSimilarHeaders} />
          </div>
        </div>
      ) : null}

      <div className="max-h-[560px] mt-5 overflow-auto rounded-2xl border border-slate-200">
        <p className="mt-4 text-xs text-slate-500">
          Showing {rows.length} of {allRows.length} result rows.
        </p>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
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
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length || 1}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No rows available in result.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
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

      <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Preview only. Your original Excel file is unchanged.
      </div>
    </div>
  );
}

ResultPreview.propTypes = {
  hasResult: PropTypes.bool,
  rowLimit: PropTypes.number,
  result: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    headers: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.array),
    previewRows: PropTypes.arrayOf(PropTypes.array),
    summary: PropTypes.object,
    compatibility: PropTypes.shape({
      safetyLevel: PropTypes.string,
      safetyMessage: PropTypes.string,
      commonHeaders: PropTypes.arrayOf(PropTypes.string),
      differentHeaders: PropTypes.arrayOf(PropTypes.string),
      possibleSimilarHeaders: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.string),
      ),
      sheetHeaderGroups: PropTypes.arrayOf(
        PropTypes.shape({
          sheetName: PropTypes.string,
          headers: PropTypes.arrayOf(PropTypes.string),
          headerKeys: PropTypes.arrayOf(PropTypes.string),
        }),
      ),
      sheetsFound: PropTypes.number,
      usableSheets: PropTypes.number,
      skippedSheets: PropTypes.number,
    }),
  }),
  onClearResult: PropTypes.func,
};

function HeaderList({ title, items = [] }) {
  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </div>

      {items.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.slice(0, 12).map((item) => (
            <span
              key={item}
              className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700"
            >
              {item}
            </span>
          ))}
          {items.length > 12 ? (
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
              +{items.length - 12} more
            </span>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-500">None found</p>
      )}
    </div>
  );
}

HeaderList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string),
};

function SimilarHeaderList({ groups = [] }) {
  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
        Similar-looking headers
      </div>

      {groups.length ? (
        <div className="mt-2 space-y-2">
          {groups.slice(0, 5).map((group) => (
            <div
              key={group.join("-")}
              className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700"
            >
              {group.join(" / ")}
            </div>
          ))}
          {groups.length > 5 ? (
            <p className="text-xs text-slate-500">
              +{groups.length - 5} more groups
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-500">None found</p>
      )}
    </div>
  );
}

SimilarHeaderList.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
