import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  getTokenTimeLeftMs,
  isTokenExpired,
} from "../../../components/taskTracker/storage";

import TaskFormModal from "../../../components/taskTracker/TaskFormModal";
import DashboardStrip from "../../../components/taskTracker/DashboardStrip";
import MobileTaskAccordion from "../../../components/taskTracker/MobileTaskAccordion";
import { exportTaskSummaryPdf } from "../../../components/taskTracker/exportTaskSummaryPdf";
// import TaskTrackerTutorial from "../../../components/taskTracker/TaskTrackerTutorial";
// import PageFeedback from "../../../components/PageFeedback";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { FaRegFilePdf } from "react-icons/fa";

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
  // const [tutorialOpen, setTutorialOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionTimeLeft, setSessionTimeLeft] = useState(null);
  const [sessionExpiringSoon, setSessionExpiringSoon] = useState(false);

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
  // const PAGE_SIZE = 10;
  // const [page, setPage] = useState(1);

  // Toast timer
  const toastTimerRef = useRef(null);

  const [authRequired, setAuthRequired] = useState(false);

  const title = "Task Manager / Task Tracker for Govt. Officers | Undersigned";
  const description =
    "Stage-wise task tracking for government office work: milestones, due alerts, aging counters, quick updates, and shareable read-only view. Built for eOffice-style workflows.";

  const canonical = `${window.location.origin}/pages/tools/task-tracker`;

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

  useEffect(() => {
    function syncSessionState() {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setSessionTimeLeft(null);
        setSessionExpiringSoon(false);
        setAuthRequired(true);
        return;
      }

      if (isTokenExpired()) {
        localStorage.removeItem("jwtToken");
        setSessionTimeLeft(0);
        setSessionExpiringSoon(false);
        setAuthRequired(true);
        notify("Your session has expired. Please login again.", "error");
        return;
      }

      const left = getTokenTimeLeftMs();
      setSessionTimeLeft(left);
      setSessionExpiringSoon(left > 0 && left <= 15 * 60 * 1000); // 15 min
    }

    syncSessionState();

    const interval = window.setInterval(syncSessionState, 30000);

    function handleVisibility() {
      if (!document.hidden) syncSessionState();
    }

    window.addEventListener("focus", syncSessionState);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", syncSessionState);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [notify]);

  async function refresh() {
    const t = await getTasks({ archived: showArchived });
    setTasks(Array.isArray(t) ? t : []);
  }

  async function toggleArchivedView() {
    const next = !showArchived;
    setShowArchived(next);
    setExpandedTaskId(null);
    setSelectedTaskId(null);
    // setPage(1);

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
    if (activeView === "TO_BE_DISCUSSED") {
      return tasks.filter((t) => t.currentStage === "To be discussed");
    }
    if (activeView === "COMMENTS_AWAITED") {
      return tasks.filter((t) => t.currentStage === "Comments awaited");
    }

    return tasks;
  }, [tasks, activeView]);

  // const totalPages = Math.max(1, Math.ceil(visibleTasks.length / PAGE_SIZE));
  // const safePage = Math.min(page, totalPages);
  // const pageStart = (safePage - 1) * PAGE_SIZE;
  // const pageTasks = visibleTasks.slice(pageStart, pageStart + PAGE_SIZE);

  // useEffect(() => {
  //   // If list shrinks (delete/filter), keep page in range
  //   setPage((p) =>
  //     Math.min(p, Math.max(1, Math.ceil(visibleTasks.length / PAGE_SIZE))),
  //   );
  //   // Also collapse any expanded accordion because it may not exist on new page
  //   setExpandedTaskId(null);
  // }, [activeView, visibleTasks.length]);

  useEffect(() => {
    setExpandedTaskId(null);
  }, [activeView, visibleTasks.length, showArchived]);

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
      const t = await getTasks({ archived: showArchived });
      setTasks(Array.isArray(t) ? t : []);

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
        : activeView === "TO_BE_DISCUSSED"
          ? "To be discussed"
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
    activeView: PropTypes.oneOf([
      "ALL",
      "PENDING",
      "TO_BE_DISCUSSED",
      "DUE_SOON",
      "OVERDUE",
    ]).isRequired,
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
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />

        {/* Indexing */}
        <meta name="robots" content="index,follow,max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Undersigned" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />

        {/* Optional: add a real image URL if you have one */}
        {/* <meta property="og:image" content={`${window.location.origin}/og/task-tracker.png`} /> */}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {/* Optional: add same image for Twitter */}
        {/* <meta name="twitter:image" content={`${window.location.origin}/og/task-tracker.png`} /> */}
      </Helmet>

      {/* CTA header (does not consume scroll space) */}
      <div className="shrink-0 bg-white p-4 shadow-sm text-center mx-auto w-full">
        {sessionExpiringSoon && sessionTimeLeft !== null && (
          <div className="mt-2 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800">
            Session expires soon
          </div>
        )}
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
                onClick={() =>
                  navigate("/login", { state: { from: location.pathname } })
                }
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
            <div
              className="hidden lg:grid h-full min-h-0
  grid-cols-[minmax(420px,520px)_minmax(0,1fr)]
  2xl:grid-cols-[minmax(460px,620px)_minmax(0,1fr)]
