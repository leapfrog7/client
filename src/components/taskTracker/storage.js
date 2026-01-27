import { STORAGE_KEYS } from "./constants";
import { nowIso, uid } from "./utils";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function seedIfEmpty() {
  const existing = readJson(STORAGE_KEYS.TASKS, null);
  if (existing && Array.isArray(existing) && existing.length) return;

  const t1Id = uid();
  const createdAt = nowIso();

  const seeded = [
    {
      id: t1Id,
      title: "Draft note for approval – EPIL PMKVY RPL",
      identifiers: {
        receiptNo: "—",
        fileNo: "—",
        section: "CPSE-III",
      },
      currentStage: "Pending",
      dueAt: null, // ISO string or null
      createdAt,
      updatedAt: createdAt,
      events: [
        {
          id: uid(),
          type: "stage_change",
          fromStage: null,
          toStage: "Pending",
          remark: "Received from division; initial examination.",
          actor: "Self",
          at: createdAt,
        },
      ],
    },
  ];

  writeJson(STORAGE_KEYS.TASKS, seeded);
}

export function getTasks() {
  return readJson(STORAGE_KEYS.TASKS, []);
}

export function saveTasks(tasks) {
  writeJson(STORAGE_KEYS.TASKS, tasks);
}

export function upsertTask(task) {
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === task.id);
  if (idx >= 0) tasks[idx] = task;
  else tasks.unshift(task);
  saveTasks(tasks);
  return task;
}

export function createTask({ title, identifiers, dueAt }) {
  const createdAt = nowIso();
  const task = {
    id: uid(),
    title,
    identifiers: {
      receiptNo: identifiers?.receiptNo ?? "",
      fileNo: identifiers?.fileNo ?? "",
      section: identifiers?.section ?? "",
    },
    currentStage: "Pending",
    dueAt: dueAt || null, // ISO string or null
    createdAt,
    updatedAt: createdAt,
    events: [
      {
        id: uid(),
        type: "stage_change",
        fromStage: null,
        toStage: "Pending",
        remark: "Task created.",
        actor: "Self",
        at: createdAt,
      },
    ],
  };

  return upsertTask(task);
}

export function updateTaskBasics(taskId, patch) {
  return updateTask(taskId, (task) => {
    const at = nowIso();
    return {
      ...task,
      ...patch,
      identifiers: {
        ...(task.identifiers || {}),
        ...(patch.identifiers || {}),
      },
      updatedAt: at,
    };
  });
}

export function getTaskById(taskId) {
  const tasks = getTasks();
  return tasks.find((t) => t.id === taskId) || null;
}

export function updateTask(taskId, updaterFn) {
  const tasks = getTasks();
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx < 0) return null;

  const updated = updaterFn(tasks[idx]);
  tasks[idx] = updated;
  saveTasks(tasks);
  return updated;
}

export function deleteTask(taskId) {
  const tasks = getTasks().filter((t) => t.id !== taskId);
  saveTasks(tasks);
}
