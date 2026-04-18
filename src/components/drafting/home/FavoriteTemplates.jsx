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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {favorites.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => handleUseTemplate(template)}
          className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              {template.name}
            </h3>

            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-slate-900 group-hover:text-white">
              <FaArrowRight className="text-xs" />
            </span>
          </div>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {template.description}
          </p>

          <div className="mt-4 inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            Open directly in editor
          </div>
        </button>
      ))}
    </div>
  );
}
