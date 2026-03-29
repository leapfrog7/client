import { useCallback, useEffect, useState } from "react";
import {
  deleteDraft,
  duplicateDraft,
  getAllDrafts,
  getDraftById,
  getLastOpenedDraftId,
  getRecentDrafts,
  renameDraft,
  saveDraft,
} from "../services/draftStorage";

export default function useDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [recentDrafts, setRecentDrafts] = useState([]);

  const refreshDrafts = useCallback(() => {
    setDrafts(getAllDrafts());
    setRecentDrafts(getRecentDrafts());
  }, []);

  useEffect(() => {
    refreshDrafts();
  }, [refreshDrafts]);

  const persistDraft = useCallback(
    (draft) => {
      const saved = saveDraft(draft);
      refreshDrafts();
      return saved;
    },
    [refreshDrafts],
  );

  const removeDraft = useCallback(
    (draftId) => {
      deleteDraft(draftId);
      refreshDrafts();
    },
    [refreshDrafts],
  );

  const cloneDraft = useCallback(
    (draftId) => {
      const cloned = duplicateDraft(draftId);
      refreshDrafts();
      return cloned;
    },
    [refreshDrafts],
  );

  const updateDraftTitle = useCallback(
    (draftId, newTitle) => {
      const renamed = renameDraft(draftId, newTitle);
      refreshDrafts();
      return renamed;
    },
    [refreshDrafts],
  );

  const lastOpenedDraftId = getLastOpenedDraftId();
  const lastOpenedDraft = lastOpenedDraftId
    ? getDraftById(lastOpenedDraftId)
    : null;

  return {
    drafts,
    recentDrafts,
    lastOpenedDraft,
    refreshDrafts,
    persistDraft,
    removeDraft,
    cloneDraft,
    updateDraftTitle,
    getDraftById,
  };
}
