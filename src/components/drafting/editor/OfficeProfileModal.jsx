import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { createOfficeProfileModel } from "../features/models/officeProfileModel";

OfficeProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  officeProfile: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

const officeFields = [
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

  const selectedProfile =
    form.signatoryProfiles?.find(
      (item) => item.id === form.selectedSignatoryProfileId,
    ) || form.signatoryProfiles?.[0];

  const updateSelectedProfile = (key, value) => {
    setForm((prev) => ({
      ...prev,
      signatoryProfiles: (prev.signatoryProfiles || []).map((item) =>
        item.id === prev.selectedSignatoryProfileId
          ? { ...item, [key]: value }
          : item,
      ),
    }));
  };

  const handleAddSignatory = () => {
    setForm((prev) => {
      const currentProfiles = Array.isArray(prev.signatoryProfiles)
        ? prev.signatoryProfiles
        : [];

      if (currentProfiles.length >= 10) return prev;

      const nextId = `sig_${Date.now()}`;
      const nextProfile = {
        id: nextId,
        label: `Signatory ${currentProfiles.length + 1}`,
        name: "",
        designation: "",
        phone: "",
        email: "",
      };

      return {
        ...prev,
        signatoryProfiles: [...currentProfiles, nextProfile],
        selectedSignatoryProfileId: nextId,
      };
    });
  };

  const handleDeleteSelectedSignatory = () => {
    setForm((prev) => {
      const currentProfiles = Array.isArray(prev.signatoryProfiles)
        ? prev.signatoryProfiles
        : [];

      if (currentProfiles.length <= 1) return prev;

      const filtered = currentProfiles.filter(
        (item) => item.id !== prev.selectedSignatoryProfileId,
      );

      return {
        ...prev,
        signatoryProfiles: filtered,
        selectedSignatoryProfileId: filtered[0]?.id || "",
      };
    });
  };

  const handleReset = () => {
    setForm(createOfficeProfileModel());
  };

  const handleSave = () => {
    onSave(form);
  };

  const signatoryCount = Array.isArray(form.signatoryProfiles)
    ? form.signatoryProfiles.length
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 p-4 sm:items-center max-h-min">
      <div className="w-full max-w-5xl rounded-xl border border-slate-200 bg-white shadow-2xl ">
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

        <div className="max-h-[72vh] overflow-y-auto px-6 py-5 space-y-6">
          <section>
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-slate-900">
                Office details
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                These details remain common across drafts.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {officeFields.map((field) => (
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
          </section>

          <section>
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Signatory profiles
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Save up to 10 signatories and choose the active one.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {signatoryCount}/10 saved
                </div>

                <button
                  type="button"
                  onClick={handleAddSignatory}
                  disabled={signatoryCount >= 10}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add signatory
                </button>

                <button
                  type="button"
                  onClick={handleDeleteSelectedSignatory}
                  disabled={signatoryCount <= 1}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Delete selected
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="w-full md:max-w-sm">
                    <label className="mb-2 block text-sm font-medium text-slate-800">
                      Active signatory
                    </label>

                    <select
                      value={form.selectedSignatoryProfileId || ""}
                      onChange={(e) =>
                        updateField(
                          "selectedSignatoryProfileId",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    >
                      {(form.signatoryProfiles || []).map((profile, index) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.label || `Signatory ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-slate-500 md:text-right">
                    The selected signatory will be used in signature and contact
                    blocks.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <label className="mb-2 block text-sm font-medium text-slate-800">
                    Profile label
                  </label>
                  <input
                    type="text"
                    value={selectedProfile?.label || ""}
                    onChange={(e) =>
                      updateSelectedProfile("label", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="For example: JS Auto"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-800">
                      Signatory name
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={Boolean(form.includeSignatoryName)}
                        onChange={(e) =>
                          updateField("includeSignatoryName", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                      />
                      Include in draft
                    </label>
                  </div>

                  <input
                    type="text"
                    value={selectedProfile?.name || ""}
                    onChange={(e) =>
                      updateSelectedProfile("name", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Enter signatory name..."
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-800">
                      Signatory designation
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={Boolean(form.includeSignatoryDesignation)}
                        onChange={(e) =>
                          updateField(
                            "includeSignatoryDesignation",
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                      />
                      Include in draft
                    </label>
                  </div>

                  <textarea
                    rows={2}
                    value={selectedProfile?.designation || ""}
                    onChange={(e) =>
                      updateSelectedProfile("designation", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Enter designation..."
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-800">
                      Phone / contact line
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={Boolean(form.includePhone)}
                        onChange={(e) =>
                          updateField("includePhone", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                      />
                      Include in draft
                    </label>
                  </div>

                  <input
                    type="text"
                    value={selectedProfile?.phone || ""}
                    onChange={(e) =>
                      updateSelectedProfile("phone", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Enter phone / contact line..."
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-slate-800">
                      Email
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={Boolean(form.includeEmail)}
                        onChange={(e) =>
                          updateField("includeEmail", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                      />
                      Include in draft
                    </label>
                  </div>

                  <input
                    type="text"
                    value={selectedProfile?.email || ""}
                    onChange={(e) =>
                      updateSelectedProfile("email", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    placeholder="Enter email..."
                  />
                </div>
              </div>
            </div>
          </section>
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
              onClick={handleSave}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Save profile
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel ❌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
