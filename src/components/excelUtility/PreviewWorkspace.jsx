import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import DataPreviewTable from "./DataPreviewTable";
import ResultPreview from "./ResultPreview";

const ROW_LIMIT_OPTIONS = [25, 50, 100, 200];

export default function PreviewWorkspace({
  activeSheet,
  hasWorkbook = false,
  result,
  hasResult = false,
  onClearResult,
}) {
  const [activePreviewTab, setActivePreviewTab] = useState("data");
  const [rowLimit, setRowLimit] = useState(25);

  useEffect(() => {
    if (hasResult) {
      setActivePreviewTab("result");
    }
  }, [hasResult]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Preview workspace
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Switch between uploaded data and processed result.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            Rows to show
            <select
              value={rowLimit}
              onChange={(event) => setRowLimit(Number(event.target.value))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-300"
            >
              {ROW_LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setActivePreviewTab("data")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activePreviewTab === "data"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Uploaded Data
        </button>

        <button
          type="button"
          disabled={!hasResult}
          onClick={() => setActivePreviewTab("result")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            activePreviewTab === "result"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Result Preview
        </button>
      </div>

      <div className="mt-5">
        {activePreviewTab === "data" ? (
          <DataPreviewTable
            headers={activeSheet?.headers || []}
            rows={activeSheet?.rows || []}
            hasWorkbook={hasWorkbook}
            sheetName={activeSheet?.name || ""}
            rowLimit={rowLimit}
          />
        ) : (
          <ResultPreview
            result={result}
            hasResult={hasResult}
            rowLimit={rowLimit}
            onClearResult={onClearResult}
          />
        )}
      </div>
    </div>
  );
}

PreviewWorkspace.propTypes = {
  activeSheet: PropTypes.shape({
    name: PropTypes.string,
    headers: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.array),
  }),
  hasWorkbook: PropTypes.bool,
  result: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    headers: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.array),
    summary: PropTypes.object,
  }),
  hasResult: PropTypes.bool,
  onClearResult: PropTypes.func,
};
