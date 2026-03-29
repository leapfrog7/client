import { STORAGE_KEYS } from "../constants/storageKeys";
import { sanitizeDraftPayload } from "../utils/sanitizeDraftPayload";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed reading localStorage key: ${key}`, error);
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getAllDrafts() {
  const drafts = readJson(STORAGE_KEYS.DRAFTS, []);
  return Array.isArray(drafts) ? drafts.map(sanitizeDraftPayload) : [];
}

export function getDraftById(draftId) {
  if (!draftId) return null;
  return getAllDrafts().find((draft) => draft.id === draftId) || null;
}

export function saveDraft(draft) {
  const sanitized = sanitizeDraftPayload({
    ...draft,
    updatedAt: new Date().toISOString(),
  });

  const drafts = getAllDrafts();
  const existingIndex = drafts.findIndex((item) => item.id === sanitized.id);

  if (existingIndex >= 0) {
    drafts[existingIndex] = sanitized;
  } else {
    drafts.unshift(sanitized);
  }

  writeJson(STORAGE_KEYS.DRAFTS, drafts);
  setLastOpenedDraftId(sanitized.id);
  touchRecentDraft(sanitized.id);

  return sanitized;
}

export function deleteDraft(draftId) {
  if (!draftId) return false;

  const drafts = getAllDrafts().filter((draft) => draft.id !== draftId);
  writeJson(STORAGE_KEYS.DRAFTS, drafts);

  const recentIds = getRecentDraftIds().filter((id) => id !== draftId);
  writeJson(STORAGE_KEYS.RECENT_DRAFT_IDS, recentIds);

  const lastOpenedId = getLastOpenedDraftId();
  if (lastOpenedId === draftId) {
    localStorage.removeItem(STORAGE_KEYS.LAST_OPENED_DRAFT_ID);
  }

  return true;
}

export function duplicateDraft(draftId) {
  const original = getDraftById(draftId);
  if (!original) return null;

  const now = new Date().toISOString();
  const copy = sanitizeDraftPayload({
    ...original,
    id: `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  });

  return saveDraft(copy);
}

export function renameDraft(draftId, newTitle) {
  const draft = getDraftById(draftId);
  if (!draft) return null;

  return saveDraft({
    ...draft,
    title: newTitle?.trim() || draft.title,
  });
}

export function getRecentDraftIds() {
  const ids = readJson(STORAGE_KEYS.RECENT_DRAFT_IDS, []);
  return Array.isArray(ids) ? ids : [];
}

export function getRecentDrafts(limit = 5) {
  const drafts = getAllDrafts();
  const recentIds = getRecentDraftIds();

  const mapped = recentIds
    .map((id) => drafts.find((draft) => draft.id === id))
    .filter(Boolean);

  return mapped.slice(0, limit);
}

export function touchRecentDraft(draftId) {
  const existing = getRecentDraftIds().filter((id) => id !== draftId);
  const next = [draftId, ...existing].slice(0, 10);
  writeJson(STORAGE_KEYS.RECENT_DRAFT_IDS, next);
  return next;
}

export function setLastOpenedDraftId(draftId) {
  localStorage.setItem(STORAGE_KEYS.LAST_OPENED_DRAFT_ID, draftId);
}

export function getLastOpenedDraftId() {
  return localStorage.getItem(STORAGE_KEYS.LAST_OPENED_DRAFT_ID);
}
