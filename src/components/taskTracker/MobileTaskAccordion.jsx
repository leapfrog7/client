// import React from "react";
import PropTypes from "prop-types";
import { diffDays } from "./utils";
import { getStageStyle } from "./constants";
import TaskDetail from "./TaskDetail";

export default function MobileTaskAccordion({
  tasks,
  expandedTaskId,
  onToggle,
  onAddUpdate,
  onNotify,
  onEditDetails,
}) {
  if (!tasks.length) {
    return <div className="p-4 text-sm text-slate-600">No tasks found.</div>;
  }

  return (
    <div className="px-3 pb-6 space-y-3">
      {tasks.map((t) => {
        const open = expandedTaskId === t.id;
        const s = getStageStyle(t.currentStage);
        const aging = diffDays(t.createdAt, new Date().toISOString());

        return (
          <div
            key={t.id}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
          >
            {/* Header */}
            {/* Header */}
            <div className="p-3 flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => onToggle(t.id)}
                className="flex-1 text-left hover:bg-slate-50 rounded-xl p-2 -m-2"
              >
                <div className="text-sm font-semibold text-slate-900 truncate">
                  {t.title}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${s.chip}`}
                  >
                    {t.currentStage || "—"}
                  </span>
                  <span className="text-xs text-slate-500">
                    Aging: {aging}d
                  </span>
                  {t.dueAt ? (
                    <span className="text-xs text-slate-500">
                      Due: {new Date(t.dueAt).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>
              </button>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onEditDetails(t.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-slate-300"
                  title="Edit details"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onToggle(t.id)}
                  className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs hover:border-slate-300"
                  title={open ? "Collapse" : "Expand"}
                >
                  {open ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* Body */}
            {open && (
              <div className="border-t border-slate-200">
                <TaskDetail
                  task={t}
                  onAddUpdate={onAddUpdate}
                  onOpenShare={() => {}}
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
  onNotify: PropTypes.func,
};
