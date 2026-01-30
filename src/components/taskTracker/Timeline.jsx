import { useMemo, useState } from "react";
import { diffDays, formatDateTime } from "./utils";
import { getStageStyle } from "./constants";
import PropTypes from "prop-types";

export default function Timeline({ task }) {
  const [showAll, setShowAll] = useState(false);

  // Always define events, even when task is null, so hooks are stable
  const events = task?.events || [];

  // Sort newest first for display (current status at top)
  const sorted = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [events]);

  // Identify latest stage_change event in the sorted list
  const currentStageEventId = useMemo(() => {
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i]?.type === "stage_change") return sorted[i].id;
    }
    return null;
  }, [sorted]);

  const visible = useMemo(() => {
    if (showAll) return sorted;
    return sorted.slice(0, 5);
  }, [sorted, showAll]);

  const total = sorted.length;
  const hiddenCount = Math.max(0, total - visible.length);

  // Safe early return AFTER hooks
  if (!task) return null;

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Milestones</h3>

        <div className="flex items-center gap-3">
          <span className="text-xs md:text-sm text-slate-500">
            {total} updates
          </span>

          {total > 5 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="bg-indigo-100 p-2 rounded-lg shadow-sm text-xs md:text-sm font-medium text-indigo-800 hover:text-slate-50 hover:bg-indigo-800"
            >
              {showAll ? "Show recent" : `Show all (${hiddenCount}+ more)`}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {visible.map((e, idx) => {
          // In newest-first view, the next item is older
          const older = visible[idx + 1];

          const gap = older
            ? diffDays(older.at, e.at)
            : diffDays(task.createdAt, e.at);

          const title =
            e.type === "stage_change"
              ? `${e.fromStage ? `${e.fromStage} → ` : ""}${e.toStage || "—"}`
              : "Remark";

          const dot =
            e.type === "stage_change"
              ? getStageStyle(e.toStage).dot
              : "bg-slate-400";

          const isCurrent = e.id === currentStageEventId;
          const isLastVisible = idx === visible.length - 1;

          return (
            <div key={e.id} className="relative pl-7">
              {/* vertical line */}
              <div
                className={`absolute left-[7px] top-0 ${
                  isLastVisible ? "h-4" : "bottom-0"
                } w-px bg-slate-300`}
              />

              {/* dot + pulse */}
              <div className="absolute left-[2px] top-3">
                {/* base dot */}
                <div className={`h-3.5 w-3.5 rounded-full ${dot}`} />

                {/* ripple ring */}
                {isCurrent && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-gray-500 animate-[ping_2.0s_ease-out_infinite]" />
                )}
              </div>

              <div
                className={`rounded-xl border bg-white p-3 ${
                  isCurrent
                    ? "border-slate-300 ring-1 ring-slate-200"
                    : "border-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {title}
                  </div>

                  <span className="text-[11px] md:text-sm px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    +{gap}d
                  </span>

                  <span className="text-[11px] md:text-sm text-slate-500">
                    {formatDateTime(e.at)}
                  </span>

                  {isCurrent && (
                    <span className="text-[11px] md:text-sm px-2 py-0.5 rounded-full bg-slate-900 text-white">
                      Current
                    </span>
                  )}

                  {e.actor ? (
                    <span className="text-[11px] md:text-sm text-slate-500">
                      • {e.actor}
                    </span>
                  ) : null}
                </div>

                {e.remark ? (
                  <div className="mt-1 text-sm text-slate-700 whitespace-pre-wrap break-words">
                    {e.remark}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {total === 0 && (
          <div className="text-sm text-slate-600">No updates yet.</div>
        )}
      </div>
    </div>
  );
}

Timeline.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    identifiers: PropTypes.shape({
      receiptNo: PropTypes.string,
      fileNo: PropTypes.string,
      section: PropTypes.string,
    }),
    currentStage: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["stage_change", "remark"]).isRequired,
        fromStage: PropTypes.string,
        toStage: PropTypes.string,
        remark: PropTypes.string,
        actor: PropTypes.string,
        at: PropTypes.string.isRequired,
      }),
    ),
  }),
};
