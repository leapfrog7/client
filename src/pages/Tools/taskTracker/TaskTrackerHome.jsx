import { useEffect, useMemo, useState } from "react";
import TaskList from "../../../components/taskTracker/TaskList";
import TaskDetail from "../../../components/taskTracker/TaskDetail";
import {
  createTask,
  deleteTask,
  getTasks,
  seedIfEmpty,
  updateTask,
  updateTaskBasics,
} from "../../../components/taskTracker/storage";
import { nowIso, uid } from "../../../components/taskTracker/utils";
import TaskFormModal from "../../../components/taskTracker/TaskFormModal";
import DashboardStrip from "../../../components/taskTracker/DashboardStrip";
import MobileTaskAccordion from "../../../components/taskTracker/MobileTaskAccordion";
import PropTypes from "prop-types";

export default function TaskTrackerHome() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  // Form (create/edit)
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // create | edit
  const [formInitial, setFormInitial] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Dashboard filter
  const [activeView, setActiveView] = useState("ALL"); // ALL | PENDING | DUE_SOON | OVERDUE

  // Mobile accordion
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    seedIfEmpty();
    const t = getTasks();
    setTasks(t);
    if (t.length) setSelectedTaskId(t[0].id);
  }, []);

  function refresh() {
    const t = getTasks();
    setTasks(t);
  }

  function daysUntil(dueAt) {
    if (!dueAt) return null;
    const now = new Date();
    const due = new Date(dueAt);
    const ms = due.getTime() - now.getTime();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }

  function notify(message, type = "success") {
    setToast({ message, type });
    window.clearTimeout(notify._t);
    notify._t = window.setTimeout(() => setToast(null), 1600);
  }

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

    // keep desktop selection consistent
    setSelectedTaskId(taskId);
  }

  function handleEditDetails() {
    if (!selectedTaskId) return;
    openEditModalForTask(selectedTaskId);
  }

  function handleFormSubmit(values) {
    if (formMode === "create") {
      const task = createTask(values);
      refresh();
      setSelectedTaskId(task.id);
      setExpandedTaskId(task.id); // on mobile, open it right away
    } else {
      const targetId = editingTaskId || selectedTaskId;
      if (targetId) {
        updateTaskBasics(targetId, values);
        refresh();
      }
    }
    setFormOpen(false);
  }

  // ---------- Delete ----------
  function handleDelete(taskId) {
    const ok = confirm("Delete this task? This cannot be undone (Phase 0).");
    if (!ok) return;

    deleteTask(taskId);
    const t = getTasks();
    setTasks(t);

    if (selectedTaskId === taskId) setSelectedTaskId(t[0]?.id || null);
    if (expandedTaskId === taskId) setExpandedTaskId(null);
  }

  // ---------- Updates ----------
  function handleAddUpdateForTask(taskId, { kind, toStage, remark }) {
    if (!taskId) return;

    updateTask(taskId, (task) => {
      const at = nowIso();
      const lastStage = task.currentStage || null;
      const isStageChange = kind === "stage_change" && toStage;

      const event = {
        id: uid(),
        type: isStageChange ? "stage_change" : "remark",
        fromStage: isStageChange ? lastStage : null,
        toStage: isStageChange ? toStage : null,
        remark: remark || "",
        actor: "Self",
        at,
      };

      return {
        ...task,
        currentStage: isStageChange ? toStage : task.currentStage,
        updatedAt: at,
        events: [...(task.events || []), event],
      };
    });

    refresh();
  }

  function handleAddUpdate(payload) {
    if (!selectedTaskId) return;
    handleAddUpdateForTask(selectedTaskId, payload);
  }

  function EmptyState({ activeView, onReset, onCreate }) {
    const label =
      activeView === "PENDING"
        ? "Pending"
        : activeView === "DUE_SOON"
          ? "Due in 3 days"
          : activeView === "OVERDUE"
            ? "Overdue"
            : "All";

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
  };

  // ---------- Share ----------
  function openShareView() {
    if (!selectedTaskId) return;
    window.open(`/pages/tools/task-tracker/share/${selectedTaskId}`, "_blank");
  }

  return (
    <div className="h-[calc(100vh-0px)] w-full">
      {/* Desktop layout */}
      <div className="hidden lg:grid h-full grid-cols-[380px_1fr]">
        <TaskList
          tasks={visibleTasks}
          selectedTaskId={selectedTaskId}
          onSelect={setSelectedTaskId}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />

        <div className="h-full flex flex-col">
          <DashboardStrip
            tasks={tasks}
            activeView={activeView}
            onSelectView={(v) => setActiveView(v)}
          />

          <div className="flex-1 overflow-auto">
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

      {/* Mobile layout: Dashboard + Accordion list */}
      <div className="lg:hidden h-full flex flex-col bg-slate-50">
        <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={handleCreate}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm"
          >
            + Create New Task
          </button>
          {/* <div className="text-xs text-slate-500">Tap a task to expand</div> */}
        </div>

        <div className="text-center text-base font-semibold text-teal-700 p-2 bg-slate-200 mb-2">
          {" "}
          <p>Tasks Dashboard</p>
        </div>

        <DashboardStrip
          tasks={tasks}
          activeView={activeView}
          onSelectView={(v) => {
            setActiveView(v);
            setExpandedTaskId(null); // collapse on filter change (optional)
          }}
        />

        <div className="flex-1 overflow-auto mt-4">
          <div className="text-center text-base font-semibold text-blue-700 p-2 bg-slate-200 mb-2">
            {" "}
            <p>List of Tasks</p>
          </div>
          {visibleTasks.length === 0 ? (
            <EmptyState
              activeView={activeView}
              onReset={() => setActiveView("ALL")}
              onCreate={handleCreate}
            />
          ) : (
            <MobileTaskAccordion
              tasks={visibleTasks}
              expandedTaskId={expandedTaskId}
              onToggle={(id) => {
                setExpandedTaskId((prev) => (prev === id ? null : id));
                setSelectedTaskId(id);
              }}
              onAddUpdate={(payload) => {
                if (!expandedTaskId) return;
                handleAddUpdateForTask(expandedTaskId, payload);
              }}
              onEditDetails={(taskId) => openEditModalForTask(taskId)}
            />
          )}
        </div>
      </div>

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
