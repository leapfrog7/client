import { useState, useEffect } from "react";
import Question from "./Question";
import Timer from "./Timer";
import axiosInstance from "../../../components/AxiosInstance";
import { getUserIdFromToken } from "../../../util/decodeJWT";

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [paperId, setPaperId] = useState("");
  const [answers, setAnswers] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [remainingTime, setRemainingTime] = useState(2 * 60 * 60); // Default to 2 hours in seconds
  const [papers, setPapers] = useState([]); // List of available papers with their status
  const [currentPaper, setCurrentPaper] = useState(null); // Currently selected paper

  useEffect(() => {
    // Fetch available papers and their status
    const fetchPapers = async () => {
      try {
        const userId = getUserIdFromToken();
        const response = await axiosInstance.get("/available-papers", {
          params: { userId },
        });
        setPapers(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, []);

  useEffect(() => {
    if (isStarted) {
      const interval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isStarted]);

  useEffect(() => {
    if (remainingTime <= 0) {
      handleSave();
      alert("Time is up!");
    }
  }, [remainingTime]);

  const handleOptionSelect = (option) => {
    setAnswers({
      ...answers,
      [currentPaper.currentQuestionIndex]: option,
    });
  };

  const handleNextQuestion = () => {
    setCurrentPaper({
      ...currentPaper,
      currentQuestionIndex: Math.min(
        currentPaper.currentQuestionIndex + 1,
        questions.length - 1
      ),
    });
  };

  const handlePreviousQuestion = () => {
    setCurrentPaper({
      ...currentPaper,
      currentQuestionIndex: Math.max(currentPaper.currentQuestionIndex - 1, 0),
    });
  };

  const handleStart = async (year, paperType, resume = false) => {
    try {
      const response = await axiosInstance.get(
        `/prev-year-papers/${year}/${paperType}`
      );
      const paper = response.data;
      setQuestions(paper.questions);
      setPaperId(paper._id);
      setIsStarted(true);
      setIsSaved(false);

      if (resume) {
        const userId = getUserIdFromToken();
        console.log(
          "Resuming session with UserId:",
          userId,
          "PaperId:",
          paper._id
        );
        const sessionResponse = await axiosInstance.get(
          `/exam-sessions/${userId}/${paper._id}`
        );
        const { remainingTime, responses } = sessionResponse.data;
        setRemainingTime(remainingTime);
        setAnswers(
          responses.reduce((acc, { questionId, userAnswer }) => {
            const questionIndex = paper.questions.findIndex(
              (q) => q._id === questionId
            );
            if (questionIndex >= 0) {
              acc[questionIndex] = userAnswer;
            }
            return acc;
          }, {})
        );
        setCurrentPaper({
          year: paper.year,
          paperType: paper.paperType,
          currentQuestionIndex: 0,
          remainingTime,
        });
      } else {
        setCurrentPaper({
          year: paper.year,
          paperType: paper.paperType,
          currentQuestionIndex: 0,
          remainingTime: 2 * 60 * 60, // Reset timer for new sessions
        });
      }
    } catch (error) {
      console.error("Error fetching questions or resuming session:", error);
    }
  };

  const handleSave = async () => {
    setIsSaved(true);
    setIsStarted(false);

    const userId = getUserIdFromToken();

    if (!userId || !paperId) {
      console.error("User ID or Paper ID is missing");
      return;
    }

    try {
      const responses = Object.entries(answers).map(
        ([questionIndex, userAnswer]) => ({
          questionId: questions[questionIndex]._id,
          userAnswer,
          isCorrect: questions[questionIndex].correctAnswer === userAnswer,
        })
      );

      const score = responses.reduce((score, response) => {
        if (response.isCorrect) {
          return score + 1.25; // Correct answers are worth 1.25 points each
        } else {
          return score - 1 / 3; // Incorrect answers are penalized 1/3 point each
        }
      }, 0);

      await axiosInstance.post("/exam-sessions", {
        userId,
        paperId,
        startTime: new Date(),
        remainingTime,
        responses,
        score,
      });

      console.log("Session saved");
    } catch (error) {
      console.error("Error saving exam session:", error);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentPaper({
      ...currentPaper,
      currentQuestionIndex: index,
    });
  };

  const renderActions = (paper) => {
    if (paper.session) {
      return (
        <div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => handleStart(paper.year, paper.paperType, true)}
          >
            Resume Quiz
          </button>
        </div>
      );
    } else {
      return (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => handleStart(paper.year, paper.paperType)}
        >
          Start Quiz
        </button>
      );
    }
  };

  return (
    <div className="p-8">
      {!isStarted && (
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paper Type
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {papers.map((paper) => (
                <tr key={`${paper.year}-${paper.paperType}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paper.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {paper.paperType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {renderActions(paper)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isStarted && currentPaper && (
        <div>
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">
              Year: {currentPaper.year}, Paper: {currentPaper.paperType}
            </div>
            <Timer duration={remainingTime} onTimeUp={handleSave} />
          </div>
          <div className="mt-8">
            <Question
              question={
                questions[currentPaper.currentQuestionIndex].questionText
              }
              options={questions[currentPaper.currentQuestionIndex].options}
              onSelectOption={handleOptionSelect}
              selectedOption={answers[currentPaper.currentQuestionIndex]} // Pass selected option
            />
          </div>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={handlePreviousQuestion}
              disabled={currentPaper.currentQuestionIndex === 0}
            >
              Previous Question
            </button>
            <button
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleNextQuestion}
              disabled={
                currentPaper.currentQuestionIndex === questions.length - 1
              }
            >
              Next Question
            </button>
            <button
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleSave}
            >
              Save and Exit
            </button>
          </div>
          <div className="mt-8 max-h-64 overflow-y-auto border-t pt-4">
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`p-2 border rounded ${
                    index === currentPaper.currentQuestionIndex
                      ? "bg-blue-200"
                      : "bg-white"
                  } hover:bg-blue-100`}
                  onClick={() => handleQuestionSelect(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {isSaved && (
        <div>
          <p className="text-lg">
            Your session has been saved. You can resume later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Exam;
