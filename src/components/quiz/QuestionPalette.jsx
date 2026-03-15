import PropTypes from "prop-types";
import { useMemo } from "react";

export default function QuestionPalette({
  quizData,
  selectedAnswers,
  bookmarkedQuestions,
  flagged,
  currentQuestionIndex,
  onJump,
  pillRefs,
}) {
  const answeredCount = useMemo(
    () =>
      quizData.reduce((count, _, idx) => {
        return selectedAnswers[idx] !== undefined &&
          selectedAnswers[idx] !== null
          ? count + 1
          : count;
      }, 0),
    [quizData, selectedAnswers],
  );

  const progressPercent = useMemo(() => {
    return Math.round((answeredCount / Math.max(quizData.length, 1)) * 100);
  }, [answeredCount, quizData.length]);

  return (
    <div className="pt-8 md:pt-16 bg-white ">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 sm:text-base">
            Quiz Map
          </h3>
          {/* <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
            Jump to any question instantly
          </p> */}
        </div>

        <div className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 sm:text-xs">
          {answeredCount}/{quizData.length} answered
        </div>
      </div>

      <div
        className="overflow-x-auto md:overflow-x-visible my-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex min-w-max flex-nowrap gap-2.5 py-2 px-1 md:min-w-0 md:flex-wrap md:justify-center md:gap-3">
          {quizData.map((q, idx) => {
            const id = String(q._id);
            const answered =
              selectedAnswers[idx] !== undefined &&
              selectedAnswers[idx] !== null;
            const bookmarked = bookmarkedQuestions.includes(id);
            const flg = flagged.has(id);
            const isCurrent = idx === currentQuestionIndex;

            const base =
              "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 md:h-10 md:w-10 md:text-sm";

            const stateClasses = isCurrent
              ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
              : answered
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-white text-slate-700 border-slate-300";

            const ringClasses = bookmarked
              ? "ring-2 ring-yellow-400"
              : flg
                ? "ring-2 ring-pink-400"
                : "";

            const hoverClasses = isCurrent
              ? ""
              : "hover:-translate-y-0.5 hover:shadow-sm";

            return (
              <button
                key={id}
                ref={(el) => (pillRefs.current[idx] = el)}
                onClick={() => onJump(idx)}
                className={`${base} ${stateClasses} ${ringClasses} ${hoverClasses}`}
                aria-label={`Jump to question ${idx + 1}`}
                title={`Q${idx + 1}${answered ? " • Answered" : ""}${
                  bookmarked ? " • Bookmarked" : ""
                }${flg ? " • Flagged" : ""}`}
              >
                {idx + 1}

                {(bookmarked || flg) && (
                  <span
                    className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-white ${
                      bookmarked ? "bg-yellow-400" : "bg-pink-400"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2 md:gap-3 text-[10px] text-slate-500 sm:text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          Current
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Answered
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
          <span className="h-2 w-2 rounded-full bg-yellow-400" />
          Bookmarked
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
          <span className="h-2 w-2 rounded-full bg-pink-400" />
          Flagged
        </span>
      </div>
    </div>
  );
}

QuestionPalette.propTypes = {
  quizData: PropTypes.array.isRequired,
  selectedAnswers: PropTypes.object.isRequired,
  bookmarkedQuestions: PropTypes.array.isRequired,
  flagged: PropTypes.instanceOf(Set).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  onJump: PropTypes.func.isRequired,
  pillRefs: PropTypes.object.isRequired,
};
