import { DEFAULT_PREFERENCES } from "../constants/defaultPreferences";

export function createPreferencesModel(overrides = {}) {
  return {
    ...DEFAULT_PREFERENCES,
    ...overrides,
  };
}
