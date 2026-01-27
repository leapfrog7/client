import { diffDays, formatDateTime } from "./utils";
import { getStageStyle } from "./constants";
import PropTypes from "prop-types";

export default function Timeline({ task }) {
  const events = task?.events || [];
  if (!task) return null;

  const currentStageEventId = (() => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i]?.type === "stage_change") return events[i].id;
    }
    return null;
  })();

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Milestones</h3>
        <span className="text-xs text-slate-500">{events.length} updates</span>
      </div>

      <div className="mt-4 space-y-3">
        {events.map((e, idx) => {
          const prev = events[idx - 1];
          const gap = prev
            ? diffDays(prev.at, e.at)
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

          return (
            <div key={e.id} className="relative pl-6">
              {/* vertical line */}
              <div className="absolute left-[6px] top-0 bottom-0 w-px bg-slate-200" />

              {/* dot + pulse */}
              <div className="absolute left-0 top-1">
                <div
                  className={`h-3 w-3 rounded-full ${dot} ${isCurrent ? "animate-pulse" : ""}`}
                />
                {isCurrent && (
                  <div className="absolute -inset-2 rounded-full border border-slate-300/70" />
                )}
              </div>

              <div
                className={`p-3 rounded-xl border ${isCurrent ? "border-slate-300 bg-white" : "border-slate-200 bg-white"}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {title}
                  </div>

                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                    +{gap}d
                  </span>

                  <span className="text-xs text-slate-500">
                    {formatDateTime(e.at)}
                  </span>

                  {isCurrent && (
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-900 text-white">
                      Current
                    </span>
                  )}
                </div>

                {e.remark ? (
                  <div className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                    {e.remark}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
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
