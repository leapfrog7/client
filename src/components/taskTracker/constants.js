export const QUICK_STAGES = [
  "Pending",
  "Under submission",
  "To be discussed",
  "Sent to IFD",
  "Comments awaited",
  "Approved",
  "Draft Issued",
  "In Abeyance",
  "No Action needed",
  "Completed",
];

export const STAGE_STYLES = {
  Pending: {
    chip: "bg-amber-50 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  "Under submission": {
    chip: "bg-blue-50 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
  },
  "To be discussed": {
    chip: "bg-violet-50 text-violet-800 border-violet-200",
    dot: "bg-violet-500",
  },
  "Sent to IFD": {
    chip: "bg-indigo-50 text-indigo-800 border-indigo-200",
    dot: "bg-indigo-500",
  },
  "Comments awaited": {
    chip: "bg-cyan-50 text-cyan-800 border-cyan-200",
    dot: "bg-cyan-500",
  },
  Approved: {
    chip: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
  "Draft Issued": {
    chip: "bg-sky-50 text-sky-800 border-sky-200",
    dot: "bg-sky-500",
  },
  "In Abeyance": {
    chip: "bg-orange-50 text-orange-800 border-orange-200",
    dot: "bg-orange-500",
  },
  "No Action needed": {
    chip: "bg-slate-50 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
  Completed: {
    chip: "bg-green-50 text-green-800 border-green-200",
    dot: "bg-green-600",
  },
};

export function getStageStyle(stage) {
  return (
    STAGE_STYLES[stage] || {
      chip: "bg-slate-50 text-slate-700 border-slate-200",
      dot: "bg-slate-500",
    }
  );
}

export const STORAGE_KEYS = {
  TASKS: "tt_tasks_v1",
};
