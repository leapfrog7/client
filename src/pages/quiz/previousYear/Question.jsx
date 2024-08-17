import PropTypes from "prop-types";

const Question = ({ question, options, onSelectOption, selectedOption }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-base md:text-lg font-semibold mb-4">{question}</h2>
      <div className="text-sm md:text-base flex flex-col gap-3 md:gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            className={`block w-full text-left p-2 border rounded my-1 ${
              selectedOption === option ? "bg-yellow-200 " : "bg-white"
            } hover:bg-blue-100`}
            onClick={() => onSelectOption(option)}
          >
            {option}
          </button>
        ))}
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
