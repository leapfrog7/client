import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { safeTrim } from "./utils";

const STAGE_SUGGESTIONS = [
  "Pending",
  "Under submission",
  "Sent to IFD",
  "Comments awaited",
  "Approved",
  "Completed",
  "To be discussed",
  "Draft Issued",
  "In Abeyance",
  "No Action needed",
];

const CATEGORY_OPTIONS = [
  "General",
  "RTI",
  "Public Grievance",
  "Court Case",
  "Parliament Question",
  "Audit Matter",
  "Cabinet Note",
  "Bills",
  "Procurement",
  "CPSE Matter",
  "Recruitment related",
  "Personnel Matter",
  "Policy or Scheme",
  "Miscellaneous",
];

export default function TaskFormModal({
  open,
  mode, // "create" | "edit"
  initialValues,
  onClose,
  onSubmit,
  responsibleSuggestions = [],
}) {
  // --- animation states ---
  const [render, setRender] = useState(open);
  const [active, setActive] = useState(false);

  // --- form states ---
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [fileNo, setFileNo] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [dueDate, setDueDate] = useState(""); // YYYY-MM-DD
  const [stage, setStage] = useState("Pending");
  const [category, setCategory] = useState("General");
  const [assignedTo, setAssignedTo] = useState("");

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [stageOpen, setStageOpen] = useState(false);
  const [stageSearch, setStageSearch] = useState("");

  // Animate in/out based on `open`
  useEffect(() => {
    if (open) {
      setRender(true);
      // allow mount before animating
      requestAnimationFrame(() => setActive(true));
      return;
    }

    // animate out
    setActive(false);
    const t = window.setTimeout(() => setRender(false), 180);
    return () => window.clearTimeout(t);
  }, [open]);

  // Populate fields when opened
  useEffect(() => {
    if (!open) return;

    setTitle(initialValues?.title || "");
    setSection(initialValues?.identifiers?.section || "");
    setFileNo(initialValues?.identifiers?.fileNo || "");
    setReceiptNo(initialValues?.identifiers?.receiptNo || "");
    setCategory(initialValues?.category || "General");
    setAssignedTo(initialValues?.assignedTo || "");

    // Stage: only meaningful for create (edit stage should happen via milestone update)
    if (mode === "create") {
      setStage(initialValues?.currentStage || "Pending");
    } else {
      setStage(initialValues?.currentStage || "Pending");
    }

    if (initialValues?.dueAt) {
      const d = new Date(initialValues.dueAt);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setDueDate(`${yyyy}-${mm}-${dd}`);
    } else {
      setDueDate("");
    }
  }, [open, initialValues, mode]);

  const canSubmit = useMemo(() => safeTrim(title).length > 0, [title]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const dueAt = dueDate
      ? new Date(`${dueDate}T23:59:59`).toISOString()
      : null;

    const payload = {
      title: safeTrim(title),
      identifiers: {
        section: safeTrim(section),
        fileNo: safeTrim(fileNo),
        receiptNo: safeTrim(receiptNo),
      },
      category: safeTrim(category) || "General",
      assignedTo: safeTrim(assignedTo),
      dueAt,
    };

    // ✅ Only set stage at creation time
    if (mode === "create") {
      const cleanStage = safeTrim(stage) || "Pending";
      payload.currentStage = cleanStage;
    }

    onSubmit(payload);
  }

  if (!render) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop: Darkened slightly and increased blur for better depth */}
      <div
        className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ease-out
      ${active ? "opacity-100" : "opacity-0"}
    `}
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-12">
        <div
          className={`w-full max-w-5xl min-h-[60dvh] max-h-[100dvh] flex flex-col rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5 overflow-hidden
        transition-all duration-300 ease-out origin-center
        ${active ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.97]"}
        motion-reduce:transition-none motion-reduce:transform-none
      `}
          role="dialog"
          aria-modal="true"
        >
          {/* Header: Elevated typography and replaced emoji with a clean SVG */}
          <div className="shrink-0 px-6 py-4  flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight">
              {mode === "edit" ? "✏️Edit Task Details" : "🍃Create New Task "}
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              type="button"
              title="Close dialog"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            {/* Form Body: Increased padding and refined input styling */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Title - Made it span 2 columns on large screens as titles are usually long */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Subject / case title"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400"
                    autoFocus
                  />
                </div>
                <div className="relative">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryOpen((v) => !v);
                      setCategorySearch("");
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-3.5 py-2.5 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <span
                      className={
                        category
                          ? "text-slate-900 font-medium"
                          : "text-slate-400"
                      }
                    >
                      {category || "Select category"}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {categoryOpen && (
                    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="border-b border-slate-100 p-2">
                        <input
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          placeholder="Search category..."
                          className="w-full rounded-lg bg-slate-50 border-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-auto p-1.5">
                        {CATEGORY_OPTIONS.filter((cat) =>
                          cat
                            .toLowerCase()
                            .includes(categorySearch.toLowerCase()),
                        ).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setCategory(cat);
                              setCategoryOpen(false);
                              setCategorySearch("");
                            }}
                            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                              category === cat
                                ? "bg-slate-900 text-white font-medium"
                                : "text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                        {/* ... (Keep your empty state logic here) ... */}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Section / Division
                  </label>
                  <input
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400"
                    placeholder="Section name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    list="responsible-options"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="Subordinate name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400"
                  />
                  <datalist id="responsible-options">
                    {responsibleSuggestions.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
                {mode === "create" && (
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Stage
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setStageOpen((v) => !v);
                        setStageSearch("");
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 px-3.5 py-2.5 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <span className="text-slate-900 font-medium">
                        {stage || "Pending"}
                      </span>
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {stageOpen && (
                      <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="border-b border-slate-100 p-2">
                          <input
                            value={stageSearch}
                            onChange={(e) => setStageSearch(e.target.value)}
                            placeholder="Search stage..."
                            className="w-full rounded-lg bg-slate-50 border-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                            autoFocus
                          />
                        </div>

                        <div className="max-h-48 overflow-auto p-1.5">
                          {STAGE_SUGGESTIONS.filter((s) =>
                            s.toLowerCase().includes(stageSearch.toLowerCase()),
                          ).map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setStage(s);
                                setStageOpen(false);
                                setStageSearch("");
                              }}
                              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                stage === s
                                  ? "bg-slate-900 text-white font-medium"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {s}
                            </button>
                          ))}

                          {STAGE_SUGGESTIONS.filter((s) =>
                            s.toLowerCase().includes(stageSearch.toLowerCase()),
                          ).length === 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                const custom = stageSearch.trim();
                                if (!custom) return;
                                setStage(custom);
                                setStageOpen(false);
                                setStageSearch("");
                              }}
                              className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              Use custom stage:{" "}
                              <span className="font-semibold text-slate-900">
                                {stageSearch.trim()}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    e-File No{" "}
                    <span className="text-slate-400 font-normal normal-case tracking-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    value={fileNo}
                    onChange={(e) => setFileNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400"
                    placeholder="eOffice File No."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    e-Receipt No{" "}
                    <span className="text-slate-400 font-normal normal-case tracking-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    value={receiptNo}
                    onChange={(e) => setReceiptNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder:text-slate-400"
                    placeholder="Diary number"
                  />
                </div>
              </div>
            </div>

            {/* Footer: Rebalanced layout so help text isn't stacked under buttons */}
            <div className="sticky bottom-0  bg-white/80 px-6 py-4 backdrop-blur-md flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 w-full sm:w-auto text-center sm:text-left">
                <span className="text-rose-500 font-medium">*</span> Required
                fields
              </div>

              <div className="flex w-full sm:w-auto items-center justify-end gap-3 lg:mb-4 2xl:mt-12 2xl:mb-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Cancel ❌️
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                    canSubmit
                      ? "bg-black text-white shadow-md hover:bg-neutral-800 hover:shadow-lg"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {mode === "edit" ? "Save Changes ⎙" : "Create Task +"}
                </button>
              </div>
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
    currentStage: PropTypes.string,
    category: PropTypes.string,
    assignedTo: PropTypes.string,
    identifiers: PropTypes.shape({
      section: PropTypes.string,
      fileNo: PropTypes.string,
      receiptNo: PropTypes.string,
    }),
    dueAt: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  responsibleSuggestions: PropTypes.arrayOf(PropTypes.string),
};
