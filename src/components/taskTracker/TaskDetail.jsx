import { useMemo } from "react";
import { diffDays, deriveLastStageEvent, safeTrim } from "./utils";
import Timeline from "./Timeline";
import { getStageStyle } from "./constants";
import UpdateComposer from "./UpdateComposer";
import PropTypes from "prop-types";

export default function TaskDetail({
  task,
  onAddUpdate,
  onOpenShare,
  onEditDetails,
  embedded = false,
}) {
  const stats = useMemo(() => {
    if (!task) return null;
    const now = new Date().toISOString();
    const totalAging = diffDays(task.createdAt, now);

    const lastStageEvt = deriveLastStageEvent(task.events);
    const stageSince = lastStageEvt?.at || task.createdAt;
    const inStageDays = diffDays(stageSince, now);

    return { totalAging, inStageDays };
  }, [task]);

  if (!task) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-base font-semibold text-slate-900">
            Select a task
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Choose from the left panel or create a new one.
          </div>
        </div>
      </div>
    );
  }
  const s = getStageStyle(task.currentStage);
  const id = task.identifiers || {};
  const title = safeTrim(task.title) || "Untitled";

  function StatCard({ label, value, emphasize }) {
    return (
      <div
        className={`p-4 rounded-xl border bg-white ${emphasize ? "border-rose-200" : "border-slate-200"}`}
      >
        <div className="text-xs text-slate-500">{label}</div>
        <div
          className={`mt-1 text-sm font-semibold ${emphasize ? "text-rose-700" : "text-slate-900"}`}
        >
          {value}
        </div>
      </div>
    );
  }

  StatCard.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    emphasize: PropTypes.bool,
  };

  return (
    <div
      className={
        embedded ? "bg-white" : "h-full overflow-auto bg-slate-50 mt-2"
      }
    >
      {" "}
      <div className={embedded ? "p-3" : "p-6"}>
        <div className="flex items-start justify-between gap-3 mt-2">
          <div className="min-w-0">
            <h1 className="text-sm lg:text-lg font-semibold text-slate-600 md:text-slate-800 truncate">
              {title}
            </h1>
            <div className="mt-1 text-xs md:text-sm text-slate-600">
              <span className="font-medium">Stage:</span>{" "}
              <span
                className={`inline-flex px-2 py-0.5 rounded-full border ${s.chip}`}
              >
                {task.currentStage || "—"}
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {id.section ? `${id.section} · ` : ""}
              {id.fileNo ? `eFile No: ${id.fileNo} · ` : ""}
              {id.receiptNo ? `Receipt: ${id.receiptNo}` : ""}
            </div>
          </div>
          {!embedded && (
            <button
              onClick={onOpenShare}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
              title="Open read-only share view"
            >
              Share View
            </button>
          )}
          {!embedded && (
            <button
              onClick={onEditDetails}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
              title="Edit title / due date / identifiers"
            >
              Edit Details
            </button>
          )}
        </div>

        {stats && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total Time" value={`${stats.totalAging} days`} />
            <StatCard
              label="In current stage"
              value={`${stats.inStageDays} days`}
            />
            <StatCard
              label="Last updated"
              value={new Date(task.updatedAt).toLocaleString()}
            />
            <StatCard
              label="Due date"
              value={
                task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "—"
              }
              emphasize={task.dueAt && new Date(task.dueAt) < new Date()}
            />
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <UpdateComposer
            currentStage={task.currentStage}
            onAddUpdate={onAddUpdate}
          />
          <Timeline task={task} />
        </div>
      </div>
    </div>
  );
}

TaskDetail.propTypes = {
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
    dueAt: PropTypes.string, // ISO string or nul
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
  onAddUpdate: PropTypes.func.isRequired, // receives { kind, toStage, remark }
  onOpenShare: PropTypes.func.isRequired,
  onEditDetails: PropTypes.func.isRequired,
  embedded: PropTypes.bool,
};
