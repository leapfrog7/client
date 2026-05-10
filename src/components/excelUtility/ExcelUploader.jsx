import PropTypes from "prop-types";

export default function ExcelUploader({
  isLoading = false,
  hasWorkbook = false,
  onFileSelect,
  onReset,
}) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file && onFileSelect) {
      onFileSelect(file);
    }

    event.target.value = "";
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900">Upload Excel file</h2>
      <p className="mt-1 text-xs text-slate-500">Supported format: .xlsx</p>

      <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:bg-slate-100">
        <span className="text-sm font-semibold text-slate-700">
          {isLoading ? "Reading file..." : "Click to browse"}
        </span>
        <span className="mt-1 text-xs text-slate-500">
          Your file will be read inside the browser
        </span>
        <input
          type="file"
          className="hidden"
          accept=".xlsx"
          disabled={isLoading}
          onChange={handleFileChange}
        />
      </label>

      {hasWorkbook ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Clear file
        </button>
      ) : null}
    </div>
  );
}

ExcelUploader.propTypes = {
  isLoading: PropTypes.bool,
  hasWorkbook: PropTypes.bool,
  onFileSelect: PropTypes.func,
  onReset: PropTypes.func,
};
