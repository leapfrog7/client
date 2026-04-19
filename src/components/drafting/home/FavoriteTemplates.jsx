import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { SYSTEM_TEMPLATES } from "../features/data/systemTemplates";
import useDrafts from "../features/hooks/useDrafts";
import usePreferences from "../features/hooks/usePreferences";
import useOfficeProfile from "../features/hooks/useOfficeProfile";
import { createDraftFromTemplate } from "../features/services/templateFactory";

export default function FavoriteTemplates() {
  const navigate = useNavigate();
  const { persistDraft } = useDrafts();
  const { preferences } = usePreferences();
  const { officeProfile } = useOfficeProfile();

  const favorites = SYSTEM_TEMPLATES.slice(0, 4);

  const handleUseTemplate = (template) => {
    const draft = createDraftFromTemplate(template, preferences, officeProfile);
    const saved = persistDraft(draft);
    navigate(`/pages/tools/drafting/editor/${saved.id}`);
  };

  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {favorites.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => handleUseTemplate(template)}
          className="group relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:p-5"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  Template
                </div>

                <h3 className="mt-3 line-clamp-2 text-sm font-semibold tracking-tight text-slate-900 sm:text-[15px]">
                  {template.name}
                </h3>
              </div>

              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white">
                <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>

            <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
              {template.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 sm:text-xs">
                Open in editor
              </span>

              <span className="text-xs text-slate-400 transition group-hover:text-slate-600">
                One click
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
