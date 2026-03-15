import PropTypes from "prop-types";

export default function QuestionGrid({
  questions,
  answers,
  currentQuestionIndex,
  onSelectQuestion,
}) {
  const attemptedCount = Object.keys(answers).length;
  const progressPercent = Math.round(
    (attemptedCount / Math.max(questions.length, 1)) * 100,
  );

  return (
    <div className="w-full 2xl:w-1/3 mx-auto 2xl:border-l 2xl:border-slate-200 2xl:pl-6">
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 2xl:mt-8">
        <div className="text-center">
          <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            Question Grid
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800 sm:text-base">
            Questions Attempted: {attemptedCount} / {questions.length}
          </p>

          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto border-t border-slate-100 pt-4">
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 2xl:grid-cols-6">
            {questions.map((_, index) => {
              const isAnswered = !!answers[index];
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={index}
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold transition sm:text-sm ${
                    isCurrent
                      ? "border-blue-300 bg-blue-100 text-blue-800 shadow-sm"
                      : isAnswered
                        ? "border-yellow-300 bg-yellow-300 text-yellow-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => onSelectQuestion(index)}
                  aria-label={`Go to question ${index + 1}`}
                  title={`Question ${index + 1}${
                    isCurrent ? " • Current" : isAnswered ? " • Attempted" : ""
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] text-slate-500 sm:text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Current
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            Attempted
          </span>
        </div>
      </div>
    </div>
  );
}

QuestionGrid.propTypes = {
  questions: PropTypes.array.isRequired,
  answers: PropTypes.object.isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  onSelectQuestion: PropTypes.func.isRequired,
};
