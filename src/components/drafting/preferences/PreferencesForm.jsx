import PropTypes from "prop-types";

PreferencesForm.propTypes = {
  preferences: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

const FONT_OPTIONS = [
  "Arial",
  "Calibri",
  "Times New Roman",
  "Georgia",
  "Verdana",
];

export default function PreferencesForm({ preferences, onChange, onReset }) {
  const handleFieldChange = (field, value) => {
    onChange({
      [field]:
        field === "fontSize" ||
        field === "paragraphSpacing" ||
        field === "lineSpacing"
          ? Number(value)
          : value,
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Document preferences
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Set the default look and spacing for your drafts.
          </p>
        </div>

        <div className="hidden sm:inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Personal defaults
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <label className="group block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500/80" />
            Font family
          </span>

          <div className="relative">
            <select
              value={preferences.fontFamily}
              onChange={(e) => handleFieldChange("fontFamily", e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 group-focus-within:text-slate-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </label>

        <label className="group block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-500/80" />
            Font size
          </span>

          <div className="relative">
            <input
              type="number"
              min="10"
              max="24"
              value={preferences.fontSize}
              onChange={(e) => handleFieldChange("fontSize", e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-medium text-slate-400">
              pt
            </span>
          </div>
        </label>

        <label className="group block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500/80" />
            Line spacing
          </span>

          <div className="relative">
            <select
              value={preferences.lineSpacing}
              onChange={(e) => handleFieldChange("lineSpacing", e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option value={1.15}>1.15</option>
              <option value={1.3}>1.3</option>
              <option value={1.5}>1.5</option>
              <option value={1.75}>1.75</option>
              <option value={2}>2.0</option>
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 group-focus-within:text-slate-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </label>

        <label className="group block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500/80" />
            Paragraph spacing
          </span>

          <div className="relative">
            <input
              type="number"
              min="0"
              max="40"
              value={preferences.paragraphSpacing}
              onChange={(e) =>
                handleFieldChange("paragraphSpacing", e.target.value)
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-300 focus:bg-white focus:ring-4 focus:ring-amber-100"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-medium text-slate-400">
              px
            </span>
          </div>
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          These preferences are used as your starting defaults for new drafts.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99]"
        >
          Reset defaults
        </button>
      </div>
    </div>
  );
}
