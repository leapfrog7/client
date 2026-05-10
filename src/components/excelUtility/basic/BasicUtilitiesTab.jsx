import PropTypes from "prop-types";
import CleanDataTool from "./CleanDataTool";

export default function BasicUtilitiesTab({
  hasWorkbook = false,
  onCleanData,
  onMergeSheets,
  onPreparePrint,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Basic Utilities</h2>
        <p className="mt-1 text-sm text-slate-500">
          Clean, prepare, print, and export office Excel files.
        </p>
      </div>

      {!hasWorkbook ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
          Upload an Excel file to enable these tools.
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <CleanDataTool disabled={!hasWorkbook} onClick={onCleanData} />

        <UtilityTool
          title="Merge sheets"
          description="Combine all sheets in this workbook into one master sheet."
          badge="Header-based merge"
          disabled={!hasWorkbook}
          onClick={onMergeSheets}
        />

        <UtilityTool
          title="Print-ready output"
          description="Prepare the sheet for clean PDF or print output."
          badge="Coming later"
          disabled={!hasWorkbook}
          onClick={onPreparePrint}
        />
      </div>
    </div>
  );
}

BasicUtilitiesTab.propTypes = {
  hasWorkbook: PropTypes.bool,
  onCleanData: PropTypes.func,
  onMergeSheets: PropTypes.func,
  onPreparePrint: PropTypes.func,
};

function UtilityTool({ title, description, badge, disabled = false, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:bg-slate-50"
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
      <div className="mt-4 text-xs font-semibold text-blue-700">{badge}</div>
    </button>
  );
}

UtilityTool.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  badge: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
