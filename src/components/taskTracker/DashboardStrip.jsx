import { useMemo } from "react";
import PropTypes from "prop-types";

function daysUntil(dueAt) {
  if (!dueAt) return null;
  const now = new Date();
  const due = new Date(dueAt);
  const ms = due.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function accentFor(id) {
  if (id === "OVERDUE") return "bg-rose-500";
  if (id === "DUE_SOON") return "bg-amber-500";
  if (id === "PENDING") return "bg-sky-500";
  if (id === "TO_BE_DISCUSSED") return "bg-violet-500";
  if (id === "COMMENTS_AWAITED") return "bg-cyan-500";
  return "bg-slate-400";
}

function labelFor(id) {
  if (id === "ALL") return "All";
  if (id === "PENDING") return "Pending";
  if (id === "TO_BE_DISCUSSED") return "To be discussed";
  if (id === "COMMENTS_AWAITED") return "Comments awaited";
  if (id === "DUE_SOON") return "Due ≤3d";
  return "Overdue";
}

export default function DashboardStrip({ tasks, activeView, onSelectView }) {
  const metrics = useMemo(() => {
    const total = tasks.length;

    const pending = tasks.filter((t) => t.currentStage === "Pending").length;

    const toBeDiscussed = tasks.filter(
      (t) => t.currentStage === "To be discussed",
    ).length;

    const commentsAwaited = tasks.filter(
      (t) => t.currentStage === "Comments awaited",
    ).length;

    const overdue = tasks.filter((t) => {
      const d = daysUntil(t.dueAt);
      return d !== null && d < 0;
    }).length;

    const dueSoon = tasks.filter((t) => {
      const d = daysUntil(t.dueAt);
      return d !== null && d >= 0 && d <= 3;
    }).length;

    return {
      total,
      pending,
      toBeDiscussed,
      commentsAwaited,
      overdue,
      dueSoon,
    };
  }, [tasks]);

  const items = [
    { id: "ALL", value: metrics.total },
    { id: "PENDING", value: metrics.pending },
    { id: "TO_BE_DISCUSSED", value: metrics.toBeDiscussed },
    { id: "COMMENTS_AWAITED", value: metrics.commentsAwaited },
    { id: "DUE_SOON", value: metrics.dueSoon },
    { id: "OVERDUE", value: metrics.overdue },
  ];

  return (
    <>
      {/* ===== Mobile ===== */}
      <div className="lg:hidden px-3 pt-2 pb-2 bg-slate-50">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-medium text-slate-500">
            Filter tasks
          </div>

          {activeView !== "ALL" && (
            <button
              type="button"
              onClick={() => onSelectView("ALL")}
              className="text-[11px] font-medium text-slate-700"
            >
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {items.map((it) => {
            const active = activeView === it.id;

            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onSelectView(it.id)}
                className={`rounded-2xl border px-3 py-2.5 text-left transition
                  ${
                    active
                      ? "border-slate-300 bg-white shadow-sm"
                      : "border-slate-200 bg-white/80"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${accentFor(it.id)}`}
                    />
                    <span
                      className={`text-xs ${
                        active
                          ? "font-semibold text-slate-900"
                          : "text-slate-600"
                      }`}
                    >
                      {labelFor(it.id)}
                    </span>
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold
                      ${
                        active
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                  >
                    {it.value}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== Desktop ===== */}
      <div className="hidden lg:block border-b border-slate-200 bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-2 ">
          {items.map((it) => {
            const active = activeView === it.id;

            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onSelectView(it.id)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm
                  ${
                    active
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200"
                  }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    active ? "bg-white/90" : accentFor(it.id)
                  }`}
                />
                <span>{labelFor(it.id)}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full
                    ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                >
                  {it.value}
                </span>
              </button>
            );
          })}

          {activeView !== "ALL" && (
            <button
              type="button"
              onClick={() => onSelectView("ALL")}
              className="ml-1 text-xs text-slate-600 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </>
  );
}

DashboardStrip.propTypes = {
  tasks: PropTypes.array.isRequired,
  activeView: PropTypes.oneOf([
    "ALL",
    "PENDING",
    "TO_BE_DISCUSSED",
    "COMMENTS_AWAITED",
    "DUE_SOON",
    "OVERDUE",
  ]).isRequired,
  onSelectView: PropTypes.func.isRequired,
};
