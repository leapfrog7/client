// import PropTypes from "prop-types";

// const Question = ({ question, options, onSelectOption, selectedOption }) => {
//   return (
//     <div className="p-4 border rounded-lg shadow-md">
//       <h2 className="text-base md:text-lg font-semibold mb-4">{question}</h2>
//       <div className="text-sm md:text-base flex flex-col gap-3 md:gap-4">
//         {options.map((option, index) => (
//           <button
//             key={index}
//             className={`block w-full text-left p-2 border rounded my-1 ${
//               selectedOption === option ? "bg-yellow-200 " : "bg-white"
//             } hover:bg-blue-100`}
//             onClick={() => onSelectOption(option)}
//           >
//             {option}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// Question.propTypes = {
//   question: PropTypes.string.isRequired,
//   options: PropTypes.arrayOf(PropTypes.string).isRequired,
//   onSelectOption: PropTypes.func.isRequired,
//   selectedOption: PropTypes.string,
// };

// export default Question;

import PropTypes from "prop-types";

const Question = ({ question, options, onSelectOption, selectedOption }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 md:p-5">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
          Question
        </p>
        <h2 className="mt-1 whitespace-pre-line text-[15px] font-semibold leading-7 text-slate-800 sm:text-base md:text-lg">
          {question}
        </h2>
      </div>

      <div
        className="flex flex-col gap-2.5 text-sm md:text-base"
        role="radiogroup"
        aria-label="Question options"
      >
        {options.map((option, index) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-200   sm:px-4 ${
                isSelected
                  ? "border-sky-300 bg-sky-100 text-slate-900 shadow-sm"
                  : "border-slate-200 bg-white text-slate-800 hover:border-yellow-200 hover:bg-blue-50"
              }`}
              onClick={() => onSelectOption(option)}
            >
              <span
                className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  isSelected
                    ? "border-sky-400 bg-white text-sky-700"
                    : "border-slate-300 bg-white text-slate-500"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>

              <span className="leading-6">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectOption: PropTypes.func.isRequired,
  selectedOption: PropTypes.string,
};

export default Question;
