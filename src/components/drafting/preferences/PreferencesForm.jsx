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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Font family
          </span>
          <select
            value={preferences.fontFamily}
            onChange={(e) => handleFieldChange("fontFamily", e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Font size</span>
          <input
            type="number"
            min="10"
            max="24"
            value={preferences.fontSize}
            onChange={(e) => handleFieldChange("fontSize", e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Line spacing
          </span>
          <select
            value={preferences.lineSpacing}
            onChange={(e) => handleFieldChange("lineSpacing", e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          >
            <option value={1.15}>1.15</option>
            <option value={1.3}>1.3</option>
            <option value={1.5}>1.5</option>
            <option value={1.75}>1.75</option>
            <option value={2}>2.0</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Paragraph spacing
          </span>
          <input
            type="number"
            min="0"
            max="40"
            value={preferences.paragraphSpacing}
            onChange={(e) =>
              handleFieldChange("paragraphSpacing", e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset defaults
        </button>
      </div>
    </div>
  );
}
