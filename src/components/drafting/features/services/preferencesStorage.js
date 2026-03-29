import { STORAGE_KEYS } from "../constants/storageKeys";
import { createPreferencesModel } from "../models/preferencesModel";

export function getStoredPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return createPreferencesModel();

    const parsed = JSON.parse(raw);
    return createPreferencesModel(parsed);
  } catch (error) {
    console.error("Failed to read drafting preferences:", error);
    return createPreferencesModel();
  }
}

export function saveStoredPreferences(preferences) {
  try {
    const payload = createPreferencesModel(preferences);
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to save drafting preferences:", error);
    throw error;
  }
}

export function resetStoredPreferences() {
  try {
    const payload = createPreferencesModel();
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error("Failed to reset drafting preferences:", error);
    throw error;
  }
}
