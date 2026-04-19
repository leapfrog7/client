import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DraftingLayout from "../../../components/drafting/shell/DraftingLayout";
import SectionHeader from "../../../components/drafting/common/SectionHeader";
import EditorWorkspace from "../../../components/drafting/editor/EditorWorkspace";
import useDraftEditor from "../../../components/drafting/features/hooks/useDraftEditor";
import DraftTitleField from "../../../components/drafting/drafts/DraftTitleField";
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
      <div className="space-y-3">
        <div className="rounded-2xl  bg-white px-2 ">
          <div className="flex flex-col gap-3 md:gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <DraftTitleField
                titleInput={titleInput}
                setTitleInput={setTitleInput}
                handleTitleBlur={handleTitleBlur}
              />
            </div>

            <div className="flex md:flex-col gap-2 md:gap-3 lg:min-w-[220px] lg:items-end">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 text-[11px] ,d:text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  Last saved:{" "}
                  <span className="font-medium text-slate-700">
                    {lastSavedAt
                      ? formatDraftDate(lastSavedAt)
                      : "Not yet saved"}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={saveCurrentDraft}
                className="inline-flex items-center justify-center gap-1 md:gap-2 rounded-md md:rounded-xl border border-slate-300 bg-white px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4 text-slate-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 4.75h11.5L20 8.25V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.75a1 1 0 0 1 1-1Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 4.75v4h7v-4M8 19v-5h8v5"
                  />
                </svg>
                Save draft
              </button>
            </div>
          </div>
        </div>

        <EditorWorkspace draft={draft} onDraftChange={updateDraft} />
      </div>
    </DraftingLayout>
  );
}
