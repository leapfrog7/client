import { useCallback, useEffect, useState } from "react";
import { getDraftById, saveDraft } from "../services/draftStorage";

export default function useDraftEditor(draftId) {
  const [draft, setDraft] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    if (!draftId) return;

    const found = getDraftById(draftId);
    setDraft(found);
    setLastSavedAt(found?.updatedAt || null);
  }, [draftId]);

  const updateDraft = useCallback((updater) => {
    setDraft((prev) => {
      if (!prev) return prev;

      const next =
        typeof updater === "function" ? updater(prev) : { ...prev, ...updater };

      return {
        ...next,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const saveCurrentDraft = useCallback(() => {
    if (!draft) return null;

    setIsSaving(true);

    const saved = saveDraft({
      ...draft,
      lastOpenedAt: new Date().toISOString(),
    });

    setDraft(saved);
    setLastSavedAt(saved.updatedAt);
    setIsSaving(false);

    return saved;
  }, [draft]);

  return {
    draft,
    setDraft,
    updateDraft,
    saveCurrentDraft,
    isSaving,
    lastSavedAt,
  };
}
