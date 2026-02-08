// import { useState } from "react";
// import PropTypes from "prop-types";
// import { diffDays } from "./utils";
// import { getStageStyle } from "./constants";
// import TaskDetail from "./TaskDetail";

// function daysUntil(dueAt) {
//   if (!dueAt) return null;
//   const now = new Date();
//   const due = new Date(dueAt);
//   const ms = due.getTime() - now.getTime();
//   return Math.ceil(ms / (1000 * 60 * 60 * 24));
// }

// function dueLabel(d) {
//   if (d === null) return null;
//   if (d < 0) return `Overdue +${Math.abs(d)}d`;
//   if (d === 0) return "Due today";
//   return `Due D-${d}`;
// }

// function dueTone(d) {
//   if (d === null) return "text-slate-500";
//   if (d < 0) return "text-rose-700 font-medium";
//   if (d <= 3) return "text-amber-700 font-medium";
//   return "text-slate-500";
// }

// const QUICK_MOBILE = [
//   "Pending",
//   "Under submission",
//   "Sent to IFD",
//   "Comments awaited",
//   "Approved",
//   "Completed",
// ];

// export default function MobileTaskAccordion({
//   tasks,
//   expandedTaskId,
//   onToggle,
//   onAddUpdate,
//   onNotify,
//   onEditDetails,
//   onDelete,
//   onOpenShare,
//   onArchive, // ✅ add
//   archiveLabel, // ✅ optional (Archive / Restore)
//   isArchivedView,
// }) {
//   const [quickOpenFor, setQuickOpenFor] = useState(null); // taskId | null
//   const [savingFor, setSavingFor] = useState(null); // taskId | null

//   if (!tasks.length) {
//     return <div className="p-4 text-sm text-slate-600">No tasks found.</div>;
//   }

//   function displayTitle(title = "", max = 100) {
//     const t = (title || "").trim();
//     if (t.length <= max) return t;
//     return t.slice(0, max - 1) + "…";
//   }

//   return (
//     <div className=" pb-6 space-y-2">
//       <div className="bg-slate-50 text-center">
//         <p className=" text-base px-2 text-center font-extrabold text-slate-600 tracking-wider">
//           Your Task List
//         </p>
//         <p className="px-1 text-[11px] leading-5 text-slate-600 tracking-tight">
//           Tip: Tap a task to expand. Use{" "}
//           <span className="font-medium">⚡ Quick </span> to update the stage
//           without opening full details.
//         </p>
//       </div>

//       {tasks.map((t) => {
//         const open = expandedTaskId === t.id;
//         const s = getStageStyle(t.currentStage);
//         const aging = diffDays(t.createdAt, new Date().toISOString());
//         const d = t.dueAt ? daysUntil(t.dueAt) : null;
//         const dueText = dueLabel(d);

//         const quickOpen = !open && quickOpenFor === t.id;
//         const isSaving = savingFor === t.id;

//         return (
//           <div
//             key={t.id}
//             className={`relative rounded-xl bg-white border overflow-hidden transition
//               ${open ? "border-slate-300 shadow-sm" : "border-slate-200"}
//             `}
//           >
//             {/* Left accent bar */}
//             <div
//               className={`absolute left-0 top-0 h-full w-1 ${s.dot} opacity-80`}
//               aria-hidden="true"
//             />

//             {/* Header */}
//             <div className={`p-3 pl-4 ${open ? "bg-slate-50" : "bg-white"}`}>
//               {/* Row 1: Title + chevron (only) */}
//               <div className="flex items-start gap-2">
//                 <button
//                   type="button"
//                   onClick={() => onToggle(t.id)}
//                   aria-expanded={open}
//                   aria-controls={`task-${t.id}`}
//                   className="flex-1 min-w-0 text-left rounded-xl p-2 -m-2 transition
//                     hover:bg-slate-100/70 active:bg-slate-100 active:scale-[0.995]
//                     focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
//                   "
//                 >
//                   <div className="text-sm font-semibold text-slate-900 break-words line-clamp-2">
//                     <span title={t.title}>
//                       {displayTitle(t.title, 100) || "Untitled"}
//                     </span>
//                   </div>

//                   {/* Meta row */}
//                   <div className="mt-2 flex flex-wrap items-center gap-2">
//                     <span
//                       className={`text-xs px-2 py-1 rounded-full border ${s.chip}`}
//                       title="Current stage"
//                     >
//                       {t.currentStage || "—"}
//                     </span>

//                     <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
//                       {aging}d
//                     </span>

