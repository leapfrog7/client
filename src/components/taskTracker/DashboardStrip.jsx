import { useMemo } from "react";
import PropTypes from "prop-types";

function daysUntil(dueAt) {
  if (!dueAt) return null;
  const now = new Date();
  const due = new Date(dueAt);
  // end-of-day already stored; compute whole days remaining
  const ms = due.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
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

  const Tile = ({ id, label, value, hint, tone }) => {
    const active = activeView === id;
    const base =
      "rounded-xl border p-3 bg-white hover:border-slate-300 cursor-pointer transition";
    const ring = active
      ? "ring-2 ring-slate-300 border-slate-300"
      : "border-slate-200";
    const toneCls =
      tone === "danger"
        ? "text-rose-700"
        : tone === "warning"
          ? "text-amber-700"
          : "text-slate-900";

    return (
      <div className={`${base} ${ring}`} onClick={() => onSelectView(id)}>
        <div className="text-xs text-slate-500">{label}</div>
        <div className={`mt-1 text-xl font-semibold ${toneCls}`}>{value}</div>
        {hint ? (
          <div className="mt-1 text-[11px] text-slate-500">{hint}</div>
        ) : null}
      </div>
    );
  };

  Tile.propTypes = {
    id: PropTypes.oneOf(["ALL", "PENDING", "DUE_SOON", "OVERDUE"]).isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    hint: PropTypes.string,
    tone: PropTypes.oneOf(["normal", "warning", "danger"]),
  };

  return (
    <div className="p-3 border-b border-slate-200 bg-slate-50">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile
          id="ALL"
          label="All tasks"
          value={metrics.total}
          hint={`No due date: ${metrics.noDue}`}
        />
        <Tile
          id="PENDING"
          label="Pending"
          value={metrics.pending}
          tone="warning"
          hint="Click to filter list"
        />
        <Tile
          id="DUE_SOON"
          label="Due in 3 days"
          value={metrics.dueSoon}
          tone="warning"
          hint="Today–3 days"
        />
        <Tile
          id="OVERDUE"
          label="Overdue"
          value={metrics.overdue}
          tone="danger"
          hint="Past due date"
        />
      </div>

      <div className="mt-2 text-[11px] text-slate-500">
        Tip: Tap a tile to focus your task list.
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
