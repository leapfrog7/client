import PropTypes from "prop-types";
import { formatDraftDate } from "../features/utils/formatDraftDate";

StatusBar.propTypes = {
  label: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default function StatusBar({
  label = "Saved locally",
  updatedAt = null,
}) {
  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>{label}</span>
        <span>
          {updatedAt ? `Last updated: ${formatDraftDate(updatedAt)}` : "Ready"}
        </span>
      </div>
    </div>
  );
}
