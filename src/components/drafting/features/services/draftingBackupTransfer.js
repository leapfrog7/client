import { STORAGE_KEYS } from "../constants/storageKeys";
import { createOfficeProfileModel } from "../models/officeProfileModel";
import { createPreferencesModel } from "../models/preferencesModel";
import { sanitizeDraftPayload } from "../utils/sanitizeDraftPayload";
import { normalizeParagraphEntry } from "../utils/normalizeParagraphEntry";
import { getStoredOfficeProfile } from "./officeProfileStorage";
import { getStoredPreferences } from "./preferencesStorage";
import { getAllDrafts } from "./draftStorage";
import { getAllParagraphBankItems } from "./paragraphBankStorage";

const PARAGRAPH_BANK_STORAGE_KEY = "drafting_paragraph_bank";
const BACKUP_APP_NAME = "undersigned-drafting-assistant";
const BACKUP_VERSION = 1;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Failed to read localStorage key: ${key}`, error);
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeDrafts(drafts) {
  if (!Array.isArray(drafts)) return [];
  return drafts.map((draft) => sanitizeDraftPayload(draft));
}

function normalizeParagraphBank(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => normalizeParagraphEntry(item));
}

function normalizeRecentDraftIds(ids, drafts) {
  const validIds = new Set(drafts.map((draft) => draft.id));
  if (!Array.isArray(ids)) return [];
  return ids.filter((id) => validIds.has(id)).slice(0, 10);
}

function normalizeLastOpenedDraftId(lastOpenedDraftId, drafts) {
  const validIds = new Set(drafts.map((draft) => draft.id));
  if (lastOpenedDraftId && validIds.has(lastOpenedDraftId)) {
    return lastOpenedDraftId;
  }
  return drafts[0]?.id || null;
}

export function buildDraftingBackupPayload() {
  return {
    version: BACKUP_VERSION,
    app: BACKUP_APP_NAME,
    exportedAt: new Date().toISOString(),
    data: {
      officeProfile: getStoredOfficeProfile(),
      preferences: getStoredPreferences(),
      paragraphBank: getAllParagraphBankItems(),
      drafts: getAllDrafts(),
      recentDraftIds: readJson(STORAGE_KEYS.RECENT_DRAFT_IDS, []),
      lastOpenedDraftId:
        localStorage.getItem(STORAGE_KEYS.LAST_OPENED_DRAFT_ID) || null,
    },
  };
}

export function downloadDraftingBackupFile() {
  const payload = buildDraftingBackupPayload();
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10);
  const a = document.createElement("a");
  a.href = url;
  a.download = `undersigned-drafting-backup-${date}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  return payload;
}

export function parseDraftingBackupText(text) {
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error("The selected file is not valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("The backup file format is invalid.");
  }

  if (parsed.app !== BACKUP_APP_NAME) {
    throw new Error("This file is not a valid Undersigned drafting backup.");
  }

  if (typeof parsed.version !== "number") {
    throw new Error("Backup version is missing or invalid.");
  }

  const data = parsed.data || {};

  const drafts = normalizeDrafts(data.drafts);
  const paragraphBank = normalizeParagraphBank(data.paragraphBank);
  const officeProfile = createOfficeProfileModel(data.officeProfile || {});
  const preferences = createPreferencesModel(data.preferences || {});
  const recentDraftIds = normalizeRecentDraftIds(data.recentDraftIds, drafts);
  const lastOpenedDraftId = normalizeLastOpenedDraftId(
    data.lastOpenedDraftId,
    drafts,
  );

  return {
    version: parsed.version,
    app: parsed.app,
    exportedAt: parsed.exportedAt || null,
    data: {
      officeProfile,
      preferences,
      paragraphBank,
      drafts,
      recentDraftIds,
      lastOpenedDraftId,
    },
  };
}

export function restoreDraftingBackupPayload(payload) {
  const parsed = parseDraftingBackupText(JSON.stringify(payload));
  const { data } = parsed;

  writeJson(STORAGE_KEYS.OFFICE_PROFILE, data.officeProfile);
  writeJson(STORAGE_KEYS.PREFERENCES, data.preferences);
  writeJson(PARAGRAPH_BANK_STORAGE_KEY, data.paragraphBank);
  writeJson(STORAGE_KEYS.DRAFTS, data.drafts);
  writeJson(STORAGE_KEYS.RECENT_DRAFT_IDS, data.recentDraftIds);

  if (data.lastOpenedDraftId) {
    localStorage.setItem(
      STORAGE_KEYS.LAST_OPENED_DRAFT_ID,
      data.lastOpenedDraftId,
    );
  } else {
    localStorage.removeItem(STORAGE_KEYS.LAST_OPENED_DRAFT_ID);
  }

  window.dispatchEvent(new Event("paragraph-bank-updated"));
  window.dispatchEvent(new Event("drafting-backup-restored"));

  return data;
}

export async function importDraftingBackupFile(file) {
  if (!file) {
    throw new Error("No backup file was selected.");
  }

  const text = await file.text();
  const parsed = parseDraftingBackupText(text);
  restoreDraftingBackupPayload(parsed);
  return parsed.data;
}
