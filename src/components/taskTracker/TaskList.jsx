import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { diffDays, safeTrim } from "./utils";
import { getStageStyle, QUICK_STAGES } from "./constants";
import { exportTaskSummaryPdf } from "./exportTaskSummaryPdf";
import { FaRegFilePdf } from "react-icons/fa";

function daysUntil(dueAt) {
  if (!dueAt) return null;
  const now = new Date();
  const due = new Date(dueAt);
  const ms = due.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function withinDays(iso, n) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = now - t;
  return diff >= 0 && diff <= n * 24 * 60 * 60 * 1000;
}

export default function TaskList({
  tasks,
  selectedTaskId,
  onSelect,
  onCreate,
  onDelete,
  onArchive,
  onUnarchive,
  showArchived,
  onToggleArchived,
}) {
  const [q, setQ] = useState("");
  const [compact, setCompact] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Desktop filters (local to TaskList; no parent changes needed)
  const [stageFilter, setStageFilter] = useState("ALL"); // ALL | CORE:<stage> | CUSTOM
  const [dueFilter, setDueFilter] = useState("ANY"); // ANY | HAS | NONE | DUE_SOON | OVERDUE
  const [updatedFilter, setUpdatedFilter] = useState("ANY"); // ANY | 7D | 30D
  const [sortBy, setSortBy] = useState("MANUAL"); // UPDATED_DESC | CREATED_DESC | DUE_ASC | TITLE_ASC

  // Auto compact for smaller laptops
  useEffect(() => {
    function onResize() {
      setCompact(window.innerWidth < 1200);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const coreStageSet = useMemo(() => new Set(QUICK_STAGES), []);

  function metaLine(t) {
    const id = t.identifiers || {};
    const parts = [];
    if (id.section) parts.push(id.section);
    if (id.fileNo) parts.push(`File: ${id.fileNo}`);
    if (id.receiptNo) parts.push(`Rcpt: ${id.receiptNo}`);
    return parts.join(" · ");
  }

  const filtered = useMemo(() => {
    const qq = safeTrim(q).toLowerCase();

    let list = Array.isArray(tasks) ? [...tasks] : [];

    // Search
    if (qq) {
      list = list.filter((t) => {
        const hay = [
          t.title,
          t.identifiers?.receiptNo,
          t.identifiers?.fileNo,
          t.identifiers?.section,
          t.currentStage,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(qq);
      });
    }

    // Stage filter (curated)
    if (stageFilter !== "ALL") {
      if (stageFilter === "CUSTOM") {
        list = list.filter((t) => !coreStageSet.has(t.currentStage || ""));
      } else if (stageFilter.startsWith("CORE:")) {
        const st = stageFilter.replace("CORE:", "");
        list = list.filter((t) => (t.currentStage || "") === st);
      }
    }

    // Due filter
    if (dueFilter !== "ANY") {
      if (dueFilter === "HAS") list = list.filter((t) => !!t.dueAt);
      if (dueFilter === "NONE") list = list.filter((t) => !t.dueAt);
      if (dueFilter === "DUE_SOON") {
        list = list.filter((t) => {
          const d = daysUntil(t.dueAt);
          return d !== null && d >= 0 && d <= 3;
        });
      }
      if (dueFilter === "OVERDUE") {
        list = list.filter((t) => {
          const d = daysUntil(t.dueAt);
          return d !== null && d < 0;
        });
      }
    }

    // Updated filter
    if (updatedFilter === "7D")
      list = list.filter((t) => withinDays(t.updatedAt, 7));
    if (updatedFilter === "30D")
      list = list.filter((t) => withinDays(t.updatedAt, 30));

    // Sort
    // AFTER: only sort when user chooses
    if (sortBy !== "MANUAL") {
      list.sort((a, b) => {
        const au = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bu = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        const ac = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bc = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        const ad = a.dueAt
          ? new Date(a.dueAt).getTime()
          : Number.POSITIVE_INFINITY;
        const bd = b.dueAt
          ? new Date(b.dueAt).getTime()
          : Number.POSITIVE_INFINITY;

        if (sortBy === "UPDATED_DESC") return bu - au;
        if (sortBy === "CREATED_DESC") return bc - ac;
        if (sortBy === "DUE_ASC") return ad - bd;
        if (sortBy === "TITLE_ASC")
          return (a.title || "").localeCompare(b.title || "");
        return 0;
      });
    }

    return list;
  }, [tasks, q, stageFilter, dueFilter, updatedFilter, sortBy, coreStageSet]);

  const activeFilterCount =
    (stageFilter !== "ALL" ? 1 : 0) +
    (dueFilter !== "ANY" ? 1 : 0) +
    (updatedFilter !== "ANY" ? 1 : 0) +
    (sortBy !== "UPDATED_DESC" ? 1 : 0);

  function clearFilters() {
    setStageFilter("ALL");
    setDueFilter("ANY");
    setUpdatedFilter("ANY");
    setSortBy("UPDATED_DESC");
  }

  return (
    <div className="h-full min-h-0 flex flex-col border-r border-slate-200 bg-white overflow-hidden">
      {/* ===== Command Bar (compact desktop-friendly) ===== */}
      <div className="border-b border-slate-200 bg-white px-3 py-2 xl:px-4">
        {/* Search dominates */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
              🔍
            </div>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tasks..."
              className={`w-full min-w-0 rounded-xl border border-slate-800 bg-slate-100 focus:bg-white pl-3 pr-9 shadow-sm transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 ${
                compact ? "py-1.5 text-xs" : "py-2.5 text-sm"
              }`}
            />

            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-slate-400 transition hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
          {/* Small status line (kept very compact) */}
          <div className=" max-w-24 mt-2 flex flex-col items-center justify-between text-[11px] text-slate-500">
            <span>
              {showArchived ? "Archived" : "Active"} · {filtered.length} shown
            </span>
            {q ? (
              <span className="hidden xl:inline">Searching: “{q}”</span>
            ) : (
              <span />
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {/* Filters */}
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className={`shrink-0 rounded-lg border border-slate-200 bg-white hover:border-slate-300 ${
              compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
            }`}
            title="Filters"
          >
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">⚙️</span>
              <span className={compact ? "hidden" : ""}>Filters</span>
              {activeFilterCount > 0 ? (
                <span className="ml-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                  {activeFilterCount}
                </span>
              ) : null}
            </span>
          </button>

          {/* New */}
          <button
            type="button"
            onClick={onCreate}
            className={`shrink-0 rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] ${
              compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
            }`}
            title="Create new task"
          >
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">＋</span>
              <span className={compact ? "hidden" : ""}>New</span>
            </span>
          </button>

          {/* Archive toggle */}
          <button
            type="button"
            onClick={onToggleArchived}
            className={`shrink-0 rounded-lg border border-slate-200 bg-white hover:border-slate-300 ${
              compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
            }`}
            title={
              showArchived ? "Back to active tasks" : "View archived tasks"
            }
          >
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">{showArchived ? "↩" : "📦"}</span>
              <span className={compact ? "hidden" : ""}>
                {showArchived ? "Back" : "Archive"}
              </span>
            </span>
          </button>

          {/* Download Summary */}
          <button
            type="button"
            onClick={() => exportTaskSummaryPdf(tasks)}
            className={`shrink-0 rounded-lg border border-slate-200 bg-white hover:border-slate-300 ${
              compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
            }`}
            title="Download summary PDF"
          >
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true" className="text-red-700">
                <FaRegFilePdf />
              </span>
              <span className={compact ? "hidden" : ""}>PDF Summary</span>
            </span>
          </button>
        </div>

        {/* ===== Filter drawer (desktop-only feel, but safe everywhere) ===== */}
        {filtersOpen ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2">
              {/* Stage (curated, not polluted) */}
              <div>
                <div className="text-[11px] text-slate-600 mb-1">Stage</div>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                >
                  <option value="ALL">Any stage</option>
                  <option value="CUSTOM">Custom / Other</option>
                  <optgroup label="Core stages">
                    {QUICK_STAGES.map((st) => (
                      <option key={st} value={`CORE:${st}`}>
                        {st}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Due */}
              <div>
                <div className="text-[11px] text-slate-600 mb-1">Due</div>
                <select
                  value={dueFilter}
                  onChange={(e) => setDueFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                >
                  <option value="ANY">Any</option>
                  <option value="HAS">Has due date</option>
                  <option value="NONE">No due date</option>
                  <option value="DUE_SOON">Due ≤3 days</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              {/* Updated */}
              <div>
                <div className="text-[11px] text-slate-600 mb-1">Updated</div>
                <select
                  value={updatedFilter}
                  onChange={(e) => setUpdatedFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                >
                  <option value="ANY">Any time</option>
                  <option value="7D">Last 7 days</option>
                  <option value="30D">Last 30 days</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <div className="text-[11px] text-slate-600 mb-1">Sort</div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs"
                >
                  <option value="MANUAL">Keep current order</option>
                  <option value="UPDATED_DESC">Recently updated</option>
                  <option value="CREATED_DESC">Recently created</option>
                  <option value="DUE_ASC">Due date (earliest)</option>
                  <option value="TITLE_ASC">Title (A–Z)</option>
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 bg-rose-700 text-white hover:bg-rose-500"
              >
                Clear filters <span className="text-[12px]">🗑️</span>
              </button>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="text-xs px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ===== List ===== */}
      <div className="flex-1 min-h-0 overflow-auto bg-slate-50">
        {filtered.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            No tasks found. Try clearing filters or create a new task.
          </div>
        ) : (
          <ul className="divide-y divide-black border border-t-black">
            {filtered.map((t) => {
              const isSelected = t.id === selectedTaskId;
              const agingDays = diffDays(t.createdAt, new Date().toISOString());
              const s = getStageStyle(t.currentStage);
              const meta = metaLine(t);

              return (
                <li
                  key={t.id}
                  className={`relative cursor-pointer bg-white hover:bg-slate-50 transition ${
                    isSelected
                      ? "bg-gradient-to-b from-[#e1e1f4] via-[#f3f3f1] to-[#f7f7f7]"
                      : "bg-white hover:bg-slate-50"
                  }`}
                  onClick={() => onSelect(t.id)}
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${s.dot} opacity-80`}
                    aria-hidden="true"
                  />

                  <div className="p-3 pl-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div
                          className="truncate text-sm font-semibold text-slate-900"
                          title={t.title || "Untitled"}
                        >
                          {t.title || "Untitled"}
                        </div>

                        {meta ? (
                          <div
                            className={`mt-1 truncate text-rose-700 ${
                              compact ? "text-[11px]" : "text-xs"
                            }`}
                            title={meta}
                          >
                            {meta}
                          </div>
                        ) : null}

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full border ${s.chip}`}
                          >
                            {t.currentStage || "—"}
                          </span>

                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {agingDays}d
                          </span>
                        </div>
                      </div>

                      {/* Actions show only for selected row (cleaner) */}
                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="flex items-center gap-2">
                            {showArchived ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUnarchive(t.id);
                                }}
                                className="text-[11px] px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onArchive(t.id);
                                }}
                                className="text-[16px] px-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                              >
                                📦
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(t.id);
                              }}
                              className="text-[16px] px-2 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            >
                              🗑️
                            </button>
                          </div>
                        ) : (
                          <div className="h-7 w-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  selectedTaskId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onUnarchive: PropTypes.func.isRequired,
  showArchived: PropTypes.bool.isRequired,
  onToggleArchived: PropTypes.func.isRequired,
};
