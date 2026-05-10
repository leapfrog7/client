import PropTypes from "prop-types";

export default function CleanDataTool({ disabled = false, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-left transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-blue-50"
    >
      <div className="text-sm font-semibold text-blue-950">Clean data</div>
      <p className="mt-1 text-xs text-blue-800">
        Remove extra spaces, invisible characters, and fully blank rows or
        columns.
      </p>
      <div className="mt-4 text-xs font-semibold text-blue-700">
        Safe cleaning
      </div>
    </button>
  );
}

CleanDataTool.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
