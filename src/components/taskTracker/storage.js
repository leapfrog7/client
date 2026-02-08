// Phase 1: API-backed storage (MongoDB) using jwtToken
// Endpoints (mounted in app.js):
// GET    /api/v1/public/task-tracker
// POST   /api/v1/public/task-tracker
// GET    /api/v1/public/task-tracker/:id
// PATCH  /api/v1/public/task-tracker/:id
// POST   /api/v1/public/task-tracker/:id/events
// DELETE /api/v1/public/task-tracker/:id

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1"; // IMPORTANT: no trailing slash

const TASK_API = `${BASE_URL.replace(/\/$/, "")}/public/task-tracker`;
// auth required
const BASE_SHARE = `${BASE_URL}/public/task-tracker-share`; // no auth

export async function createShareLink(taskId) {
  return await http("POST", `${TASK_API}/${taskId}/share`);
}

export async function revokeShareLink(taskId) {
  return await http("DELETE", `${TASK_API}/${taskId}/share`);
}

// public fetch: NO auth header
export async function getSharedTask(token) {
  const res = await fetch(`${BASE_SHARE}/${token}`);
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    const msg = data?.msg || data?.message || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function getToken() {
  return localStorage.getItem("jwtToken");
}

function authHeaders() {
  const token = getToken();
  if (!token) throw new Error("Missing auth token (jwtToken). Please login.");
  return { Authorization: `Bearer ${token}` };
}

async function http(method, url, body) {
  const headers = {
    ...authHeaders(),
    ...(body ? { "Content-Type": "application/json" } : {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Always read raw text first (covers non-JSON too)
  const raw = await res.text();
  let data = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw; // non-JSON
    }
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.msg || data.message)) ||
      (typeof data === "string" ? data : null) ||
      `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  // If server responded OK but didn't send JSON, that's a bug for our API layer
  if (data === null || typeof data === "string") {
    throw new Error(
      `Expected JSON from API but received ${data === null ? "empty" : "non-JSON"} response. URL: ${url}`,
    );
  }

  return data;
}

// Phase 1: no client seeding
export function seedIfEmpty() {
  return;
}

// Normalize possible response shapes
function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.tasks)) return payload.tasks;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

function normalizeItem(payload) {
  // could be task directly or {task: {...}} or {data: {...}}
  if (!payload) return null;
  if (payload.id) return payload;
  if (payload.task && payload.task.id) return payload.task;
  if (payload.data && payload.data.id) return payload.data;
  return payload; // last resort
}

export async function getTasks({ archived = false } = {}) {
  const url = archived ? `${TASK_API}?archived=1` : TASK_API;
  const payload = await http("GET", url);
  return normalizeList(payload);
}

export async function archiveTask(taskId) {
  const payload = await http("PATCH", `${TASK_API}/${taskId}/archive`);
  return normalizeItem(payload);
}

export async function unarchiveTask(taskId) {
  const payload = await http("PATCH", `${TASK_API}/${taskId}/unarchive`);
  return normalizeItem(payload);
}

export async function getTaskById(taskId) {
  const payload = await http("GET", `${TASK_API}/${taskId}`);
  return normalizeItem(payload);
}

export async function createTask({ title, identifiers, dueAt, currentStage }) {
  const payload = await http("POST", TASK_API, {
    title,
    identifiers,
    dueAt: dueAt || null,
    currentStage: currentStage || "Pending",
  });
  return normalizeItem(payload);
}

export async function updateTaskBasics(taskId, patch) {
  const body = {
    ...(patch.title !== undefined ? { title: patch.title } : {}),
    ...(patch.identifiers !== undefined
      ? { identifiers: patch.identifiers }
      : {}),
    ...(patch.dueAt !== undefined ? { dueAt: patch.dueAt } : {}),
  };
  const payload = await http("PATCH", `${TASK_API}/${taskId}`, body);
  return normalizeItem(payload);
}

// Add milestone update (remark or stage_change)
export async function addTaskEvent(taskId, { kind, toStage, remark }) {
  const payload = await http("POST", `${TASK_API}/${taskId}/events`, {
    kind,
    toStage,
    remark,
  });
  return normalizeItem(payload);
}

export async function deleteTask(taskId) {
  return await http("DELETE", `${TASK_API}/${taskId}`);
}

/**
 * COMPAT EXPORT (temporary):
 * Some old file is still importing `updateTask` from storage.js.
 * This keeps HMR from crashing. Prefer migrating callers to:
 * - updateTaskBasics(...) or
 * - addTaskEvent(...)
 */
export async function updateTask(taskId, updaterFn) {
  const current = await getTaskById(taskId);
  const next = await Promise.resolve(updaterFn(current));

  // If updaterFn appended a last event, translate it into addTaskEvent
  const curEvents = Array.isArray(current?.events) ? current.events : [];
  const nextEvents = Array.isArray(next?.events) ? next.events : [];

  if (nextEvents.length > curEvents.length) {
    const last = nextEvents[nextEvents.length - 1];
    const kind = last?.type === "stage_change" ? "stage_change" : "remark";
    await addTaskEvent(taskId, {
      kind,
      toStage: kind === "stage_change" ? last?.toStage || null : null,
      remark: last?.remark || "",
    });
    return await getTaskById(taskId);
  }

  // Otherwise only patch basics if present
  const patch = {};
  if (next?.title !== undefined) patch.title = next.title;
  if (next?.identifiers !== undefined) patch.identifiers = next.identifiers;
  if (next?.dueAt !== undefined) patch.dueAt = next.dueAt;

  if (Object.keys(patch).length) {
    await updateTaskBasics(taskId, patch);
  }

  return await getTaskById(taskId);
}
