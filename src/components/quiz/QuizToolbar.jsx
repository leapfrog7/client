import PropTypes from "prop-types";

export default function QuizToolbar({
  showAllQuestions,
  onToggleShowAllQuestions,
}) {
  return (
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
  );
}

QuizToolbar.propTypes = {
  showAllQuestions: PropTypes.bool.isRequired,
  onToggleShowAllQuestions: PropTypes.func.isRequired,
};
