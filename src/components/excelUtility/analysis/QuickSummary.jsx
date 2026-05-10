import PropTypes from "prop-types";

const DEFAULT_SUMMARY = {
  totalRows: 0,
  totalColumns: 0,
  blankCells: 0,
  duplicateRows: 0,
  columnsWithMissingValues: 0,
};

export default function QuickSummary({ summary = DEFAULT_SUMMARY }) {
  const safeSummary = {
    ...DEFAULT_SUMMARY,
    ...(summary || {}),
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-900">Quick summary</h3>
      <p className="mt-1 text-xs text-slate-500">
        Broad quality check of the selected sheet.
      </p>

      <div className="mt-4 space-y-3 text-sm">
        <SummaryItem label="Total rows" value={safeSummary.totalRows} />
        <SummaryItem label="Total columns" value={safeSummary.totalColumns} />
        <SummaryItem label="Blank cells" value={safeSummary.blankCells} />
        <SummaryItem label="Duplicate rows" value={safeSummary.duplicateRows} />
        <SummaryItem
          label="Columns with missing values"
          value={safeSummary.columnsWithMissingValues}
        />
      </div>
    </div>
  );
}

QuickSummary.propTypes = {
  summary: PropTypes.shape({
    totalRows: PropTypes.number,
    totalColumns: PropTypes.number,
    blankCells: PropTypes.number,
    duplicateRows: PropTypes.number,
    columnsWithMissingValues: PropTypes.number,
  }),
};

function SummaryItem({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

SummaryItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
