import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { createOfficeProfileModel } from "../features/models/officeProfileModel";

OfficeProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  officeProfile: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

const fields = [
  {
    key: "govtLineEn",
    includeKey: "includeGovtLineEn",
    label: "Government line (English)",
    rows: 1,
  },
  {
    key: "govtLineHi",
    includeKey: "includeGovtLineHi",
    label: "Government line (Hindi)",
    rows: 1,
  },
  {
    key: "departmentEn",
    includeKey: "includeDepartmentEn",
    label: "Department line (English)",
    rows: 2,
  },
  {
    key: "departmentHi",
    includeKey: "includeDepartmentHi",
    label: "Department line (Hindi)",
    rows: 2,
  },
  {
    key: "city",
    includeKey: "includeCity",
    label: "City",
    rows: 1,
  },
  {
    key: "defaultSignatoryName",
    includeKey: "includeSignatoryName",
    label: "Signatory name",
    rows: 1,
  },
  {
    key: "defaultSignatoryDesignation",
    includeKey: "includeSignatoryDesignation",
    label: "Signatory designation",
    rows: 2,
  },
  {
    key: "defaultPhone",
    includeKey: "includePhone",
    label: "Phone / contact line",
    rows: 1,
  },
  {
    key: "defaultEmail",
    includeKey: "includeEmail",
    label: "Email",
    rows: 1,
  },
];

export default function OfficeProfileModal({
  open,
  onClose,
  officeProfile,
  onSave,
}) {
  const [form, setForm] = useState(() =>
    createOfficeProfileModel(officeProfile),
  );

  // Important: only initialize when modal is opened
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setForm(createOfficeProfileModel(officeProfile));
    }

    wasOpenRef.current = open;
  }, [open, officeProfile]);

  if (!open) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setForm(createOfficeProfileModel());
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Office profile
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                These defaults help generate quick drafts. They are stored
                locally for now.
              </p>
            </div>

            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Local storage
            </div>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.key}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium text-slate-800">
                    {field.label}
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={Boolean(form[field.includeKey])}
                      onChange={(e) =>
                        updateField(field.includeKey, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                    />
                    Include in draft
                  </label>
                </div>

                <textarea
                  rows={field.rows}
                  value={form[field.key] || ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                />
              </div>
            ))}
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
              Save profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
