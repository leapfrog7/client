import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState";
import { TEMPLATE_TYPE_LABELS } from "../features/constants/templateTypes";
import { formatDraftDate } from "../features/utils/formatDraftDate";

RecentDrafts.propTypes = {
  drafts: PropTypes.array.isRequired,
};

export default function RecentDrafts({ drafts }) {
  if (!drafts.length) {
    return (
      <EmptyState
        title="No recent drafts yet"
        description="Once you start drafting, your recent items will appear here for quick access."
      />
    );
  }

  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <Link
          key={draft.id}
          to={`/pages/tools/drafting/editor/${draft.id}`}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">
              {draft.title}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {TEMPLATE_TYPE_LABELS[draft.type] || "Draft"} • Updated{" "}
              {formatDraftDate(draft.updatedAt)}
            </div>
          </div>

          <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            Open
          </span>
        </Link>
      ))}
    </div>
  );
}
