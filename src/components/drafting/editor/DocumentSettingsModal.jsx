import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { createPreferencesModel } from "../features/models/preferencesModel";

DocumentSettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  styling: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

const FONT_OPTIONS = [
  "Arial",
  "Calibri",
  "Times New Roman",
  "Georgia",
  "Verdana",
];

export default function DocumentSettingsModal({
  open,
  onClose,
  styling,
  onSave,
}) {
  const [form, setForm] = useState(() => createPreferencesModel(styling));
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setForm(createPreferencesModel(styling));
    }

    wasOpenRef.current = open;
  }, [open, styling]);

  if (!open) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setForm(createPreferencesModel());
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/25 p-4 sm:items-center">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Document settings
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                These settings control the drafting canvas and are saved
                locally.
              </p>
            </div>

            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Local storage
            </div>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  Font family
                </span>
                <select
                  value={form.fontFamily}
                  onChange={(e) => updateField("fontFamily", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  Font size
                </span>
                <input
                  type="number"
                  min="10"
                  max="24"
                  value={form.fontSize}
                  onChange={(e) =>
                    updateField("fontSize", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  General line spacing
                </span>
                <select
                  value={form.lineSpacing}
                  onChange={(e) =>
                    updateField("lineSpacing", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option value={1}>1.0</option>
                  <option value={1.05}>1.05</option>
                  <option value={1.1}>1.1</option>
                </select>
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  General block spacing
                </span>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={form.paragraphSpacing}
                  onChange={(e) =>
                    updateField("paragraphSpacing", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  Body line spacing
                </span>
                <select
                  value={form.bodyLineSpacing}
                  onChange={(e) =>
                    updateField("bodyLineSpacing", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                >
                  <option value={1.0}>1.0</option>
                  <option value={1.15}>1.15</option>
                  <option value={1.3}>1.3</option>
                  <option value={1.5}>1.5</option>
                </select>
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  Body paragraph spacing
                </span>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={form.bodyParagraphSpacing}
                  onChange={(e) =>
                    updateField("bodyParagraphSpacing", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  Body first-line indent (inches)
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={form.bodyFirstLineIndent}
                  onChange={(e) =>
                    updateField("bodyFirstLineIndent", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  Signature gap
                </span>
                <input
                  type="number"
                  min="0"
                  max="80"
                  value={form.signatureGap}
                  onChange={(e) =>
                    updateField("signatureGap", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-slate-700">
                  Page margin (inches)
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="2"
                  value={form.pageMargin}
                  onChange={(e) =>
                    updateField("pageMargin", Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 md:col-span-2">
              <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(form.underlineCommunicationLabel)}
                  onChange={(e) =>
                    updateField("underlineCommunicationLabel", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                />
                Underline form of communication
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset defaults
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Save settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
