import PropTypes from "prop-types";
import { useState } from "react";
import { downloadResultWorkbook } from "./engine/workbookWriter";

export default function DownloadPanel({
  hasResult = false,
  result,
  originalFileName = "excel-output.xlsx",
  activeSheetName = "Processed Sheet",
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const rowCount = result?.rows?.length || 0;
  const columnCount = result?.headers?.length || 0;
  const canDownload = hasResult && columnCount > 0;

  const handleDownload = async () => {
    if (!canDownload) return;

    setIsDownloading(true);
    setDownloadError("");

    try {
      await downloadResultWorkbook({
        result,
        originalFileName,
        sheetName: activeSheetName || "Processed Sheet",
      });
    } catch (error) {
      setDownloadError(
        error?.message ||
          "Could not download the Excel file. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!hasResult) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">Download output</h2>
        <p className="mt-1 text-sm text-slate-500">
          Run a utility action first. The download button will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-emerald-950">
            Download output
          </h2>
          <p className="mt-1 text-sm text-emerald-800">
            Download a new Excel file. Your original file remains unchanged.
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-emerald-900">
            <span className="rounded-full bg-white/80 px-3 py-1">
              {rowCount} rows
            </span>
            <span className="rounded-full bg-white/80 px-3 py-1">
              {columnCount} columns
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={!canDownload || isDownloading}
          className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDownloading ? "Preparing..." : "Download Excel"}
        </button>
      </div>

      {downloadError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-rose-700">
          {downloadError}
        </div>
      ) : null}
    </div>
  );
}

DownloadPanel.propTypes = {
  hasResult: PropTypes.bool,
  result: PropTypes.shape({
    type: PropTypes.string,
    headers: PropTypes.arrayOf(PropTypes.string),
    rows: PropTypes.arrayOf(PropTypes.array),
  }),
  originalFileName: PropTypes.string,
  activeSheetName: PropTypes.string,
};
