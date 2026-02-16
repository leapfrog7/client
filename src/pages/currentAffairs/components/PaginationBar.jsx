import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationBar = ({
  page,
  limit,
  total,
  hasMore,
  loading,
  onPageChange,
}) => {
  const safePage = Math.max(page || 1, 1);
  const safeLimit = Math.max(limit || 20, 1);
  const safeTotal = Math.max(total || 0, 0);

  const totalPages = Math.max(Math.ceil(safeTotal / safeLimit), 1);
  const canPrev = safePage > 1 && !loading;
  const canNext = hasMore && !loading;

  const start = safeTotal === 0 ? 0 : (safePage - 1) * safeLimit + 1;
  const end = Math.min(safePage * safeLimit, safeTotal);

  return (
    <div className="mx-2 mt-4 rounded-2xl border bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        {/* Left: range */}
        <div className="text-xs md:text-sm text-gray-600">
          {safeTotal > 0 ? (
            <>
              Showing{" "}
              <span className="font-semibold">
                {start}-{end}
              </span>{" "}
              of <span className="font-semibold">{safeTotal}</span>
            </>
          ) : (
            <>No items</>
          )}
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => canPrev && onPageChange(safePage - 1)}
            disabled={!canPrev}
            className="
              inline-flex items-center gap-2
              rounded-xl border px-3 py-2
              text-xs md:text-sm font-semibold
              bg-white
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
              transition
            "
          >
            <FaChevronLeft />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="px-2 text-xs md:text-sm text-gray-600">
            <span className="font-semibold">{safePage}</span>
            <span className="text-gray-400"> / </span>
            <span className="font-semibold">{totalPages}</span>
          </div>

          <button
            type="button"
            onClick={() => canNext && onPageChange(safePage + 1)}
            disabled={!canNext}
            className="
              inline-flex items-center gap-2
              rounded-xl border px-3 py-2
              text-xs md:text-sm font-semibold
              bg-white
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2
              transition
            "
          >
            <span className="hidden sm:inline">Next</span>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

PaginationBar.propTypes = {
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationBar;
