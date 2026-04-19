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
    <div className="grid md:grid-cols-2 gap-3 md:gap-5 items-center justify-center">
      {drafts.map((draft) => (
        <Link
          key={draft.id}
          to={`/pages/tools/drafting/editor/${draft.id}`}
          className="group flex items-center h-full justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 md:py-6 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/60 hover:text-blue-700 hover:shadow-md sm:px-5 sm:py-4.5"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-slate-300 transition group-hover:bg-blue-500" />
              <div className="truncate text-sm font-semibold md:tracking-wide  sm:text-[15px] ">
                {draft.title}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 sm:text-[13px]">
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                {TEMPLATE_TYPE_LABELS[draft.type] || "Draft"}
              </span>
              <span className="text-slate-300">•</span>
              <span>Updated {formatDraftDate(draft.updatedAt)}</span>
            </div>
          </div>

          <div className="shrink-0 ">
            <span className="inline-flex items-center gap-2 rounded-full border hover:bg-blue-50 hover:font-semibold border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition group-hover:border-slate-300 group-hover:text-slate-900">
              <span className="hidden sm:inline text-blue-700  ">Open</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.22 4.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L11.19 10 7.22 6.03a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
