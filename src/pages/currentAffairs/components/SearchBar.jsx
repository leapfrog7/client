import PropTypes from "prop-types";
import { FaSearch, FaTimesCircle } from "react-icons/fa";

const SearchBar = ({ value, onChange, onClear, disabled }) => {
  const hasValue = !!value;

  return (
    <div className="mx-2 mt-1 mb-3">
      <div
        className={`group rounded-2xl border bg-white/95 px-3 py-2 shadow-sm transition-all duration-200 ${
          disabled
            ? "border-gray-200 opacity-70"
            : "border-slate-200 hover:border-slate-300 focus-within:border-amber-400 focus-within:shadow-md focus-within:ring-2 focus-within:ring-amber-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl transition ${
              disabled
                ? "bg-gray-100 text-gray-400"
                : "bg-amber-50 text-amber-600 group-focus-within:bg-amber-100"
            }`}
          >
            <FaSearch className="text-sm" />
          </span>

          <div className="min-w-0 flex-1">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder="Search in this month..."
              className="w-full bg-transparent text-sm md:text-base text-gray-800 placeholder:text-gray-400 outline-none"
            />

            <p className="mt-0.5 hidden text-[11px] text-gray-500 sm:block">
              Search across title and content within the selected month
            </p>
          </div>

          {hasValue && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 active:scale-95"
              aria-label="Clear search"
              title="Clear"
            >
              <FaTimesCircle className="text-base" />
            </button>
          )}
        </div>
      </div>

      {hasValue && (
        <div className="mt-1.5 px-1 text-[11px] text-gray-500">
          Results are limited to the selected month.
        </div>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default SearchBar;
