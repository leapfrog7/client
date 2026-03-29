import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { TEMPLATE_TYPE_LABELS } from "../features/constants/templateTypes";
import { formatDraftDate } from "../features/utils/formatDraftDate";

DraftListItem.propTypes = {
  draft: PropTypes.object.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function DraftListItem({ draft, onDuplicate, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">
            {draft.title}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {TEMPLATE_TYPE_LABELS[draft.type] || "Draft"} • Updated{" "}
            {formatDraftDate(draft.updatedAt)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/pages/tools/drafting/editor/${draft.id}`}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Open
          </Link>

          <button
            type="button"
            onClick={() => onDuplicate(draft.id)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Duplicate
          </button>

          <button
            type="button"
            onClick={() => onDelete(draft.id)}
            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
