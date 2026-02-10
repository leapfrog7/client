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
  onNotify,
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

  const isArchived =
    !!task?.archivedAt || task?.isArchived === true || task?.archived === true;
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

  function MiniSeg({
    label,
    value,
    accent,
    emphasize,
    dividerMd,
    dividerMobile,
  }) {
    return (
      <div
        className={`relative px-3 py-2.5 bg-white
        ${emphasize ? "bg-rose-50" : ""}
        ${dividerMd ? "md:border-l md:border-slate-200" : ""}
        ${dividerMobile ? "border-t border-slate-200 md:border-t-0" : ""}
      `}
      >
        {/* top accent */}
        <div
          className={`absolute left-0 top-0 h-1 w-full ${accent} ${
            emphasize ? "opacity-100" : "opacity-70"
          }`}
          aria-hidden="true"
        />

        <div className="pt-1">
          <div className="text-[12px] md:text-sm leading-4 text-gray-600">
            {label}
          </div>
          {/* slightly smaller on mobile to avoid date looking huge */}
          <div
            className={`mt-0.5 font-semibold leading-5 ${
              emphasize ? "text-rose-700" : "text-blue-900"
            } text-sm sm:text-base`}
          >
            {value}
          </div>
        </div>
      </div>
    );
  }

  MiniSeg.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    accent: PropTypes.string.isRequired,
    divider: PropTypes.bool,
    emphasize: PropTypes.bool,
    dividerMd: PropTypes.bool,
    dividerMobile: PropTypes.bool,
  };

  return (
    <div
      className={
        embedded ? "bg-white" : "h-full min-h-0 overflow-auto bg-slate-50 mt-2"
      }
    >
      {" "}
      <div className={embedded ? "p-3" : "p-6"}>
        {!embedded && (
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
                onClick={() => onOpenShare?.(task.id)}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
                title="Open read-only share view"
              >
                Share View 👁
              </button>
            )}
            {!embedded && (
              <button
                onClick={onEditDetails}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
                title="Edit title / due date / identifiers"
              >
                Edit Details ✏️
              </button>
            )}
          </div>
        )}

        {stats && (
          <div className="mt-2 rounded-md border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="px-3 py-3 bg-gray-200 flex items-center justify-between mb-2">
              <div className="text-[11px] md:text-sm text-slate-800">
                Quick snapshot
              </div>
              {task?.dueAt ? (
                <div
                  className={`text-[11px] font-medium ${
                    task.dueAt && new Date(task.dueAt) < new Date()
                      ? "text-rose-700"
                      : "text-slate-800"
                  }`}
                >
                  {task.dueAt && new Date(task.dueAt) < new Date()
                    ? "Overdue"
                    : "On track"}
                </div>
              ) : (
                <div className="text-[11px] md:text-sm text-slate-800">
                  No due date
                </div>
              )}
            </div>

            {/* 2x2 on mobile, 4x1 on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-4 text-center">
              <MiniSeg
                label="Total"
                value={`${stats.totalAging} d`}
                accent="bg-rose-400"
              />
              <MiniSeg
                label="In stage"
                value={`${stats.inStageDays} d`}
                accent="bg-sky-500"
                dividerMd
              />
              <MiniSeg
                label="Last Updated"
                value={
                  task.updatedAt
                    ? new Date(task.updatedAt).toLocaleDateString()
                    : "—"
                }
                accent="bg-slate-400"
                dividerMobile
              />
              <MiniSeg
                label="Due"
                value={
                  task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "—"
                }
                accent={
                  task.dueAt && new Date(task.dueAt) < new Date()
                    ? "bg-rose-500"
                    : "bg-amber-500"
                }
                dividerMd
                dividerMobile
                emphasize={task.dueAt && new Date(task.dueAt) < new Date()}
              />
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
          {!isArchived ? (
            <UpdateComposer
              currentStage={task?.currentStage}
              onAddUpdate={onAddUpdate}
              onNotify={onNotify}
            />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Archived (read-only)
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Restore this task to add updates or change stage.
              </div>
            </div>
          )}

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
    archivedAt: PropTypes.string,
    isArchived: PropTypes.bool,
    archived: PropTypes.bool,
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
  onNotify: PropTypes.func,
};
