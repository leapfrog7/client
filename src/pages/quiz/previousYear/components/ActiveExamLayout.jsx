import PropTypes from "prop-types";
import Question from "../Question";
import ExamHeader from "./ExamHeader";
import ExamActions from "./ExamActions";
import QuestionGrid from "./QuestionGrid";

export default function ActiveExamLayout({
  paperId,
  currentPaper,
  remainingTime,
  onTimeUp,
  questions,
  answers,
  showCorrectAnswer,
  onToggleShowCorrectAnswer,
  onSelectOption,
  onPreviousQuestion,
  onNextQuestion,
  onSave,
  onSubmit,
  onQuestionSelect,
}) {
  const currentQuestion = questions[currentPaper.currentQuestionIndex];

  return (
    <div key={paperId || `${currentPaper.year}-${currentPaper.paperType}`}>
      <ExamHeader
        currentPaper={currentPaper}
        remainingTime={remainingTime}
        onTimeUp={onTimeUp}
      />

      <div className="2xl:flex gap-6">
        <div className="w-11/12 2xl:w-2/3 mx-auto">
          <div className="mt-8 whitespace-pre-line w-full mx-auto">
            <Question
              question={currentQuestion.questionText}
              options={currentQuestion.options}
              onSelectOption={onSelectOption}
              selectedOption={answers[currentPaper.currentQuestionIndex]}
            />

            {showCorrectAnswer && (
              <p className="text-green-600 mt-2">
                Correct Answer: {currentQuestion.correctAnswer}
              </p>
            )}
          </div>

          <ExamActions
            currentQuestionIndex={currentPaper.currentQuestionIndex}
            totalQuestions={questions.length}
            showCorrectAnswer={showCorrectAnswer}
            onToggleShowCorrectAnswer={onToggleShowCorrectAnswer}
            onPrevious={onPreviousQuestion}
            onNext={onNextQuestion}
            onSave={onSave}
            onSubmit={onSubmit}
          />
        </div>

        <hr className="hidden 2xl:visible" />

        <QuestionGrid
          questions={questions}
          answers={answers}
          currentQuestionIndex={currentPaper.currentQuestionIndex}
          onSelectQuestion={onQuestionSelect}
        />
      </div>
    </div>
  );
}

ActiveExamLayout.propTypes = {
  paperId: PropTypes.string,
  currentPaper: PropTypes.shape({
    year: PropTypes.string,
    paperType: PropTypes.string,
    currentQuestionIndex: PropTypes.number,
  }).isRequired,
  remainingTime: PropTypes.number.isRequired,
  onTimeUp: PropTypes.func.isRequired,
  questions: PropTypes.array.isRequired,
  answers: PropTypes.object.isRequired,
  showCorrectAnswer: PropTypes.bool.isRequired,
  onToggleShowCorrectAnswer: PropTypes.func.isRequired,
  onSelectOption: PropTypes.func.isRequired,
  onPreviousQuestion: PropTypes.func.isRequired,
  onNextQuestion: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onQuestionSelect: PropTypes.func.isRequired,
};
