import { useCallback, useEffect, useState } from "react";
import {
  getStoredPreferences,
  resetStoredPreferences,
  saveStoredPreferences,
} from "../services/preferencesStorage";

export default function usePreferences() {
  const [preferences, setPreferences] = useState(getStoredPreferences);

  useEffect(() => {
    setPreferences(getStoredPreferences());
  }, []);

  const updatePreferences = useCallback(
    (updates) => {
      const next = saveStoredPreferences({
        ...preferences,
        ...updates,
      });
      setPreferences(next);
      return next;
    },
    [preferences],
  );

  const resetPreferences = useCallback(() => {
    const next = resetStoredPreferences();
    setPreferences(next);
    return next;
  }, []);

  return {
    preferences,
    updatePreferences,
    resetPreferences,
  };
}
