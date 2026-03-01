import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { diffDays } from "./utils";
import { getStageStyle } from "./constants";
import TaskDetail from "./TaskDetail";

function daysUntil(dueAt) {
  if (!dueAt) return null;
  const now = new Date();
  const due = new Date(dueAt);
  const ms = due.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function dueLabel(d) {
  if (d === null) return null;
  if (d < 0) return `Overdue +${Math.abs(d)}d`;
  if (d === 0) return "Due today";
  return `Due D-${d}`;
}

function dueTone(d) {
  if (d === null) return null;
  if (d < 0) return "bg-rose-50 text-rose-800 border-rose-200";
  if (d <= 3) return "bg-amber-50 text-amber-800 border-amber-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

const QUICK_MOBILE = [
  "Pending",
  "Under submission",
  "Sent to IFD",
  "Comments awaited",
  "Approved",
  "Completed",
];

const MENU_W = 340;
const QUICK_MENU_H_EST = 320;
const MORE_MENU_H_EST = 280;
const PAD = 12;

export default function MobileTaskAccordion({
  tasks,
  expandedTaskId,
  onToggle,
  onAddUpdate,
  onNotify,
  onEditDetails,
  onDelete,
  onOpenShare,
  onArchive,
  archiveLabel,
  isArchivedView,
}) {
  const [savingFor, setSavingFor] = useState(null);

  // Menus (anchored)
  const [quickMenu, setQuickMenu] = useState(null); // { taskId, left, top } | null
  const [moreMenu, setMoreMenu] = useState(null); // { taskId, left, top } | null
  const anyMenuOpen = !!quickMenu || !!moreMenu;

  // Measured-height animation refs
  const bodyRefs = useRef({}); // taskId -> body inner element
  const [heights, setHeights] = useState({}); // taskId -> px

  // Close menus if user expands a task
  useEffect(() => {
    if (expandedTaskId) {
      setQuickMenu(null);
      setMoreMenu(null);
    }
  }, [expandedTaskId]);

  // Resolve menu task objects
  const quickTask = useMemo(
    () =>
      quickMenu ? tasks.find((x) => x.id === quickMenu.taskId) || null : null,
    [quickMenu, tasks],
  );
  const moreTask = useMemo(
    () =>
      moreMenu ? tasks.find((x) => x.id === moreMenu.taskId) || null : null,
    [moreMenu, tasks],
  );

  // Close menu if task disappears
  useEffect(() => {
    if (quickMenu && !quickTask) setQuickMenu(null);
  }, [quickMenu, quickTask]);

  useEffect(() => {
    if (moreMenu && !moreTask) setMoreMenu(null);
  }, [moreMenu, moreTask]);

  // Escape closes menus
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setQuickMenu(null);
        setMoreMenu(null);
      }
    }
    if (anyMenuOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [anyMenuOpen]);

  function displayTitle(title = "", max = 100) {
    const t = (title || "").trim();
    if (t.length <= max) return t;
    return t.slice(0, max - 1) + "…";
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function computeMenuPos(buttonEl, estH) {
    const rect = buttonEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = rect.right - MENU_W;
    left = clamp(left, PAD, vw - MENU_W - PAD);

    const spaceBelow = vh - rect.bottom;
    const openUp = spaceBelow < estH;
    let top = openUp ? rect.top - estH - 8 : rect.bottom + 8;
    top = clamp(top, PAD, vh - PAD - 200);

    return { left, top };
  }

  function openQuickMenu(taskId, buttonEl) {
    if (!buttonEl) return;
    const pos = computeMenuPos(buttonEl, QUICK_MENU_H_EST);
    setMoreMenu(null);
    setQuickMenu((prev) => {
      if (prev?.taskId === taskId) return null;
      return { taskId, ...pos };
    });
  }

  function openMoreMenu(taskId, buttonEl) {
    if (!buttonEl) return;
    const pos = computeMenuPos(buttonEl, MORE_MENU_H_EST);
    setQuickMenu(null);
    setMoreMenu((prev) => {
      if (prev?.taskId === taskId) return null;
      return { taskId, ...pos };
    });
  }

  // ---- Measured-height animation helpers ----
  function measureHeight(taskId) {
    const el = bodyRefs.current?.[taskId];
    if (!el) return 0;
    return el.scrollHeight || 0;
  }

  // Measure when expanded task changes and on resize
  useEffect(() => {
    function syncHeight() {
      const id = expandedTaskId;
      if (!id) return;
      const h = measureHeight(id);
      setHeights((prev) => ({ ...prev, [id]: h }));
    }

    syncHeight();
    window.addEventListener("resize", syncHeight);
    return () => window.removeEventListener("resize", syncHeight);
  }, [expandedTaskId]);

  if (!tasks?.length) {
    return <div className="p-4 text-sm text-slate-600">No tasks found.</div>;
  }

  return (
    <div className="pb-6 space-y-2">
      <style>{`
        @keyframes ttFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ttPopIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>

      {/* Overlay (tap outside to close) */}
      {anyMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-[999] cursor-default"
          style={{ animation: "ttFadeIn 120ms ease-out" }}
          onClick={() => {
            setQuickMenu(null);
            setMoreMenu(null);
          }}
          aria-label="Close menu"
        />
      )}

      {/* QUICK MENU */}
      {quickMenu && quickTask && !isArchivedView && (
        <div
          className="fixed z-[1000]"
          style={{
            left: `${quickMenu.left}px`,
            top: `${quickMenu.top}px`,
            width: `${MENU_W}px`,
            animation: "ttPopIn 140ms ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
          role="menu"
          aria-label="Quick stage menu"
        >
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800">
                  Quick update
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {quickTask.title || "Untitled"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickMenu(null)}
                className="shrink-0 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs hover:border-slate-300"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-2 gap-2">
                {QUICK_MOBILE.map((st) => {
                  const active = (quickTask.currentStage || "") === st;
                  const isSaving = savingFor === quickTask.id;

                  return (
                    <button
                      key={st}
                      type="button"
                      disabled={isSaving}
                      onClick={async () => {
                        try {
                          setSavingFor(quickTask.id);
                          await Promise.resolve(
                            onAddUpdate(quickTask.id, {
                              kind: "stage_change",
                              toStage: st,
                              remark: "",
                            }),
                          );
                          onNotify?.(`Updated: ${st}`, "success");
                          setQuickMenu(null);
                        } catch (e) {
                          onNotify?.("Could not update stage", "error");
                        } finally {
                          setSavingFor(null);
                        }
                      }}
                      className={`text-xs px-3 py-3 rounded-xl border transition text-left
                        ${
                          active
                            ? "bg-amber-100 text-slate-700 border-yellow-400"
                            : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                        }
                        ${isSaving ? "opacity-60 cursor-not-allowed" : ""}
                      `}
                      title={`Set stage to ${st}`}
                    >
                      <div className="font-semibold">{st}</div>
                      <div className="text-[11px] opacity-70">
                        {active ? "Current stage" : "Tap to set"}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Tip: tap outside to close.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MORE MENU */}
      {moreMenu && moreTask && (
        <div
          className="fixed z-[1000]"
          style={{
            left: `${moreMenu.left}px`,
            top: `${moreMenu.top}px`,
            width: `${MENU_W}px`,
            animation: "ttPopIn 140ms ease-out",
          }}
          onClick={(e) => e.stopPropagation()}
          role="menu"
          aria-label="More actions"
        >
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800">
                  Actions
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {moreTask.title || "Untitled"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMoreMenu(null)}
                className="shrink-0 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs hover:border-slate-300"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {!isArchivedView ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenu(null);
                      onEditDetails?.(moreTask.id);
                    }}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 hover:bg-slate-50 text-left"
                  >
                    <div className="font-semibold">✏️ Edit</div>
                    <div className="text-[11px] text-slate-500">
                      title / due / identifiers
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenu(null);
                      onArchive?.(moreTask.id);
                    }}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 hover:bg-slate-50 text-left"
                  >
                    <div className="font-semibold">↩️ Restore</div>
                    <div className="text-[11px] text-slate-500">
                      back to active
                    </div>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMoreMenu(null);
                    onOpenShare?.(moreTask.id);
                  }}
                  className="px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 hover:bg-slate-50 text-left"
                >
                  <div className="font-semibold">🔗 Share</div>
                  <div className="text-[11px] text-slate-500">read-only</div>
                </button>

                {!isArchivedView ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenu(null);
                      onArchive?.(moreTask.id);
                    }}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 hover:bg-slate-50 text-left"
                  >
                    <div className="font-semibold">
                      📦 {archiveLabel || "Archive"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      hide from active
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenu(null);
                      onDelete(moreTask.id);
                    }}
                    className="px-3 py-3 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-800 hover:bg-rose-100 text-left"
                  >
                    <div className="font-semibold">🗑️ Delete</div>
                    <div className="text-[11px] text-rose-700">permanent</div>
                  </button>
                )}

                {!isArchivedView ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenu(null);
                      onDelete(moreTask.id);
                    }}
                    className="px-3 py-3 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-800 hover:bg-rose-100 text-left"
                  >
                    <div className="font-semibold">🗑️ Delete</div>
                    <div className="text-[11px] text-rose-700">permanent</div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMoreMenu(null);
                      onEditDetails?.(moreTask.id);
                    }}
                    className="px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 hover:bg-slate-50 text-left"
                  >
                    <div className="font-semibold">✏️ Edit</div>
                    <div className="text-[11px] text-slate-500">
                      title / due / identifiers
                    </div>
                  </button>
                )}
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Tip: tap outside to close.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-50 text-center">
        <p className="text-base px-2 font-extrabold text-slate-600 tracking-wider">
          Your Task List
        </p>
        <p className="px-1 text-[11px] leading-5 text-slate-600 tracking-tight">
          Tap a task to expand. Use{" "}
          <span className="font-medium">⚡ Quick</span> to update stage fast.
        </p>
      </div>

      {tasks.map((t) => {
        const open = expandedTaskId === t.id;
        const s = getStageStyle(t.currentStage);
        const aging = diffDays(t.createdAt, new Date().toISOString());

        const d = t.dueAt ? daysUntil(t.dueAt) : null;
        const dueText = dueLabel(d);
        const dueCls = dueTone(d);

        const measuredH = heights?.[t.id] ?? 0;

        return (
          <div
            key={t.id}
            className={`relative rounded-xl bg-white border overflow-visible transition
              ${
                open
                  ? "border-slate-300 shadow-sm ring-1 ring-slate-200"
                  : "border-slate-200"
              }`}
          >
            <div
              className={`absolute left-0 top-0 h-full w-1 ${s.dot} opacity-80`}
              aria-hidden="true"
            />

            {/* Header: title row + actions row */}
            <div className={`p-3 pl-4 ${open ? "bg-slate-50" : "bg-white"}`}>
              <button
                type="button"
                onClick={() => onToggle(t.id)}
                aria-expanded={open}
                aria-controls={`task-${t.id}`}
                className="w-full text-left rounded-xl p-2 -m-2 transition
                  hover:bg-slate-100/70 active:bg-slate-100 active:scale-[0.995]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
                "
              >
                <div className="text-sm font-semibold text-slate-900 break-words">
                  <span title={t.title}>
                    {displayTitle(t.title, 100) || "Untitled"}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${s.chip}`}
                      title="Current stage"
                    >
                      {t.currentStage || "—"}
                    </span>

                    <span className="text-[11px] text-slate-500">{aging}d</span>

                    {dueText ? (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full border ${dueCls}`}
                        title={
                          t.dueAt ? new Date(t.dueAt).toLocaleDateString() : ""
                        }
                      >
                        {dueText}
                      </span>
                    ) : null}
                  </div>

                  <div
                    className="shrink-0 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!isArchivedView ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickMenu(t.id, e.currentTarget);
                        }}
                        className="px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300 active:scale-[0.99]
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
                        "
                        aria-label="Quick update"
                        title="Quick update"
                      >
                        ⚡ Quick
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openMoreMenu(t.id, e.currentTarget);
                      }}
                      className="px-2.5 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300 active:scale-[0.99]
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
                      "
                      aria-label="More actions"
                      title="More actions"
                    >
                      ⋯
                    </button>
                  </div>
                </div>
              </button>
            </div>

            {/* Body: measured-height animation only */}
            <div
              id={`task-${t.id}`}
              className="border-t border-slate-200 overflow-hidden transition-[height,opacity] duration-300 ease-in-out"
              style={{
                height: open ? `${measuredH}px` : "0px",
                opacity: open ? 1 : 0,
              }}
            >
              <div
                ref={(node) => {
                  if (node) bodyRefs.current[t.id] = node;
                }}
                className="pt-2"
              >
                <TaskDetail
                  task={t}
                  onAddUpdate={(payload) => onAddUpdate(t.id, payload)}
                  onOpenShare={() => onOpenShare?.(t.id)}
                  onEditDetails={() => onEditDetails(t.id)}
                  onNotify={onNotify}
                  embedded
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

MobileTaskAccordion.propTypes = {
  tasks: PropTypes.array.isRequired,
  expandedTaskId: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  onAddUpdate: PropTypes.func.isRequired,
  onEditDetails: PropTypes.func.isRequired,
  onOpenShare: PropTypes.func,
  onNotify: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func,
  archiveLabel: PropTypes.string,
  isArchivedView: PropTypes.bool,
};
