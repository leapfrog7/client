import PropTypes from "prop-types";

export const QuizSkeleton = () => (
  <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-4 w-20 bg-gray-200 rounded" />
    </div>

    <div className="space-y-2 mb-5">
      <div className="h-4 w-11/12 bg-gray-200 rounded" />
      <div className="h-4 w-10/12 bg-gray-200 rounded" />
      <div className="h-4 w-8/12 bg-gray-200 rounded" />
    </div>

    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2"
        >
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-10/12 bg-gray-200 rounded" />
        </div>
      ))}
    </div>

    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex gap-3">
        <div className="h-9 w-24 bg-gray-200 rounded-lg" />
        <div className="h-9 w-24 bg-gray-200 rounded-lg" />
      </div>

      <div className="w-full md:w-1/3">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-2 w-1/3 bg-gray-200 rounded-full" />
        </div>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-7 w-7 rounded-full bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export function QuizLoadingView({
  showAllQuestions,
  onToggleShowAllQuestions,
}) {
  return (
    <div className="min-h-screen">
      <div className="flex justify-end mb-4 mr-4">
        <label className="inline-flex items-center">
          <span className="mr-4 text-sm md:text-lg">Random Questions</span>
          <input
            type="checkbox"
            checked={showAllQuestions}
            onChange={onToggleShowAllQuestions}
            className="hidden mr-2"
            aria-label="Toggle random questions"
          />
          <span
            className={`w-8 h-4 flex items-center flex-shrink-0 p-0 rounded-full duration-300 ease-in-out ${
              showAllQuestions ? "bg-blue-400" : "bg-gray-600"
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
                showAllQuestions ? "translate-x-4" : ""
              }`}
            />
          </span>
        </label>
      </div>
      <QuizSkeleton />
    </div>
  );
}

export function QuizErrorView({ error, onRetry }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-red-700 font-semibold">{error}</div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}

export function QuizEmptyView({ showAllQuestions, onToggleShowAllQuestions }) {
  return (
    <div className="min-h-screen">
      <div className="flex justify-end mb-4 mr-4">
        <label className="inline-flex items-center">
          <span className="mr-4 text-sm md:text-lg">Random Questions</span>
          <input
            type="checkbox"
            checked={showAllQuestions}
            onChange={onToggleShowAllQuestions}
            className="hidden mr-2"
            aria-label="Toggle random questions"
          />
          <span
            className={`w-8 h-4 flex items-center flex-shrink-0 p-0 rounded-full duration-300 ease-in-out ${
              showAllQuestions ? "bg-blue-400" : "bg-gray-600"
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
                showAllQuestions ? "translate-x-4" : ""
              }`}
            />
          </span>
        </label>
      </div>
      <div>No questions available for this topic.</div>
    </div>
  );
}

QuizLoadingView.propTypes = {
  showAllQuestions: PropTypes.bool.isRequired,
  onToggleShowAllQuestions: PropTypes.func.isRequired,
};

QuizErrorView.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

QuizEmptyView.propTypes = {
  showAllQuestions: PropTypes.bool.isRequired,
  onToggleShowAllQuestions: PropTypes.func.isRequired,
};
