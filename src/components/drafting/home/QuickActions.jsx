import PropTypes from "prop-types";
import { Link } from "react-router-dom";

QuickActions.propTypes = {
  lastOpenedDraftId: PropTypes.string,
  onCreateBlank: PropTypes.func.isRequired,
};

export default function QuickActions({
  lastOpenedDraftId = null,
  onCreateBlank,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Link
        to="/pages/tools/drafting/templates"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-900">
          Start from template
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Choose a standard format like Office Memorandum, Letter, or Office
          Order.
        </p>
      </Link>

      <button
        type="button"
        onClick={onCreateBlank}
        className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-900">
          Start blank draft
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Open a clean drafting canvas when you do not want to begin with a
          fixed structure.
        </p>
      </button>

      <Link
        to="/pages/tools/drafting/drafts"
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <h3 className="text-sm font-semibold text-slate-900">
          Open saved drafts
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Continue previous drafts, duplicate them, or organize recent
          communications.
        </p>
      </Link>

      {lastOpenedDraftId ? (
        <Link
          to={`/pages/tools/drafting/editor/${lastOpenedDraftId}`}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <h3 className="text-sm font-semibold text-slate-900">
            Resume last draft
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Jump back into the draft you opened most recently.
          </p>
        </Link>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Resume last draft
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            This will appear once you start working on your first draft.
          </p>
        </div>
      )}
    </div>
  );
}
