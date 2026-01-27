import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { safeTrim } from "./utils";

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

    if (initialValues?.dueAt) {
      const d = new Date(initialValues.dueAt);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setDueDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setDueDate("");
    }
  }, [open, initialValues]);

  const canSubmit = useMemo(() => safeTrim(title).length > 0, [title]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const dueAt = dueDate
      ? new Date(`${dueDate}T23:59:59`).toISOString()
      : null;

    onSubmit({
      title: safeTrim(title),
      identifiers: {
        section: safeTrim(section),
        fileNo: safeTrim(fileNo),
        receiptNo: safeTrim(receiptNo),
      },
      dueAt,
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">
              {mode === "edit" ? "Edit Task Details" : "Create New Task"}
            </div>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm hover:border-slate-300"
              type="button"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Title <span className="text-rose-600">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Subject / case title"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                autoFocus
              />
            </div>

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
                <label className="block text-xs font-medium text-slate-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                />
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
                className={`px-4 py-2 rounded-lg text-sm ${
                  canSubmit
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {mode === "edit" ? "Save Changes" : "Create Task"}
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Only <b>Title</b> is mandatory. Everything else is optional.
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
