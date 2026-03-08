import PropTypes from "prop-types";
import { FaSearch, FaTimesCircle } from "react-icons/fa";

const SearchBar = ({ value, onChange, onClear, disabled }) => {
  return (
    <div className="mx-2 -mt-1 mb-3">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
        <FaSearch className="text-gray-400 shrink-0" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Search in this month (title + content)…"
          className="w-full bg-transparent outline-none text-sm md:text-base text-gray-800 placeholder:text-gray-400"
        />
        {!!value && (
          <button
            type="button"
            onClick={onClear}
            className="text-gray-400 hover:text-gray-600 active:scale-[0.98] transition"
            aria-label="Clear search"
            title="Clear"
          >
            <FaTimesCircle />
          </button>
        )}
      </div>

      {!!value && (
        <div className="mt-1 text-[11px] text-gray-500">
          Press clear to reset • results are from the selected month only
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