//                     {dueText ? (
//                       <span
//                         className={`text-xs ${dueTone(d)}`}
//                         title={new Date(t.dueAt).toLocaleDateString()}
//                       >
//                         {dueText}
//                       </span>
//                     ) : (
//                       <span className="text-xs text-slate-500">No due</span>
//                     )}
//                   </div>
//                 </button>

//                 {/* Chevron only (small fixed width) */}
//                 <button
//                   type="button"
//                   onClick={() => onToggle(t.id)}
//                   className="shrink-0 p-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 active:scale-[0.99]
//                     focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
//                   "
//                   title={open ? "Collapse" : "Expand"}
//                   aria-label={open ? "Collapse task" : "Expand task"}
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     className={`h-4 w-4 text-slate-700 transition-transform ${
//                       open ? "rotate-180" : ""
//                     }`}
//                   >
//                     <path d="M6 9l6 6 6-6" />
//                   </svg>
//                 </button>
//               </div>

//               {/* Row 2: actions moved below (more space for text above) */}
//               <div className="mt-3 bg-white p-1 rounded-lg flex items-center justify-end gap-2">
//                 {/* ✅ If archived view: only show Restore (and optionally Delete) */}
//                 {isArchivedView ? (
//                   <>
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onArchive?.(t.id); // in archived view, this should be "restore"
//                       }}
//                       className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
//                       title="Restore"
//                     >
//                       ↩️
//                     </button>

//                     {/* Optional: allow delete from archive view */}
//                     {/*
//       <button
//         type="button"
//         onClick={(e) => {
//           e.stopPropagation();
//           onDelete(t.id);
//         }}
//         className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
//         title="Delete"
//       >
//         🗑️
//       </button>
//       */}
//                   </>
//                 ) : (
//                   <>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setQuickOpenFor((prev) => (prev === t.id ? null : t.id))
//                       }
//                       className={`px-3 py-2 rounded-lg border text-[11px] transition
//           ${
//             quickOpen
//               ? "border-slate-300 bg-slate-50 text-slate-900"
//               : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
//           }
//           active:scale-[0.99]
//           focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
//         `}
//                       title="Quick update"
//                       aria-label="Quick update"
//                     >
//                       ⚡ Quick Update
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => onEditDetails(t.id)}
//                       className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300 active:scale-[0.99]
//           focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
//         "
//                       aria-label="Edit task details"
//                       title="Edit details"
//                     >
//                       ✏️
//                     </button>

//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onArchive?.(t.id);
//                       }}
//                       className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
//                       title={archiveLabel || "Archive"}
//                     >
//                       📦
//                     </button>

//                     {onOpenShare ? (
//                       <button
//                         type="button"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           onOpenShare(t.id);
//                         }}
//                         className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300 active:scale-[0.99]
//             focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
//           "
//                         aria-label="Share task"
//                         title="Share"
//                       >
//                         🔗
//                       </button>
//                     ) : null}

//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onDelete(t.id);
//                       }}
//                       className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300 active:scale-[0.99]
//           focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
//         "
//                       aria-label="Delete task"
//                       title="Delete"
//                     >
//                       🗑️
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Quick stage row (collapsed-only) */}
//             {quickOpen && (
//               <div className="border-t border-slate-200 bg-white px-3 py-2">
//                 <div className="flex items-center justify-between">
//                   <div className="text-[11px] text-slate-500">
//                     Quick stage update
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => setQuickOpenFor(null)}
//                     className="text-[11px] font-medium text-slate-700 hover:text-slate-900"
//                   >
//                     Close
//                   </button>
//                 </div>

//                 <div className="mt-2 flex flex-wrap gap-2">
//                   {QUICK_MOBILE.map((st) => {
//                     const active = (t.currentStage || "") === st;

//                     return (
//                       <button
//                         key={st}
//                         type="button"
//                         disabled={isSaving}
//                         onClick={async () => {
//                           try {
//                             setSavingFor(t.id);
//                             await Promise.resolve(
//                               onAddUpdate(t.id, {
//                                 kind: "stage_change",
//                                 toStage: st,
//                                 remark: "",
//                               }),
//                             );
//                             onNotify?.(`Updated: ${st}`, "success");
//                             setQuickOpenFor(null);
//                           } catch (e) {
//                             onNotify?.("Could not update stage", "error");
//                           } finally {
//                             setSavingFor(null);
//                           }
//                         }}
//                         className={`text-xs px-3 py-1.5 rounded-full border transition
//                           ${
//                             active
//                               ? "bg-slate-900 text-white border-slate-900"
//                               : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white"
//                           }
//                           ${isSaving ? "opacity-60 cursor-not-allowed" : ""}
//                         `}
//                         title={`Set stage to ${st}`}
//                       >
//                         {isSaving ? "Saving…" : st}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 <div className="mt-2 text-[11px] text-slate-500">
//                   This adds a milestone update instantly (no need to expand).
//                 </div>
//               </div>
//             )}

