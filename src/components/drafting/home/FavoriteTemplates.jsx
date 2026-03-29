import { Link } from "react-router-dom";
import { SYSTEM_TEMPLATES } from "../features/data/systemTemplates";

export default function FavoriteTemplates() {
  const favorites = SYSTEM_TEMPLATES.slice(0, 4);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {favorites.map((template) => (
        <Link
          key={template.id}
          to="/pages/tools/drafting/templates"
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h3 className="text-sm font-semibold text-slate-900">
            {template.name}
          </h3>
          <p className="mt-2 text-sm text-slate-600 line-clamp-3">
            {template.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
