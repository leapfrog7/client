import { useState } from "react";
import PropTypes from "prop-types";

const copyToClipboard = async (text) => {
  if (!text) return;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

export default function AnalysisCopyActions({
  summaryText = "",
  tableRows = [],
  tableHeaders = [],
}) {
  const [copiedType, setCopiedType] = useState("");

  const buildTableText = () => {
    if (!tableRows.length) return "";

    const headers =
      tableHeaders.length > 0 ? tableHeaders : Object.keys(tableRows[0] || {});

    const bodyRows = tableRows.map((row) =>
      headers.map((header) => row?.[header] ?? "").join("\t"),
    );

    return [headers.join("\t"), ...bodyRows].join("\n");
  };

  const handleCopySummary = async () => {
    await copyToClipboard(summaryText);
    setCopiedType("summary");
    window.setTimeout(() => setCopiedType(""), 1600);
  };

  const handleCopyTable = async () => {
    await copyToClipboard(buildTableText());
    setCopiedType("table");
    window.setTimeout(() => setCopiedType(""), 1600);
  };

  const hasSummary = Boolean(summaryText);
  const hasTable = tableRows.length > 0;

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
      <button
        type="button"
        disabled={!hasSummary}
        onClick={handleCopySummary}
        className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {copiedType === "summary" ? "Summary copied" : "Copy summary"}
      </button>

      <button
        type="button"
        disabled={!hasTable}
        onClick={handleCopyTable}
        className="w-full whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {copiedType === "table" ? "Table copied" : "Copy table"}
      </button>
    </div>
  );
}

AnalysisCopyActions.propTypes = {
  summaryText: PropTypes.string,
  tableRows: PropTypes.arrayOf(PropTypes.object),
  tableHeaders: PropTypes.arrayOf(PropTypes.string),
};
