import { useState } from "react";
import axios from "axios";

const AddQuestionsForm = () => {
  const [topicTitle, setTopicTitle] = useState(topics[0]);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    },
  ]);
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
      },
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/quiz/postQuiz`, {
        topicTitle,
        questions,
      });
      console.log(response.data.message);
      setTopicTitle(topics[0]);
      setQuestions([
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
        },
      ]);
    } catch (error) {
      console.error("Error adding questions", error);
      alert("Error adding questions");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Topic Title:
          <select
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>
      </div>
      {questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Question Text:
            <textarea
              value={question.questionText}
              onChange={(e) =>
                handleQuestionChange(
                  questionIndex,
                  "questionText",
                  e.target.value
                )
              }
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className="block text-gray-700 font-bold mb-2"
              >
                Option {optionIndex + 1}:
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(
                      questionIndex,
                      optionIndex,
                      e.target.value
                    )
                  }
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </label>
            ))}
          </div>
          <label className="block text-gray-700 font-bold mb-2">
            Correct Answer:
            <input
              type="text"
              value={question.correctAnswer}
              onChange={(e) =>
                handleQuestionChange(
                  questionIndex,
                  "correctAnswer",
                  e.target.value
                )
              }
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
          <label className="block text-gray-700 font-bold mb-2">
            Explanation:
            <textarea
              value={question.explanation}
              onChange={(e) =>
                handleQuestionChange(
                  questionIndex,
                  "explanation",
                  e.target.value
                )
              }
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
            />
          </label>
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Another Question
      </button>
      <button
        type="submit"
        className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit Questions
      </button>
    </form>
  );
};

const topics = [
  "Constitution",
  "AoBR",
  "RTI Act",
  "DFPR",
  "Parliamentary Procedure",
  "Current Affairs",
  "Leave Rules",
  "Conduct Rules",
  "CCA Rules",
  "Pension Rules",
  "FR SR",
  "Office Procedure",
];

export default AddQuestionsForm;
