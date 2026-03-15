// import PropTypes from "prop-types";
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaSave,
//   FaEye,
//   FaCheckCircle,
// } from "react-icons/fa";

// export default function ExamActions({
//   currentQuestionIndex,
//   totalQuestions,
//   showCorrectAnswer,
//   onToggleShowCorrectAnswer,
//   onPrevious,
//   onNext,
//   onSave,
//   onSubmit,
// }) {
//   return (
//     <div className="mt-4 flex flex-col gap-2">
//       <div className="flex justify-between lg:w-2/3 lg:mx-auto lg:justify-around my-4">
//         <button
//           className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
//           onClick={onPrevious}
//           disabled={currentQuestionIndex === 0}
//         >
//           <FaArrowLeft className="mr-2" />
//           Previous
//         </button>

//         <button
//           className="flex-1 flex items-center justify-center ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
//           onClick={onNext}
//           disabled={currentQuestionIndex === totalQuestions - 1}
//         >
//           Next
//           <FaArrowRight className="ml-2" />
//         </button>
//       </div>

//       <div className="mt-4 flex flex-col gap-2 lg:gap-4 lg:flex-row lg:justify-around lg:w-2/3 lg:mx-auto p-4 shadow-xl rounded-lg ring-2 ring-gray-100">
//         <div className="text-sm md:text-base flex gap-6 lg:gap-4 flex-row lg:justify-between lg:w-2/3 mx-auto">
//           <button
//             className="flex items-center justify-center px-4 py-2 lg:py-6 bg-yellow-400 text-gray-700 rounded-lg hover:bg-yellow-500 lg:flex-1"
//             onClick={onToggleShowCorrectAnswer}
//           >
//             <FaEye className="mr-2" />
//             {showCorrectAnswer ? "Hide Answer" : "Show Answer"}
//           </button>

//           <button
//             className="flex items-center justify-center px-4 py-2 lg:py-6 bg-emerald-600 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 lg:flex-1 lg:mt-0"
//             onClick={onSave}
//           >
//             <FaSave className="mr-2" />
//             Save and Exit
//           </button>
//         </div>

//         <button
//           className="flex items-center justify-center px-4 py-2 lg:py-6 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200 lg:flex-1 mt-6 lg:mt-0"
//           onClick={onSubmit}
//         >
//           <FaCheckCircle className="mr-2" />
//           Submit Quiz
//         </button>
//       </div>
//     </div>
//   );
// }

// ExamActions.propTypes = {
//   currentQuestionIndex: PropTypes.number.isRequired,
//   totalQuestions: PropTypes.number.isRequired,
//   showCorrectAnswer: PropTypes.bool.isRequired,
//   onToggleShowCorrectAnswer: PropTypes.func.isRequired,
//   onPrevious: PropTypes.func.isRequired,
//   onNext: PropTypes.func.isRequired,
//   onSave: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
// };

import PropTypes from "prop-types";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";

export default function ExamActions({
  currentQuestionIndex,
  totalQuestions,
  showCorrectAnswer,
  onToggleShowCorrectAnswer,
  onPrevious,
  onNext,
  onSave,
  onSubmit,
}) {
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:flex lg:justify-center lg:gap-4">
        <button
          className="inline-flex items-center justify-center rounded-xl bg-slate-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 lg:min-w-[140px]"
          onClick={onPrevious}
          disabled={isFirst}
        >
          <FaArrowLeft className="mr-2" />
          Previous
        </button>

        <button
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 lg:min-w-[140px]"
          onClick={onNext}
          disabled={isLast}
        >
          Next
          <FaArrowRight className="ml-2" />
        </button>
      </div>
      <br />
      <div className="rounded-xl p-3 shadow-sm">
        <div className="grid gap-4 lg:gap-32 sm:grid-cols-2 lg:grid-cols-3">
          <button
            className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2.5 border border-amber-300 font-semibold text-sm  text-amber-800 transition hover:bg-amber-100"
            onClick={onToggleShowCorrectAnswer}
          >
            <FaEye className="mr-2" />
            {showCorrectAnswer ? "Hide Answer" : "Show Answer"}
          </button>

          <button
            className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm  border border-emerald-300 text-emerald-800 font-semibold transition hover:bg-emerald-100"
            onClick={onSave}
          >
            <FaSave className="mr-2" />
            Save and Exit
          </button>

          <button
            className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2.5 text-sm border border-pink-400 font-semibold text-pink-700 shadow-sm transition hover:bg-pink-100 sm:col-span-2 lg:col-span-1"
            onClick={onSubmit}
          >
            <FaCheckCircle className="mr-2" />
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

ExamActions.propTypes = {
  currentQuestionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  showCorrectAnswer: PropTypes.bool.isRequired,
  onToggleShowCorrectAnswer: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
