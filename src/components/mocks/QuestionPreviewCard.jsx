import PropTypes from "prop-types";

function QuestionPreviewCard({ question, showAnswer = true }) {
  if (!question) return null;

  const options = Array.isArray(question.options) ? question.options : [];

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        {question.subject ? (
          <span className="rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-700">
            {question.subject}
          </span>
        ) : null}

        {question.topic ? (
          <span className="rounded-full bg-teal-50 px-2 py-1 font-semibold text-teal-700">
            {question.topic}
          </span>
        ) : null}

        {question.difficulty ? (
          <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold text-gray-700">
            {question.difficulty}
          </span>
        ) : null}

        {question.isActive === false ? (
          <span className="rounded-full bg-red-50 px-2 py-1 font-semibold text-red-700">
            Inactive
          </span>
        ) : null}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm font-semibold leading-6 text-gray-900">
        {question.questionText || "Question text not available."}
      </p>

      <div className="mt-4 space-y-2">
        {options.map((option, index) => {
          const isCorrect = Number(question.correctOptionIndex) === index;

          return (
            <div
              key={`${option.optionText}-${index}`}
              className={[
                "rounded-md border px-3 py-2 text-sm",
                showAnswer && isCorrect
                  ? "border-green-300 bg-green-50 text-green-800"
                  : "border-gray-200 bg-gray-50 text-gray-700",
              ].join(" ")}
            >
              <span className="mr-2 font-semibold">
                {String.fromCharCode(65 + index)}.
              </span>
              {option.optionText}
              {showAnswer && isCorrect ? (
                <span className="ml-2 text-xs font-semibold">(Correct)</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {showAnswer && question.explanation ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Explanation
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-amber-900">
            {question.explanation}
          </p>
        </div>
      ) : null}
    </div>
  );
}

QuestionPreviewCard.propTypes = {
  question: PropTypes.shape({
    questionText: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        optionText: PropTypes.string,
      }),
    ),
    correctOptionIndex: PropTypes.number,
    explanation: PropTypes.string,
    topic: PropTypes.string,
    subject: PropTypes.string,
    difficulty: PropTypes.string,
    isActive: PropTypes.bool,
  }),
  showAnswer: PropTypes.bool,
};

export default QuestionPreviewCard;
