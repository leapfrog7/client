import { useEffect, useMemo, useState } from "react";
import {
  getTaskById,
  seedIfEmpty,
} from "../../../components/taskTracker/storage";
import Timeline from "../../../components/taskTracker/Timeline";
import { diffDays } from "../../../components/taskTracker/utils";

export default function TaskShareView() {
  const [task, setTask] = useState(null);

  const taskId = useMemo(() => {
    const parts = window.location.pathname.split("/");
    return parts[parts.length - 1]; // .../share/:taskId
  }, []);

  useEffect(() => {
    seedIfEmpty();
    setTask(getTaskById(taskId));
  }, [taskId]);

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="p-6 rounded-xl border border-slate-200 bg-white">
          <div className="text-base font-semibold text-slate-900">
            Task not found
          </div>
          <div className="mt-1 text-sm text-slate-600">
            This share view is Phase 0 (local). Phase 2 will support true share
            links.
          </div>
        </div>
      </div>
    );
  }

  const totalAging = diffDays(task.createdAt, new Date().toISOString());

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-slate-900">
                {task.title}
              </h1>
              <div className="mt-1 text-sm text-slate-600">
                <span className="font-medium">Current stage:</span>{" "}
                <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {task.currentStage}
                </span>
                <span className="ml-3 text-xs text-slate-500">
                  Aging: {totalAging}d
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {task.identifiers?.section
                  ? `${task.identifiers.section} · `
                  : ""}
                {task.identifiers?.fileNo
                  ? `File: ${task.identifiers.fileNo} · `
                  : ""}
                {task.identifiers?.receiptNo
                  ? `Receipt: ${task.identifiers.receiptNo}`
                  : ""}
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
              title="Print / Save as PDF"
            >
              Print
            </button>
          </div>
        </div>

        <div className="mt-4">
          <Timeline task={task} />
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Note: This is a Phase 0 local share view. In Phase 2, this becomes a
          token-based secure share link.
        </div>
      </div>
    </div>
  );
}
