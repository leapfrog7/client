import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TaskList from "../../../components/taskTracker/TaskList";
import TaskDetail from "../../../components/taskTracker/TaskDetail";
import {
  createTask,
  deleteTask,
  getTasks,
  seedIfEmpty,
  updateTaskBasics,
  addTaskEvent,
  createShareLink,
  archiveTask, // ✅ add
  unarchiveTask, // ✅ add
} from "../../../components/taskTracker/storage";

import TaskFormModal from "../../../components/taskTracker/TaskFormModal";
import DashboardStrip from "../../../components/taskTracker/DashboardStrip";
import MobileTaskAccordion from "../../../components/taskTracker/MobileTaskAccordion";
// import PageFeedback from "../../../components/PageFeedback";
import PropTypes from "prop-types";

function daysUntil(dueAt) {
  if (!dueAt) return null;
  const now = new Date();
  const due = new Date(dueAt);
  const ms = due.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function TaskTrackerHome() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }
  const [showArchived, setShowArchived] = useState(false);

  // Form (create/edit)
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit
  const [formInitial, setFormInitial] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Dashboard filter
  const [activeView, setActiveView] = useState("ALL"); // ALL | PENDING | DUE_SOON | OVERDUE

  // Mobile accordion
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  // Mobile pagination
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  // Toast timer
  const toastTimerRef = useRef(null);

  const [authRequired, setAuthRequired] = useState(false);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 1600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  async function refresh() {
    const t = await getTasks({ archived: showArchived });
    setTasks(Array.isArray(t) ? t : []);
  }

  async function toggleArchivedView() {
    const next = !showArchived;
    setShowArchived(next);
    setExpandedTaskId(null);
    setSelectedTaskId(null);
    setPage(1);

    const t = await getTasks({ archived: next });
    setTasks(Array.isArray(t) ? t : []);
    if (t?.length) setSelectedTaskId(t[0].id);
  }

  async function handleArchive(taskId) {
    const ok = confirm(
      "Archive this task? You can restore it later from Archived.",
    );
    if (!ok) return;

    try {
      await archiveTask(taskId);

      // If viewing active tasks -> remove it from list immediately
      if (!showArchived) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        // if already in archived view, just refresh/replace in-place
        await refresh();
      }

      if (selectedTaskId === taskId) setSelectedTaskId(null);
      if (expandedTaskId === taskId) setExpandedTaskId(null);

      notify("Task archived", "success");
    } catch (e) {
      notify(e.message || "Could not archive task", "error");
    }
  }

  async function handleUnarchive(taskId) {
    try {
      await unarchiveTask(taskId);

      // If viewing archived tasks -> remove it from archived list immediately
      if (showArchived) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } else {
        await refresh();
      }

      notify("Task restored", "success");
    } catch (e) {
      notify(e.message || "Could not restore task", "error");
    }
  }

  useEffect(() => {
    seedIfEmpty(); // noop in Phase 1

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setAuthRequired(true);
      setTasks([]); // keep it an array
      setSelectedTaskId(null);
      return;
    }

    (async () => {
      try {
        const t = await getTasks();
        setTasks(Array.isArray(t) ? t : []);
        setAuthRequired(false);
        if (t?.length) setSelectedTaskId(t[0].id);
      } catch (e) {
        // If API says auth invalid/expired, show login screen
        const msg = String(e?.message || "");
        if (
          msg.toLowerCase().includes("auth") ||
          msg.toLowerCase().includes("token") ||
          msg.toLowerCase().includes("login")
        ) {
          setAuthRequired(true);
          setTasks([]);
          setSelectedTaskId(null);
          return;
        }
        notify(msg || "Could not load tasks", "error");
      }
    })();
  }, []);

  const visibleTasks = useMemo(() => {
    if (activeView === "ALL") return tasks;

    if (activeView === "PENDING") {
      return tasks.filter((t) => t.currentStage === "Pending");
    }

    if (activeView === "DUE_SOON") {
      return tasks.filter((t) => {
        const d = daysUntil(t.dueAt);
        return d !== null && d >= 0 && d <= 3;
      });
    }

    if (activeView === "OVERDUE") {
      return tasks.filter((t) => {
        const d = daysUntil(t.dueAt);
        return d !== null && d < 0;
      });
    }

    return tasks;
  }, [tasks, activeView]);

  const totalPages = Math.max(1, Math.ceil(visibleTasks.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageTasks = visibleTasks.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    // If list shrinks (delete/filter), keep page in range
    setPage((p) =>
      Math.min(p, Math.max(1, Math.ceil(visibleTasks.length / PAGE_SIZE))),
    );
    // Also collapse any expanded accordion because it may not exist on new page
    setExpandedTaskId(null);
  }, [activeView, visibleTasks.length]);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId],
  );

  // ---------- Create / Edit ----------
  function handleCreate() {
    setFormMode("create");
    setFormInitial(null);
    setEditingTaskId(null);
    setFormOpen(true);
  }

  function openEditModalForTask(taskId) {
    const t = tasks.find((x) => x.id === taskId);
    if (!t) return;

    setFormMode("edit");
    setFormInitial(t);
    setEditingTaskId(taskId);
    setFormOpen(true);

    setSelectedTaskId(taskId);
  }

  function handleEditDetails() {
    if (!selectedTaskId) return;
    openEditModalForTask(selectedTaskId);
  }

  async function handleFormSubmit(values) {
    try {
      if (formMode === "create") {
        const task = await createTask(values);
        await refresh();
        setSelectedTaskId(task.id);
        setExpandedTaskId(task.id);
      } else {
        const targetId = editingTaskId || selectedTaskId;
        if (targetId) {
          const updatedTask = await updateTaskBasics(targetId, values);
          // ✅ keep task in same position (no refresh)
          setTasks((prev) =>
            prev.map((t) => (t.id === targetId ? updatedTask : t)),
          );
        }
      }
      setFormOpen(false);
    } catch (e) {
      notify(e.message || "Could not save task", "error");
    }
  }

  // ---------- Delete ----------
  async function handleDelete(taskId) {
    const ok = confirm("Delete this task? This cannot be undone.");
    if (!ok) return;

    try {
      await deleteTask(taskId);
      const t = await getTasks();
      setTasks(t);

      if (selectedTaskId === taskId) setSelectedTaskId(t[0]?.id || null);
      if (expandedTaskId === taskId) setExpandedTaskId(null);
    } catch (e) {
      notify(e.message || "Could not delete task", "error");
    }
  }

  // ---------- Updates ----------
  async function handleAddUpdateForTask(taskId, payload) {
    if (!taskId) return;
    try {
      const updatedTask = await addTaskEvent(taskId, payload);
      //await refresh();
      // ✅ replace item in-place (order preserved)
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (e) {
      notify(e.message || "Could not add update", "error");
    }
  }

  async function handleAddUpdate(payload) {
    if (!selectedTaskId) return;
    await handleAddUpdateForTask(selectedTaskId, payload);
  }

  function EmptyState({ activeView, onReset, onCreate, showArchived, onBack }) {
    const label =
      activeView === "PENDING"
        ? "Pending"
        : activeView === "DUE_SOON"
          ? "Due in 3 days"
          : activeView === "OVERDUE"
            ? "Overdue"
            : "All";

    if (showArchived) {
      return (
        <div className="p-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-900">
              No archived tasks
            </div>
            <div className="mt-1 text-sm text-slate-600">
              You haven’t archived any tasks yet. Archive a task to see it here.
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={onBack}
                className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
                type="button"
              >
                Back to Active
              </button>
            </div>
          </div>
        </div>
      );
    }

    // existing active-tasks empty state
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-sm font-semibold text-slate-900">
            No tasks found
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Nothing matches the current view:{" "}
            <span className="font-medium">{label}</span>.
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={onReset}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
              type="button"
            >
              Reset filter
            </button>
            <button
              onClick={onCreate}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
              type="button"
            >
              + New task
            </button>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Tip: Check “All tasks” if you recently changed filters.
          </div>
        </div>
      </div>
    );
  }

  EmptyState.propTypes = {
    activeView: PropTypes.oneOf(["ALL", "PENDING", "DUE_SOON", "OVERDUE"])
      .isRequired,
    onReset: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    showArchived: PropTypes.bool,
    onBack: PropTypes.func,
  };

  // ---------- Share ----------
  async function openShareView(taskId = selectedTaskId) {
    if (!taskId) return;

    try {
      const { token, ttlDays } = await createShareLink(taskId);

      const shareUrl = `${window.location.origin}/pages/tools/task-tracker/share/${token}`;
      const title = "Task Tracker link";
      const text = `Here’s the task link (valid ${ttlDays} days):`;

      // ✅ Native share on mobile (WhatsApp/Gmail/etc.)
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        notify("Shared successfully", "success");
        return;
      }

      // ✅ Desktop fallback: copy link
      await navigator.clipboard.writeText(shareUrl);
      notify("Share link copied", "success");
    } catch (e) {
      notify(e.message || "Could not create share link", "error");
    }
  }

  return (
    <div
      className="w-full min-h-0 overflow-hidden flex flex-col mb-8"
      style={{ height: "calc(100dvh)" }} // keep your number, layout now won’t clip
    >
      {/* CTA header (does not consume scroll space) */}
      <div className="shrink-0 bg-white p-4 shadow-sm text-center mx-auto w-full">
        <div className="text-lg md:text-2xl font-extrabold tracking-wider text-gray-600">
          TASK MANAGER
        </div>

        <p className="mt-1 text-sm md:text-base leading-5 text-slate-600">
          Built for Govt. Officers —{" "}
          <span className="font-medium text-sky-700">
            stage-wise milestones
          </span>
          , <span className="font-medium text-teal-800">time counters</span>,{" "}
          <span className="font-medium text-amber-700">due alerts</span>, and{" "}
          <span className="font-medium text-emerald-700">quick updates</span>.
        </p>
      </div>

      {/* MAIN TRACKER AREA (this is the only "full height" region) */}
      {authRequired ? (
        <div className="p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-base font-semibold text-slate-900">
              Log in to get started
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Task Tracker saves your work securely to your account.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
              >
                Go to Login Page
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = "/register")}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:border-slate-300"
              >
                Register - it is free
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 overflow-hidden">
            {/* Desktop */}
            <div className="hidden lg:grid h-full min-h-0 grid-cols-[380px_minmax(0,1fr)] overflow-hidden">
              <div className="h-full min-h-0 overflow-hidden">
                <TaskList
                  tasks={visibleTasks}
                  selectedTaskId={selectedTaskId}
                  onSelect={setSelectedTaskId}
                  onCreate={handleCreate}
                  onDelete={handleDelete}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                  showArchived={showArchived}
                  onToggleArchived={toggleArchivedView}
                />
              </div>

              <div className="h-full min-h-0 flex flex-col overflow-hidden">
                <div className="shrink-0">
                  <DashboardStrip
                    tasks={tasks}
                    activeView={activeView}
                    onSelectView={setActiveView}
                  />
                </div>

                <div className="flex-1 min-h-0 overflow-auto">
                  <TaskDetail
                    task={selectedTask}
                    onAddUpdate={handleAddUpdate}
                    onOpenShare={openShareView}
                    onEditDetails={handleEditDetails}
                    onNotify={notify}
                  />
                </div>
              </div>
            </div>

            {/* Mobile */}
            {/* Mobile */}
            <div className="lg:hidden h-full min-h-0 flex flex-col bg-slate-50 overflow-hidden">
              {/* Keep Create button fixed (recommended) */}

              {/* ✅ Single scroll container: Dashboard + List + Pagination */}
              <div className="flex-1 min-h-0 overflow-auto">
                <DashboardStrip
                  tasks={tasks}
                  activeView={activeView}
                  onSelectView={(v) => {
                    setActiveView(v);
                    setExpandedTaskId(null);
                    setPage(1);
                  }}
                />
                <div className="mr-2 my-1 shrink-0 px-2 flex gap-3 bg-slate-50">
                  <button
                    onClick={handleCreate}
                    className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm"
                  >
                    + Create New Task
                  </button>
                  <button
                    type="button"
                    onClick={toggleArchivedView}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      showArchived
                        ? "bg-teal-100 text-gray-600 border-teal-700"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                    title={
                      showArchived
                        ? "Back to active tasks"
                        : "View archived tasks"
                    }
                  >
                    {showArchived ? "Back to Active 📌" : "See Archive 📦"}
                  </button>
                </div>
                <div className="px-3 py-3">
                  {visibleTasks.length === 0 ? (
                    <EmptyState
                      activeView={activeView}
                      onReset={() => setActiveView("ALL")}
                      onCreate={handleCreate}
                    />
                  ) : (
                    <>
                      <MobileTaskAccordion
                        tasks={pageTasks}
                        expandedTaskId={expandedTaskId}
                        onToggle={(id) => {
                          setExpandedTaskId((prev) =>
                            prev === id ? null : id,
                          );
                          setSelectedTaskId(id);
                        }}
                        onAddUpdate={(taskId, payload) => {
                          handleAddUpdateForTask(taskId, payload);
                        }}
                        onEditDetails={(taskId) => openEditModalForTask(taskId)}
                        onDelete={handleDelete}
                        onOpenShare={(taskId) => openShareView(taskId)}
                        onNotify={notify}
                        onArchive={
                          showArchived ? handleUnarchive : handleArchive
                        }
                        archiveLabel={showArchived ? "Restore" : "Archive"}
                        isArchivedView={showArchived} // ✅ ADD THIS
                      />

                      {/* Pagination controls */}
                      {totalPages > 1 && (
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            disabled={safePage <= 1}
                            onClick={() => {
                              setExpandedTaskId(null);
                              setPage((p) => Math.max(1, p - 1));
                            }}
                            className={`px-3 py-2 rounded-lg border text-sm ${
                              safePage <= 1
                                ? "border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            ← Prev
                          </button>

                          <div className="text-xs text-slate-600">
                            Page{" "}
                            <span className="font-semibold">{safePage}</span> of{" "}
                            <span className="font-semibold">{totalPages}</span>
                          </div>

                          <button
                            type="button"
                            disabled={safePage >= totalPages}
                            onClick={() => {
                              setExpandedTaskId(null);
                              setPage((p) => Math.min(totalPages, p + 1));
                            }}
                            className={`px-3 py-2 rounded-lg border text-sm ${
                              safePage >= totalPages
                                ? "border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            Next →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
          <div
            className={`px-4 py-2 rounded-xl shadow-lg border text-sm flex items-center gap-2
              ${
                toast.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
          >
            <span className="text-base">
              {toast.type === "success" ? "✅" : "⚠️"}
            </span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <TaskFormModal
        open={formOpen}
        mode={formMode}
        initialValues={formInitial}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
