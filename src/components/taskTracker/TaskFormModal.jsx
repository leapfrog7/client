import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { safeTrim } from "./utils";

const TITLE_MAX = 100;

function isoToDateInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// Convert YYYY-MM-DD to local end-of-day ISO (23:59:59.999 local time)
function dateInputToIsoEndOfDay(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr)
    .split("-")
    .map((x) => Number(x));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;

  const [y, m, d] = parts;
  const dt = new Date(y, m - 1, d, 23, 59, 59, 999); // local time
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toISOString();
}

export default function TaskFormModal({
  open,
  mode, // "create" | "edit"
  initialValues,
  onClose,
  onSubmit,
}) {
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD

  useEffect(() => {
    if (!open) return;

    setTitle(initialValues?.title || "");
    setSection(initialValues?.identifiers?.section || "");
    setFileNo(initialValues?.identifiers?.fileNo || "");
    setReceiptNo(initialValues?.identifiers?.receiptNo || "");
    setDueDate(isoToDateInput(initialValues?.dueAt));
  }, [open, initialValues]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const trimmedTitle = useMemo(() => safeTrim(title), [title]);

  const canSubmit = useMemo(() => {
    return trimmedTitle.length > 0;
  }, [trimmedTitle]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const dueAt = dateInputToIsoEndOfDay(dueDate);

    onSubmit({
      title: trimmedTitle.slice(0, TITLE_MAX),
      identifiers: {
        section: safeTrim(section),
        fileNo: safeTrim(fileNo),
        receiptNo: safeTrim(receiptNo),
      },
      dueAt, // ISO string or null
    });
  }

  if (!open) return null;

  const titleCount = title.length;
  const titleNearLimit = titleCount >= 90;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {mode === "edit" ? "Edit Task Details" : "Create New Task"}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                Only <span className="font-medium">Title</span> is mandatory.
              </div>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 px-3 py-2 rounded-lg border border-slate-200 text-sm hover:border-slate-300"
              type="button"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Title */}
            <div>
              <div className="flex items-end justify-between gap-2">
                <label className="block text-xs font-medium text-slate-700">
                  Title <span className="text-rose-600">*</span>
                </label>
                <div
                  className={`text-[11px] ${
                    titleNearLimit ? "text-amber-700" : "text-slate-400"
                  }`}
                >
                  {titleCount}/{TITLE_MAX}
                </div>
              </div>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
                placeholder="Subject / case title"
                maxLength={TITLE_MAX}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                autoFocus
              />

              {!canSubmit ? (
                <div className="mt-1 text-[11px] text-rose-600">
                  Title cannot be empty.
                </div>
              ) : null}
            </div>

            {/* Optional fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Section / Division
                </label>
                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  placeholder="e.g., CPSE-III"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-700">
                    Due date
                  </label>

                  {dueDate ? (
                    <button
                      type="button"
                      onClick={() => setDueDate("")}
                      className="text-[11px] font-medium text-slate-600 hover:text-slate-900"
                      title="Clear due date"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />

                <div className="mt-1 text-[11px] text-slate-500">
                  Saves as end-of-day (local time).
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  File No (optional)
                </label>
                <input
                  value={fileNo}
                  onChange={(e) => setFileNo(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  placeholder="File number"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">
                  Receipt No (optional)
                </label>
                <input
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                  placeholder="Receipt / diary no"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:border-slate-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  canSubmit
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {mode === "edit" ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

TaskFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    identifiers: PropTypes.shape({
      section: PropTypes.string,
      fileNo: PropTypes.string,
      receiptNo: PropTypes.string,
    }),
    dueAt: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