//             {/* Body */}
//             {open && (
//               <div id={`task-${t.id}`} className="border-t border-slate-200">
//                 <TaskDetail
//                   task={t}
//                   onAddUpdate={(payload) => onAddUpdate(t.id, payload)}
//                   onOpenShare={() => onOpenShare?.(t.id)}
//                   onEditDetails={() => onEditDetails(t.id)}
//                   onNotify={onNotify}
//                   embedded
//                 />
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// MobileTaskAccordion.propTypes = {
//   tasks: PropTypes.array.isRequired,
//   expandedTaskId: PropTypes.string,
//   onToggle: PropTypes.func.isRequired,
//   onAddUpdate: PropTypes.func.isRequired,
//   onEditDetails: PropTypes.func.isRequired,
//   onOpenShare: PropTypes.func,
//   onNotify: PropTypes.func,
//   onDelete: PropTypes.func.isRequired,
//   onArchive: PropTypes.func, // ✅ add
//   archiveLabel: PropTypes.string, // ✅ optional
//   isArchivedView: PropTypes.bool,
// };

import { useEffect, useState } from "react";
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
  if (d === null) return "text-slate-500";
  if (d < 0) return "text-rose-700 font-medium";
  if (d <= 3) return "text-amber-700 font-medium";
  return "text-slate-500";
}

const QUICK_MOBILE = [
  "Pending",
  "Under submission",
  "Sent to IFD",
  "Comments awaited",
  "Approved",
  "Completed",
];

