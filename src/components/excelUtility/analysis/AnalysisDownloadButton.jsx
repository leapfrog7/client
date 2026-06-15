import { useState } from "react";
import PropTypes from "prop-types";
import { downloadAnalysisWorkbook } from "../engine/analysisExportEngine";

export default function AnalysisDownloadButton({
  result,
  analysisType,
  originalFileName = "analysis-output.xlsx",
  label = "Download analysis",
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const canDownload = Boolean(result);

  const handleDownload = async () => {
    if (!canDownload) return;

    setIsDownloading(true);
    setError("");

    try {
      await downloadAnalysisWorkbook({
        result,
        analysisType,
        originalFileName,
      });
    } catch (downloadError) {
      setError(
        downloadError?.message ||
          "Could not download analysis. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        onClick={handleDownload}
        disabled={!canDownload || isDownloading}
        className="w-full whitespace-nowrap rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isDownloading ? "Preparing..." : label}
      </button>

      {error ? (
        <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}

AnalysisDownloadButton.propTypes = {
  result: PropTypes.object,
  analysisType: PropTypes.oneOf([
    "count",
    "missing",
    "duplicates",
    "totals",
    "dates",
    "time",
  ]).isRequired,
  originalFileName: PropTypes.string,
  label: PropTypes.string,
};
