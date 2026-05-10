import PropTypes from "prop-types";

export default function WorkbookSummary({
  fileName = "No file uploaded",
  sheetCount = "—",
  rowCount = "—",
  columnCount = "—",
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900">File summary</h2>

      <div className="mt-4 space-y-3 text-sm">
        <SummaryRow label="File" value={fileName} />
        <SummaryRow label="Sheets" value={sheetCount} />
        <SummaryRow label="Rows" value={rowCount} />
        <SummaryRow label="Columns" value={columnCount} />
      </div>
    </div>
  );
}

WorkbookSummary.propTypes = {
  fileName: PropTypes.string,
  sheetCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  columnCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span
        className="max-w-[180px] truncate text-right font-medium text-slate-800"
        title={String(value)}
      >
        {value}
      </span>
    </div>
  );
}

SummaryRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
