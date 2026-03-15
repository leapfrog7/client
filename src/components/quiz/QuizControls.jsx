import PropTypes from "prop-types";
import {
  MdOutlineBookmarkAdded,
  MdOutlineBookmarkRemove,
} from "react-icons/md";
import { TailSpin } from "react-loader-spinner";

export default function QuizControls({
  currentQuestionIndex,
  totalQuestions,
  onPrev,
  onNext,
  onToggleFlag,
  isFlagged,
  onBookmark,
  isBookmarked,
  loadingBM,
}) {
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          aria-label="Previous question"
        >
          <span aria-hidden="true">←</span>
          <span>Prev</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleFlag}
            className={`inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border text-lg transition ${
              isFlagged
                ? "border-pink-200 bg-pink-100 text-pink-700"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
            aria-pressed={isFlagged}
            aria-label={isFlagged ? "Unflag question" : "Flag question"}
            title={isFlagged ? "Unflag question" : "Flag question"}
          >
            {isFlagged ? "🚩" : "🏴"}
          </button>

          <button
            onClick={onBookmark}
            className={`inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-xl border text-xl transition ${
              isBookmarked
                ? "border-yellow-300 bg-yellow-300 text-slate-900"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {!loadingBM ? (
              isBookmarked ? (
                <MdOutlineBookmarkRemove />
              ) : (
                <MdOutlineBookmarkAdded />
              )
            ) : (
              <TailSpin color="#2563eb" height={18} width={18} />
            )}
          </button>
        </div>

        <button
          onClick={onNext}
          disabled={isLast}
          className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
          aria-label="Next question"
        >
          <span>Next</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

QuizControls.propTypes = {
  currentQuestionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onToggleFlag: PropTypes.func.isRequired,
  isFlagged: PropTypes.bool.isRequired,
  onBookmark: PropTypes.func.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
  loadingBM: PropTypes.bool.isRequired,
};