"
            >
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
                {/* <div>
                  <button
                    type="button"
                    onClick={() => setTutorialOpen(true)}
                    className="mx-auto flex w-1/3 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 shadow-sm transition
             hover:bg-blue-700 hover:text-white hover:border-blue-700
             focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    <span aria-hidden="true">📘</span>
                    Learn how to use
                  </button>
                </div> */}
              </div>
            </div>

            {/* Mobile */}
            {/* Mobile */}
            <div className="lg:hidden h-full min-h-0 flex flex-col bg-slate-50 overflow-hidden">
              {/* Keep Create button fixed (recommended) */}

              {/* ✅ Single scroll container: Dashboard + List + Pagination */}
              <div className="flex-1 min-h-0 overflow-auto bg-slate-50">
                <DashboardStrip
                  tasks={tasks}
                  activeView={activeView}
                  onSelectView={(v) => {
                    setActiveView(v);
                    setExpandedTaskId(null);
                  }}
                />

                {/* Mobile action panel */}
                <div className="px-3 pt-2">
                  <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
                    <div className="p-3 space-y-2.5">
                      <button
                        type="button"
                        onClick={handleCreate}
                        className="
      w-full rounded-xl bg-slate-900 px-4 py-3
      text-sm font-semibold text-white shadow-sm
      transition hover:bg-slate-800 active:scale-[0.99]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
    "
                      >
                        + Create New Task
                      </button>

                      <button
                        type="button"
                        onClick={toggleArchivedView}
                        className={`w-full rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition active:scale-[0.99]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
      ${
        showArchived
          ? "border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
                        title={
                          showArchived
                            ? "Back to active tasks"
                            : "View archived tasks"
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-2">
                          <span>{showArchived ? "📌" : "📦"}</span>
                          <span>
                            {showArchived ? "Back to Active" : "See Archive"}
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => exportTaskSummaryPdf(tasks)}
                        className="
      w-full rounded-xl border border-slate-200 bg-white px-4 py-3
      text-sm font-medium text-slate-700 shadow-sm
      transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300
    "
                        title="Download task summary PDF"
                      >
                        <span className="inline-flex items-center justify-center gap-2">
                          <FaRegFilePdf className="text-base text-rose-600" />
                          <span>Download Summary PDF</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-3">
                  {visibleTasks.length === 0 ? (
                    <EmptyState
                      activeView={activeView}
                      onReset={() => setActiveView("ALL")}
                      onCreate={handleCreate}
                      showArchived={showArchived}
                      onBack={() => toggleArchivedView()}
                    />
                  ) : (
                    <MobileTaskAccordion
                      tasks={visibleTasks}
                      expandedTaskId={expandedTaskId}
                      onToggle={(id) => {
                        setExpandedTaskId((prev) => (prev === id ? null : id));
                        setSelectedTaskId(id);
                      }}
                      onAddUpdate={(taskId, payload) => {
                        handleAddUpdateForTask(taskId, payload);
                      }}
                      onEditDetails={(taskId) => openEditModalForTask(taskId)}
                      onDelete={handleDelete}
                      onOpenShare={(taskId) => openShareView(taskId)}
                      onNotify={notify}
                      onArchive={showArchived ? handleUnarchive : handleArchive}
                      archiveLabel={showArchived ? "Restore" : "Archive"}
                      isArchivedView={showArchived}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* <TaskTrackerTutorial
        open={tutorialOpen}
        onClose={() => setTutorialOpen(false)}
      /> */}
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
