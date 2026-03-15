import PropTypes from "prop-types";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function QuestionCard({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  userAnswer,
  showExplanation,
  onToggleExplanation,
  onOptionClick,
  onClearSelection,
  onFetchAIExplanation,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  animClass,
}) {
  return (
    <div
      className={` bg-white sm:p-5 ${animClass}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center rounded-full  px-1 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100 sm:text-xs">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>

        <div className="text-[11px] text-slate-400 sm:text-xs">
          Select one option
        </div>
      </div>

      <p
        className="mb-5 text-[15px] font-semibold leading-7 text-slate-800 sm:text-base md:text-lg"
        style={{ whiteSpace: "pre-line" }}
      >
        {currentQuestion.questionText}
      </p>

      <div role="radiogroup" aria-label="Options" className="space-y-2.5">
        {currentQuestion.options.map((option, idx) => {
          const selected = userAnswer === option;

          return (
            <button
              key={idx}
              role="radio"
              aria-checked={selected}
              onClick={() => onOptionClick(option)}
              className={`group flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:px-4 sm:text-base ${
                selected
                  ? "border-sky-600 bg-sky-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  selected
                    ? "border-white/70 bg-white/20 text-white"
                    : "border-slate-300 bg-white text-slate-600"
                }`}
              >
                {String.fromCharCode(65 + idx)}
              </span>

              <span className="leading-6">{option}</span>
            </button>
          );
        })}

        <div className="pt-1">
          <button
            onClick={onClearSelection}
            disabled={userAnswer === undefined}
            className="text-xs font-medium text-rose-700 underline underline-offset-2 disabled:text-slate-300"
            aria-label="Clear selected option"
          >
            Clear selection
          </button>
        </div>
      </div>

      <div className="mt-5  py-4">
        <button
          onClick={onToggleExplanation}
          className="mx-auto flex min-w-[132px] items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 transition hover:bg-amber-200 sm:text-base"
          aria-pressed={showExplanation}
          aria-label="Toggle explanation"
        >
          {showExplanation ? "Hide Answer" : "Show Answer"}
          {showExplanation ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showExplanation && (
          <div className="mt-4 space-y-3 text-sm text-slate-700 md:text-base">
            <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-2 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center text-emerald-700">
                  ✓
                </span>

                <div>
                  <p className="text-xs font-medium text-emerald-700">
                    Correct Answer
                  </p>
                  <span className="mt-1 inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200 shadow-sm">
                    {currentQuestion.correctAnswer}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onFetchAIExplanation(currentQuestion._id)}
                className="inline-flex max-w-48 items-center justify-center gap-1.5 rounded-full border border-white bg-amber-200 px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full">
                  ✦
                </span>
                Get AI Insight
              </button>
            </div>

            <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 px-3 py-3 shadow-sm">
              <strong className="text-blue-700">Explanation:</strong>
              <p className="mt-1 whitespace-pre-line leading-relaxed text-slate-700">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

QuestionCard.propTypes = {
  currentQuestion: PropTypes.object.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number,
  userAnswer: PropTypes.string,
  showExplanation: PropTypes.bool.isRequired,
  onToggleExplanation: PropTypes.func.isRequired,
  onOptionClick: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
  onFetchAIExplanation: PropTypes.func.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchMove: PropTypes.func.isRequired,
  onTouchEnd: PropTypes.func.isRequired,
  animClass: PropTypes.string.isRequired,
};
