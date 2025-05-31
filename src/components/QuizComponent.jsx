import { useState, useEffect } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import PropTypes from "prop-types";
import { MdOutlineBookmarkAdded } from "react-icons/md";
import { MdOutlineBookmarkRemove } from "react-icons/md";
import { IoReload } from "react-icons/io5";
import { MdPreview } from "react-icons/md";
import { TailSpin } from "react-loader-spinner"; // Importing the loading spinner
import QuestionFeedback from "./QuestionFeedback";

const QuizComponent = ({ userId, topicName, topicId }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); //for loader spinner
  const [showExplanation, setShowExplanation] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingBM, setLoadingBM] = useState(false);
  const [error, setError] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const token = localStorage.getItem("jwtToken");

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1";
  const fetchUnattemptedQuestions = async () => {
    setLoading(true);
    try {
      const endpoint = showAllQuestions
        ? `${BASE_URL}/quiz/getRandomQuiz`
        : `${BASE_URL}/quiz/getQuiz`;
      const response = await axios.get(endpoint, {
        params: { userId, topicName, topicId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizData(response.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      setError("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
        params: { userId, topicId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("fetchBookmarks", response.data.bookmarks);
      const topicBookmark = response.data.bookmarks.find(
        (bookmark) => bookmark.topic._id === topicId
      );
      if (topicBookmark) {
        setBookmarkedQuestions(topicBookmark.questions.map((q) => q._id));
      } else {
        setBookmarkedQuestions([]);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUnattemptedQuestions();
      fetchBookmarks();
    }
  }, [topicName, showAllQuestions, topicId]);

  const handleOptionClick = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: option });
  };

  const handleBookmark = async () => {
    const currentQuestionId = quizData[currentQuestionIndex]._id;
    setLoadingBM(true);
    try {
      if (!bookmarkedQuestions.includes(currentQuestionId.toString())) {
        await axios.post(
          `${BASE_URL}/quiz/addBookmark`,
          {
            userId,
            topicName,
            questionId: currentQuestionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the headers
            },
          }
        );
        setBookmarkedQuestions([
          ...bookmarkedQuestions,
          currentQuestionId.toString(),
        ]);
        //setLoadingBM(false)
      } else {
        await axios.delete(`${BASE_URL}/quiz/removeBookmark`, {
          data: { userId, topicName, questionId: currentQuestionId },
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the headers
          },
        });
        setBookmarkedQuestions(
          bookmarkedQuestions.filter(
            (id) => id !== currentQuestionId.toString()
          )
        );
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
      setError("Failed to update bookmark");
    } finally {
      setLoadingBM(false);
    }
  };

  const handleNavigation = (direction) => {
    setCurrentQuestionIndex(currentQuestionIndex + direction);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      //console.log("inside handleSubmit");

      await axios.post(
        `${BASE_URL}/quiz/submitQuiz`,
        {
          userId,
          topicName,
          attemptedQuestions: quizData.map((question) => question._id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the headers
          },
        }
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      setError("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExplanation = (index) => {
    setShowExplanation({
      ...showExplanation,
      [index]: !showExplanation[index],
    });
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  //Once the Quiz are all done, the random question option doesn't appear. It is being fixed here by rendering the component again.
  if (quizData.length === 0) {
    return (
      <div>
        <div className="flex justify-end mb-4 mr-4">
          <label className="inline-flex items-center">
            <span className="mr-4 text-sm md:text-lg">Random Questions</span>
            <input
              type="checkbox"
              checked={showAllQuestions}
              onChange={() =>
                setShowAllQuestions((prev) => {
                  setCurrentQuestionIndex(0);
                  return !prev;
                })
              }
              className="hidden mr-2"
            />
            <span
              className={`w-8 h-4 flex items-center flex-shrink-0 p-0 bg-blue-300 rounded-full duration-300 ease-in-out ${
                showAllQuestions ? "bg-blue-400" : "bg-gray-600"
              }`}
            >
              <span
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
                  showAllQuestions ? "translate-x-4 bg-blue-700" : "bg-white"
                }`}
              ></span>
            </span>
          </label>
        </div>
        <div>No questions available for this topic.</div>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  const calculateScore = () => {
    return quizData.reduce((score, question, index) => {
      return (
        score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
      );
    }, 0);
  };

  const score = calculateScore();

  return (
    <div className="min-h-screen">
      <div className="flex justify-end mb-4 mr-4">
        <label className="inline-flex items-center">
          <span className="mr-4 text-sm md:text-lg">Random Questions</span>
          <input
            type="checkbox"
            checked={showAllQuestions}
            onChange={() =>
              setShowAllQuestions((prev) => {
                setCurrentQuestionIndex(0);
                return !prev;
              })
            }
            className="hidden mr-2"
          />
          <span
            className={`w-8 h-4 flex items-center flex-shrink-0 p-0 bg-blue-300 rounded-full duration-300 ease-in-out ${
              showAllQuestions ? "bg-blue-400" : "bg-gray-600"
            }`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-400 ease-in-out ${
                showAllQuestions ? "translate-x-4 bg-blue-700" : "bg-white"
              }`}
            ></span>
          </span>
        </label>
      </div>

      {!isSubmitted ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <h2 className="text-sm font-bold mb-2">{`Question ${
              currentQuestionIndex + 1
            }`}</h2>
            <p
              className="text-gray-800 mb-4 font-semibold text-sm md:text-lg"
              style={{ whiteSpace: "pre-line" }}
            >
              {currentQuestion.questionText}
            </p>
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className={`block w-full text-left p-2 mb-2 border rounded-lg text-sm md:text-base ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? "bg-customCyan text-white"
                    : "bg-white text-black"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm md:text-lg">
            <button
              onClick={() => handleNavigation(-1)}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleBookmark}
              className={`px-4 py-2 rounded text-xl ${
                bookmarkedQuestions.includes(currentQuestion._id)
                  ? "bg-yellow-500"
                  : "bg-gray-300"
              }`}
            >
              {!loadingBM ? (
                bookmarkedQuestions.includes(currentQuestion._id) ? (
                  <MdOutlineBookmarkRemove />
                ) : (
                  <MdOutlineBookmarkAdded />
                )
              ) : (
                <TailSpin color="#fff" height={20} width={20} />
              )}
            </button>
            <button
              onClick={() => handleNavigation(1)}
              disabled={currentQuestionIndex === quizData.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div>
            <button
              onClick={() => toggleExplanation(currentQuestionIndex)}
              className="my-6 px-4 py-2 bg-yellow-300 text-black rounded mx-auto flex items-center min-w-24 text-sm md:text-base"
            >
              {showExplanation[currentQuestionIndex]
                ? "Hide Answer"
                : "Show Answer"}
              {showExplanation[currentQuestionIndex] ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
            </button>
            {/* {console.log(quizData[currentQuestionIndex]._id)} */}

            {showExplanation[currentQuestionIndex] && (
              <div className="mt-4 text-gray-700 text-sm md:text-base space-y-3">
                {/* Answer Section */}
                <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 rounded-md px-3 py-2 shadow-sm">
                  <span className="font-semibold text-green-800">
                    Answer: <br />
                    <span className="text-green-700 font-bold px-1 py-1 rounded-md shadow-sm">
                      {currentQuestion.correctAnswer}
                    </span>
                  </span>
                </div>

                {/* Explanation Section */}
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-md px-3 py-2 shadow-sm">
                  <strong className="text-blue-700">Explanation:</strong>
                  <p className="mt-1 whitespace-pre-line leading-relaxed text-gray-700">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {currentQuestionIndex === quizData.length - 1 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-12 py-2 bg-gradient-to-b from-emerald-600 to-emerald-800 text-white rounded items-center"
                disabled={isSubmitting} // Disable button when submitting
              >
                {isSubmitting ? (
                  <TailSpin color="#fff" height={20} width={20} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          )}
          <div className="mt-2">
            <QuestionFeedback questionId={quizData[currentQuestionIndex]._id} />
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
          {/* Dynamic Score Display */}
          <p
            className={`text-base font-bold my-4 py-2 px-4 text-center rounded-full shadow-sm ${
              score >= quizData.length * 0.7
                ? "bg-green-100 text-green-700"
                : score >= quizData.length * 0.4
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            🎯 Your Score: {calculateScore()} / {quizData.length}
          </p>
          {quizData.map((question, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-300"
            >
              <p className="font-semibold text-gray-700">{`Question ${
                index + 1
              }: ${question.questionText}`}</p>
              <p
                className={`text-${
                  selectedAnswers[index] === question.correctAnswer
                    ? "green"
                    : "red"
                }-700 my-2`}
              >
                {/* {`Your Answer: ${selectedAnswers[index]}`} */}
                {selectedAnswers[index] === question.correctAnswer
                  ? "✅"
                  : "❌"}{" "}
                Your Answer: {selectedAnswers[index] || "Not Attempted"}
              </p>
              {selectedAnswers[index] !== question.correctAnswer && (
                <p className="text-green-800 font-semibold">{`Correct Answer: ${question.correctAnswer}`}</p>
              )}
              <button
                onClick={() => toggleExplanation(index)}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500  hover:from-blue-500 hover:to-cyan-500 text-white rounded flex items-center"
              >
                {showExplanation[index]
                  ? "Hide Explanation"
                  : "Show Explanation"}
                {showExplanation[index] ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </button>
              {showExplanation[index] && (
                <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-md shadow-inner transition-all duration-300 ease-in-out">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    <strong className="text-blue-700">Explanation:</strong>{" "}
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto">
            {/* Review Again Button */}
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transform  flex items-center gap-2"
            >
              <MdPreview className="text-xl" />
              <span>Review Again</span>
            </button>

            {/* Take Another Quiz Button */}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg hover:from-rose-500 hover:to-pink-500 transform flex items-center gap-2"
            >
              <IoReload className="text-xl" />
              <span>Take Another Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

QuizComponent.propTypes = {
  userId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
  topicId: PropTypes.string,
};

export default QuizComponent;