const MENU_W = 360; // popover width
const MENU_H_EST = 280; // rough estimate for upward placement decision
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
  const [savingFor, setSavingFor] = useState(null); // taskId | null

  // ✅ Instead of collapsible, keep a fixed popover anchored to the button
  const [quickMenu, setQuickMenu] = useState(null);
  // quickMenu = { taskId, left, top } | null

  // Close menu if user expands a task
  useEffect(() => {
    if (expandedTaskId) setQuickMenu(null);
  }, [expandedTaskId]);

  // Close menu if the task disappears (e.g., archived and removed from list)
  const menuTask = quickMenu
    ? tasks.find((x) => x.id === quickMenu.taskId) || null
    : null;

  useEffect(() => {
    if (quickMenu && !menuTask) setQuickMenu(null);
  }, [quickMenu, menuTask]);

  // Escape closes menu
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setQuickMenu(null);
    }
    if (quickMenu) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quickMenu]);

  if (!tasks.length) {
    return <div className="p-4 text-sm text-slate-600">No tasks found.</div>;
  }

  function displayTitle(title = "", max = 100) {
    const t = (title || "").trim();
    if (t.length <= max) return t;
    return t.slice(0, max - 1) + "…";
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function openQuickMenu(taskId, buttonEl) {
    if (!buttonEl) return;

    const rect = buttonEl.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer align-right to the button
    let left = rect.right - MENU_W;
    left = clamp(left, PAD, vw - MENU_W - PAD);

    // Prefer below the button, but if not enough room, open above
    const spaceBelow = vh - rect.bottom;
    const openUp = spaceBelow < MENU_H_EST;
    let top = openUp ? rect.top - MENU_H_EST - 8 : rect.bottom + 8;
    top = clamp(top, PAD, vh - PAD - 200); // keep on-screen

    setQuickMenu((prev) => {
      if (prev?.taskId === taskId) return null; // toggle
      return { taskId, left, top };
    });
  }

  return (
    <div className="pb-6 space-y-2">
      {/* ✅ Smooth animation keyframes (local, no tailwind plugin needed) */}
      <style>{`
        @keyframes ttFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes ttPopIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>

      {/* ✅ Overlay (tap outside to close) */}
      {quickMenu && (
        <button
          type="button"
          className="fixed inset-0 z-[999] cursor-default"
          style={{ animation: "ttFadeIn 120ms ease-out" }}
          onClick={() => setQuickMenu(null)}
          aria-label="Close quick update menu"
        />
      )}

      {/* ✅ Fixed popover menu (ALWAYS above accordion items) */}
      {quickMenu && menuTask && !isArchivedView && (
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
                  Quick stage update
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {menuTask.title || "Untitled"}
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

            {/* ✅ Taller menu + scroll if needed */}
            <div className="p-4 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-2 gap-2">
                {QUICK_MOBILE.map((st) => {
                  const active = (menuTask.currentStage || "") === st;
                  const isSaving = savingFor === menuTask.id;

                  return (
                    <button
                      key={st}
                      type="button"
                      disabled={isSaving}
                      onClick={async () => {
                        try {
                          setSavingFor(menuTask.id);
                          await Promise.resolve(
                            onAddUpdate(menuTask.id, {
                              kind: "stage_change",
                              toStage: st,
                              remark: "",
                            }),
                          );
                          onNotify?.(`Updated: ${st}`, "success");
                          setQuickMenu(null); // ✅ close after update
                        } catch (e) {
                          onNotify?.("Could not update stage", "error");
                        } finally {
                          setSavingFor(null);
                        }
                      }}
                      className={`text-xs px-3 py-4 rounded-xl border transition text-left
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
                      {/* <div className="text-[11px] opacity-70">
                        {active ? "Current stage" : "Tap to set"}
                      </div> */}
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

      {/* Header */}
      <div className="bg-slate-50 text-center">
        <p className="text-base px-2 text-center font-extrabold text-slate-600 tracking-wider">
          Your Task List
        </p>
        <p className="px-1 text-[11px] leading-5 text-slate-600 tracking-tight">
          Tip: Tap a task to expand. Use{" "}
          <span className="font-medium">⚡ Quick </span> to update the stage
          without opening full details.
        </p>
      </div>

      {tasks.map((t) => {
        const open = expandedTaskId === t.id;
        const s = getStageStyle(t.currentStage);
        const aging = diffDays(t.createdAt, new Date().toISOString());
        const d = t.dueAt ? daysUntil(t.dueAt) : null;
        const dueText = dueLabel(d);

        return (
          <div
            key={t.id}
            className={`relative rounded-xl bg-white border overflow-visible transition
              ${open ? "border-slate-300 shadow-sm" : "border-slate-200"}
            `}
          >
            {/* Left accent bar */}
            <div
              className={`absolute left-0 top-0 h-full w-1 ${s.dot} opacity-80`}
              aria-hidden="true"
            />

            {/* Header */}
            <div className={`p-3 pl-4 ${open ? "bg-slate-50" : "bg-white"}`}>
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => onToggle(t.id)}
                  aria-expanded={open}
                  aria-controls={`task-${t.id}`}
                  className="flex-1 min-w-0 text-left rounded-xl p-2 -m-2 transition
                    hover:bg-slate-100/70 active:bg-slate-100 active:scale-[0.995]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
                  "
                >
                  <div className="text-sm font-semibold text-slate-900 break-words line-clamp-2">
                    <span title={t.title}>
                      {displayTitle(t.title, 100) || "Untitled"}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${s.chip}`}
                      title="Current stage"
                    >
                      {t.currentStage || "—"}
                    </span>

                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {aging}d
                    </span>

                    {dueText ? (
                      <span
                        className={`text-xs ${dueTone(d)}`}
                        title={new Date(t.dueAt).toLocaleDateString()}
                      >
                        {dueText}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">No due</span>
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onToggle(t.id)}
                  className="shrink-0 p-2 rounded-lg border border-slate-200 bg-white hover:border-slate-300 active:scale-[0.99]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
                  "
                  title={open ? "Collapse" : "Expand"}
                  aria-label={open ? "Collapse task" : "Expand task"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`h-4 w-4 text-slate-700 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>

              {/* Actions */}
              <div className="mt-3 bg-white p-1 rounded-lg flex items-center justify-end gap-2">
                {isArchivedView ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive?.(t.id);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
                      title="Restore"
                    >
                      ↩️
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickMenu(t.id, e.currentTarget);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
                      title="Quick update"
                      aria-label="Quick update"
                    >
                      ⚡ Quick Update
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditDetails(t.id)}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
                      title="Edit details"
                    >
                      ✏️
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive?.(t.id);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
                      title={archiveLabel || "Archive"}
                    >
                      📦
                    </button>

                    {onOpenShare ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenShare(t.id);
                        }}
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
                        title="Share"
                      >
                        🔗
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(t.id);
                      }}
                      className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 hover:border-slate-300"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Body */}
            {open && (
              <div id={`task-${t.id}`} className="border-t border-slate-200">
                <TaskDetail
                  task={t}
                  onAddUpdate={(payload) => onAddUpdate(t.id, payload)}
                  onOpenShare={() => onOpenShare?.(t.id)}
                  onEditDetails={() => onEditDetails(t.id)}
                  onNotify={onNotify}
                  embedded
                />
              </div>
            )}
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
