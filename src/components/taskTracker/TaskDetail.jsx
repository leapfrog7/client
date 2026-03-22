// TaskDetail.jsx (FIXED hook order + tabs actually matter)
import { useEffect, useMemo, useState } from "react";
import { diffDays, deriveLastStageEvent, safeTrim } from "./utils";
import Timeline from "./Timeline";
import { getStageStyle } from "./constants";
import UpdateComposer from "./UpdateComposer";
import PropTypes from "prop-types";

function daysUntil(dueAt) {
  if (!dueAt) return null;
  const now = new Date();
  const due = new Date(dueAt);
  const ms = due.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function dueLabel(d) {
  if (d === null) return "No due date";
  if (d < 0) return `Overdue +${Math.abs(d)}d`;
  if (d === 0) return "Due today";
  if (d <= 3) return `Due in ${d}d`;
  return `Due in ${d}d`;
}

function dueTone(d) {
  if (d === null) return "text-slate-700 bg-slate-100 border-slate-200 ";
  if (d < 0) return "text-rose-800 bg-rose-50 border-rose-200 ";
  if (d <= 3) return "text-amber-800 bg-amber-50 border-amber-200 ";
  return "text-slate-700 bg-slate-100 border-slate-200 ";
}

export default function TaskDetail({
  task,
  onAddUpdate,
  onOpenShare,
  onEditDetails,
  onNotify,
  embedded = false,
}) {
  const [tab, setTab] = useState("UPDATES"); // UPDATES | HISTORY

  const stats = useMemo(() => {
    if (!task) return null;
    const now = new Date().toISOString();
    const totalAging = diffDays(task.createdAt, now);

    const lastStageEvt = deriveLastStageEvent(task.events);
    const stageSince = lastStageEvt?.at || task.createdAt;
    const inStageDays = diffDays(stageSince, now);

    return { totalAging, inStageDays };
  }, [task]);

  // ✅ Correct hook usage: reset desktop tab when task changes
  useEffect(() => {
    if (!embedded) setTab("UPDATES");
  }, [task?.id, embedded]);

  if (!task) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-base font-semibold text-slate-700">
            Select a task
          </div>
          <div className="mt-1 text-sm text-slate-700">
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

  const d = task.dueAt ? daysUntil(task.dueAt) : null;
  const dueText = dueLabel(d);
  const dueCls = dueTone(d);

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
    emphasize: PropTypes.bool,
    dividerMd: PropTypes.bool,
    dividerMobile: PropTypes.bool,
  };

  // Desktop-only: calmer strip
  function DesktopStatusStrip() {
    return (
      <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border ${s.chip}`}
            title="Current stage"
          >
            {task.currentStage || "—"}
          </span>

          <span
            className={`text-xs px-2 py-1 rounded-full border ${dueCls}`}
            title={task.dueAt ? new Date(task.dueAt).toLocaleDateString() : ""}
          >
            {dueText}
          </span>

          <span className="text-xs text-slate-700">
            Total:{" "}
            <span className="font-semibold text-slate-700">
              {stats?.totalAging ?? "—"}d
            </span>
          </span>

          <span className="text-xs  text-slate-700">
            In stage:{" "}
            <span className="font-semibold text-slate-700">
              {stats?.inStageDays ?? "—"}d
            </span>
          </span>

          <span className="text-xs text-slate-700">
            Last updated:{" "}
            <span className="font-medium text-slate-700">
              {task.updatedAt
                ? new Date(task.updatedAt).toLocaleDateString()
                : "—"}
            </span>
          </span>
        </div>
      </div>
    );
  }

  function DesktopTabs() {
    return (
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab("UPDATES")}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            tab === "UPDATES"
              ? "bg-black text-white border-black"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }`}
        >
          Updates
        </button>
        <button
          type="button"
          onClick={() => setTab("HISTORY")}
          className={`px-3 py-1.5 rounded-full text-sm border transition ${
            tab === "HISTORY"
              ? "bg-black text-white border-black"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
          }`}
        >
          History
        </button>

        {isArchived ? (
          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Archived (read-only)
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={
        embedded ? "bg-white" : "h-full min-h-0 overflow-auto bg-slate-50 mt-2"
      }
    >
      <div className={embedded ? "p-3" : "p-6"}>
        {/* ===== Desktop header ===== */}
        {!embedded && (
          <div className="flex items-start justify-between gap-3 mt-2">
            <div className="min-w-0">
              <h1 className="text-sm lg:text-lg font-semibold text-slate-700 md:text-slate-700 truncate">
                {title}
              </h1>

              <div className="mt-2 text-xs text-slate-700">
                {id.section ? `${id.section} · ` : ""}
                {id.fileNo ? `eFile No: ${id.fileNo} · ` : ""}
                {id.receiptNo ? `Receipt: ${id.receiptNo}` : ""}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenShare?.(task.id)}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
                title="Open read-only share view"
              >
                Share 🔗
              </button>

              <button
                type="button"
                onClick={onEditDetails}
                className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
                title="Edit title / due date / identifiers"
              >
                Edit ✏️
              </button>
            </div>
          </div>
        )}

        {/* Desktop strip */}
        {!embedded && stats ? <DesktopStatusStrip /> : null}

        {/* Mobile/embedded snapshot (unchanged behavior) */}
        {embedded && stats && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Total age */}
              <span className="text-[11px] px-2 py-1 rounded-full bg-slate-50  text-slate-700 border border-slate-200">
                Total:{" "}
                <span className=" lg:font-semibold">{stats.totalAging}d</span>
              </span>

              {/* In-stage */}
              <span className="text-[11px]  px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                In stage:{" "}
                <span className=" lg:font-semibold">{stats.inStageDays}d</span>
              </span>

              {/* Updated */}
              <span className="text-[11px]  px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                Updated:{" "}
                <span className=" lg:font-semibold">
                  {task.updatedAt
                    ? new Date(task.updatedAt).toLocaleDateString()
                    : "—"}
                </span>
              </span>

              {/* Due (only if present) */}
              {task?.dueAt ? (
                <span
                  className={`text-[11px]  px-2 py-1 rounded-full border ${
                    new Date(task.dueAt) < new Date()
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                  title={new Date(task.dueAt).toLocaleDateString()}
                >
                  {new Date(task.dueAt) < new Date() ? "Overdue" : "Due"}:{" "}
                  <span className="">
                    {new Date(task.dueAt).toLocaleDateString()}
                  </span>
                </span>
              ) : (
                <span className="text-[11px]  px-2 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                  Due: <span className=" lg:font-semibold">Not Set</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Desktop tabs */}
        {!embedded ? <DesktopTabs /> : null}

        {/* ===== Content ===== */}
        {embedded ? (
          // Embedded/mobile: keep your original behavior (2-col on xl)
          <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {!isArchived ? (
              <UpdateComposer
                currentStage={task?.currentStage}
                onAddUpdate={onAddUpdate}
                onNotify={onNotify}
              />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-700">
                  Archived (read-only)
                </div>
                <div className="mt-1 text-sm text-slate-700">
                  Restore this task to add updates or change stage.
                </div>
              </div>
            )}
            <Timeline task={task} />
          </div>
        ) : (
          // Desktop: tabs actually change the layout
          <div className="mt-4">
            {tab === "UPDATES" ? (
              <div className="space-y-4 min-w-0">
                {!isArchived ? (
                  <UpdateComposer
                    currentStage={task?.currentStage}
                    onAddUpdate={onAddUpdate}
                    onNotify={onNotify}
                  />
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-700">
                      Archived (read-only)
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      Restore this task to add updates or change stage.
                    </div>
                  </div>
                )}

                {/* Recent milestones below (not side-by-side) */}
                <Timeline task={task} defaultLimit={3} />
              </div>
            ) : (
              <div className="space-y-4">
                <Timeline task={task} defaultLimit={10} />
              </div>
            )}
          </div>
        )}
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
    dueAt: PropTypes.string,
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
  onAddUpdate: PropTypes.func.isRequired,
  onOpenShare: PropTypes.func.isRequired,
  onEditDetails: PropTypes.func.isRequired,
  embedded: PropTypes.bool,
  onNotify: PropTypes.func,
};
