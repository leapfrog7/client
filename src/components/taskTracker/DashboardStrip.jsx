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
  return "bg-slate-400";
}

function textFor(id) {
  if (id === "OVERDUE") return "text-rose-700";
  if (id === "DUE_SOON") return "text-amber-700";
  if (id === "PENDING") return "text-sky-700";
  return "text-slate-900";
}

function labelFor(id) {
  if (id === "ALL") return "All";
  if (id === "PENDING") return "Pending";
  if (id === "DUE_SOON") return "Due ≤3d";
  return "Overdue";
}

function subFor(id, metrics) {
  if (id === "ALL") return `No due: ${metrics.noDue}`;
  if (id === "PENDING") return "Needs action";
  if (id === "DUE_SOON") return "Today–3 days";
  return "Past due";
}

export default function DashboardStrip({ tasks, activeView, onSelectView }) {
  const metrics = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.currentStage === "Pending").length;

    const overdue = tasks.filter((t) => {
      const d = daysUntil(t.dueAt);
      return d !== null && d < 0;
    }).length;

    const dueSoon = tasks.filter((t) => {
      const d = daysUntil(t.dueAt);
      return d !== null && d >= 0 && d <= 3;
    }).length;

    const noDue = tasks.filter((t) => !t.dueAt).length;

    return { total, pending, overdue, dueSoon, noDue };
  }, [tasks]);

  const items = [
    { id: "ALL", value: metrics.total },
    { id: "PENDING", value: metrics.pending },
    { id: "DUE_SOON", value: metrics.dueSoon },
    { id: "OVERDUE", value: metrics.overdue },
  ];

  return (
    <div className="px-3 pt-2 pb-2 bg-slate-50">
      {/* Single segmented card */}
      <div className="rounded-md border border-slate-50 bg-white overflow-hidden shadow-sm">
        <div className="grid grid-cols-4">
          {items.map((it, idx) => {
            const active = activeView === it.id;

            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onSelectView(it.id)}
                className={`relative text-left px-2.5 py-2 transition active:scale-[0.99]
                  ${idx !== 0 ? "border-l border-slate-200" : ""}
                  ${active ? "bg-slate-50" : "bg-white hover:bg-slate-50"}
                `}
                title={labelFor(it.id)}
              >
                {/* Top accent */}
                <div
                  className={`absolute left-0 top-0 h-1 w-full ${accentFor(it.id)} ${
                    active ? "opacity-100" : "opacity-60"
                  }`}
                  aria-hidden="true"
                />

                <div className="pt-1">
                  <div className="text-[12px] leading-4 text-slate-500">
                    {labelFor(it.id)}
                  </div>

                  <div
                    className={`mt-0.5 text-base leading-5 font-semibold ${textFor(it.id)}`}
                  >
                    {it.value}
                  </div>

                  <div className="mt-0.5 text-[10px] leading-4 text-slate-500">
                    {subFor(it.id, metrics)}
                  </div>
                </div>

                {/* Active ring (subtle) */}
                {active ? (
                  <div
                    className="absolute inset-0 ring-2 ring-slate-200 pointer-events-none"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Compact footer row */}
        <div className="flex items-center justify-between px-3 py-2  bg-slate-50">
          <div className="text-[10px] text-slate-400 text-right">
            Tap to filter your list
          </div>
          {activeView !== "ALL" ? (
            <button
              type="button"
              onClick={() => onSelectView("ALL")}
              className="text-[11px] font-medium text-slate-700 hover:text-slate-900"
            >
              Reset
            </button>
          ) : (
            <span className="text-[11px] text-slate-400"> </span>
          )}
        </div>
      </div>
    </div>
  );
}

DashboardStrip.propTypes = {
  tasks: PropTypes.array.isRequired,
  activeView: PropTypes.oneOf(["ALL", "PENDING", "DUE_SOON", "OVERDUE"])
    .isRequired,
  onSelectView: PropTypes.func.isRequired,
};
