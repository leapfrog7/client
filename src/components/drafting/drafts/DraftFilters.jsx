import PropTypes from "prop-types";
import SearchInput from "../common/SearchInput";
import { TEMPLATE_TYPE_OPTIONS } from "../features/constants/templateTypes";

DraftFilters.propTypes = {
  query: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

export default function DraftFilters({
  query,
  type,
  onQueryChange,
  onTypeChange,
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
      <SearchInput
        value={query}
        onChange={onQueryChange}
        placeholder="Search drafts by title..."
      />

      <select
        value={type}
        onChange={onTypeChange}
        className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      >
        <option value="all">All types</option>
        {TEMPLATE_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
