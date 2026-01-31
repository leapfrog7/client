import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedTask } from "../../../components/taskTracker/storage";
import Timeline from "../../../components/taskTracker/Timeline";
import { getStageStyle } from "../../../components/taskTracker/constants";

export default function ShareTaskView() {
  const { token } = useParams();
  const [task, setTask] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const t = await getSharedTask(token);
        if (alive) setTask(t);
      } catch (e) {
        if (alive) setErr(e.message || "Could not load shared task");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm text-slate-600">Loading…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">
            Share link not available
          </div>
          <div className="mt-1 text-sm text-slate-600">{err}</div>
          <div className="mt-3 text-xs text-slate-500">
            Ask the owner to generate a fresh link.
          </div>
        </div>
      </div>
    );
  }

  const s = getStageStyle(task.currentStage);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs text-slate-500">Read-only share view</div>

          <div className="mt-1 text-lg font-semibold text-slate-900 break-words">
            {task.title}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${s.chip}`}>
              {task.currentStage || "—"}
            </span>

            <span className="text-xs text-slate-500">
              Last updated:{" "}
              {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "—"}
            </span>

            {task.dueAt ? (
              <span className="text-xs text-slate-500">
                Due: {new Date(task.dueAt).toLocaleDateString()}
              </span>
            ) : null}
          </div>

          {task.shareExpiresAt ? (
            <div className="mt-3 text-xs text-amber-700">
              Link expires on:{" "}
              <span className="font-medium">
                {new Date(task.shareExpiresAt).toLocaleString()}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <Timeline task={task} />
        </div>
      </div>
    </div>
  );
}
