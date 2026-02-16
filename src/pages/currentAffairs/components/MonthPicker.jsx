import PropTypes from "prop-types";
import { FaChevronDown, FaRegCalendarAlt } from "react-icons/fa";

const MonthPicker = ({ months, selectedMonthKey, onChange, loading }) => {
  const disabled = loading || !months?.length;

  return (
    <div className="mx-2 mt-4">
      <div
        className="
         
          bg-white/90 backdrop-blur
          p-3 md:p-4
         
          transition
         
        "
      >
        <div className="flex items-center justify-between gap-3">
          {/* Label (same row) */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <FaRegCalendarAlt className="text-sm" />
            </span>
            <div className="min-w-0">
              <p className="text-sm md:text-base font-semibold text-gray-800 leading-5">
                Select month
              </p>
            </div>
          </div>

          {/* Select */}
          <div className="relative w-[52%] sm:w-[45%] md:w-[320px]">
            <select
              value={selectedMonthKey || ""}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className={`
                w-full appearance-none
                rounded-xl border
                bg-white hover:bg-blue-50
                px-3 py-2.5 pr-10
                text-sm font-semibold
                outline-none
                transition
                ${
                  disabled
                    ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                    : "border-gray-200 text-gray-800 hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                }
              `}
            >
              {!months?.length ? (
                <option value="">
                  {loading ? "Loading months..." : "No months available"}
                </option>
              ) : (
                months.map((m) => (
                  <option key={m._id || m.monthKey} value={m.monthKey}>
                    {m.title}
                  </option>
                ))
              )}
            </select>

            {/* Chevron (animated feel) */}
            <span
              className={`
                pointer-events-none absolute right-3 top-1/2 -translate-y-1/2
                transition-transform duration-200
                ${disabled ? "text-gray-300" : "text-gray-500"}
                group-focus-within:rotate-180
              `}
            >
              <FaChevronDown className="text-sm" />
            </span>
          </div>
        </div>

        {/* Optional helper row for empty state */}
        {!loading && months?.length === 0 && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            No months found. Please publish at least one month in Sanity.
          </div>
        )}
      </div>
    </div>
  );
};

MonthPicker.propTypes = {
  months: PropTypes.array,
  selectedMonthKey: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default MonthPicker;
