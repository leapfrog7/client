import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DraftingLayout from "../../../components/drafting/shell/DraftingLayout";
import SectionHeader from "../../../components/drafting/common/SectionHeader";
import EditorWorkspace from "../../../components/drafting/editor/EditorWorkspace";
import useDraftEditor from "../../../components/drafting/features/hooks/useDraftEditor";
import { formatDraftDate } from "../../../components/drafting/features/utils/formatDraftDate";

export default function DraftEditorPage() {
  const { draftId } = useParams();
  const navigate = useNavigate();

  const { draft, updateDraft, saveCurrentDraft, isSaving, lastSavedAt } =
    useDraftEditor(draftId);

  const [titleInput, setTitleInput] = useState("");

  useEffect(() => {
    if (draft?.title) {
      setTitleInput(draft.title);
    }
  }, [draft?.title]);

  useEffect(() => {
    if (!draft) return undefined;

    const timer = setTimeout(() => {
      saveCurrentDraft();
    }, 900);

    return () => clearTimeout(timer);
  }, [draft, saveCurrentDraft]);

  const statusLabel = useMemo(() => {
    if (!draft) return "Loading draft...";
    if (isSaving) return "Saving locally...";
    return "Saved locally";
  }, [draft, isSaving]);

  const handleTitleBlur = () => {
    const trimmed = titleInput.trim();
    if (!trimmed || !draft) return;

    updateDraft((prev) => ({
      ...prev,
      title: trimmed,
    }));
  };

  if (!draft) {
    return (
      <DraftingLayout statusLabel="Draft not found">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <SectionHeader
            title="Draft not found"
            subtitle="This draft may have been deleted or does not exist in local storage."
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/pages/tools/drafting/drafts"
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Open draft library
            </Link>

            <button
              type="button"
              onClick={() => navigate("/pages/tools/drafting")}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Go home
            </button>
          </div>
        </div>
      </DraftingLayout>
    );
  }

  return (
    <DraftingLayout statusLabel={statusLabel} statusUpdatedAt={lastSavedAt}>
      <div className="space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Draft title
                </span>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleBlur}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-lg font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div className="text-sm text-slate-500">
                Last saved:{" "}
                {lastSavedAt ? formatDraftDate(lastSavedAt) : "Not yet saved"}
              </div>

              <button
                type="button"
                onClick={saveCurrentDraft}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Save now
              </button>
            </div>
          </div>
        </div>

        <EditorWorkspace draft={draft} onDraftChange={updateDraft} />
      </div>
    </DraftingLayout>
  );
}
