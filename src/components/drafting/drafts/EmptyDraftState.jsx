import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState";

export default function EmptyDraftState() {
  return (
    <EmptyState
      title="No drafts found"
      description="You have not created any drafts yet, or your current filters are too narrow."
      action={
        <Link
          to="/pages/tools/drafting/templates"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Create first draft
        </Link>
      }
    />
  );
}
