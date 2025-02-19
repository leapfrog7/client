import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const reactions = [
  { label: "Helpful", emoji: "👍" },
  { label: "Confusing", emoji: "🤔" },
  { label: "Needs More Info", emoji: "❓" },
  { label: "Too Easy", emoji: "😴" },
  { label: "Challenging", emoji: "💡" },
];

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";

const QuestionFeedback = ({ questionId }) => {
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [errorReported, setErrorReported] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [firstSubmissionSuccess, setFirstSubmissionSuccess] = useState(false);

  // Get userId from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error("Failed to decode JWT token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  // Fetch feedback state for the current question
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!userId || !questionId) return;

      try {
        const response = await fetch(
          `${BASE_URL}/quiz/QuestionFeedback?userId=${userId}&questionId=${questionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );

        const data = await response.json();
        if (data.feedback) {
          setSelectedReaction(data.feedback.reaction || null);
          setErrorReported(data.feedback.error?.isError || false);
          setErrorText(data.feedback.error?.description || "");
          setFeedbackSubmitted(true);
        } else {
          setSelectedReaction(null);
          setErrorReported(false);
          setErrorText("");
          setFeedbackSubmitted(false);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, [questionId, userId]);

  // Handle reaction selection and submit feedback immediately
  const handleReactionClick = async (reaction) => {
    setSelectedReaction(reaction);

    const feedbackData = {
      questionId,
      reaction,
      error: {
        isError: errorReported,
        description: errorText,
      },
      userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/quiz/QuestionFeedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) throw new Error("Failed to submit feedback");

      // Show success message for the first submission
      setFirstSubmissionSuccess(true);
      setTimeout(() => {
        setFirstSubmissionSuccess(false);
        setFeedbackSubmitted(true);
      }, 1);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  const handleReportError = () => {
    setErrorReported(!errorReported);
    if (!errorReported) setErrorText("");
  };

  const handleSubmitError = async () => {
    if (errorReported && errorText.trim() === "") {
      alert("Please provide a description for the error.");
      return;
    }

    setIsSubmitting(true);

    const feedbackData = {
      questionId,
      reaction: selectedReaction,
      error: {
        isError: errorReported,
        description: errorText,
      },
      userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/quiz/QuestionFeedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) throw new Error("Failed to submit error feedback");

      alert("Error feedback submitted successfully!");
      setErrorReported(false);
      setErrorText("");
    } catch (error) {
      console.error("Error submitting error feedback:", error);
      alert("Failed to submit error feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner flex flex-col items-center space-y-4">
      <h3 className="text-gray-800 text-base font-semibold">Your Feedback</h3>

      {firstSubmissionSuccess ? (
        <div className="text-green-600 font-semibold">
          🎯 Feedback submitted !
        </div>
      ) : feedbackSubmitted ? (
        <div className="text-blue-600 font-semibold">
          ✅ Feedback submitted !
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          {reactions.map((reaction) => (
            <button
              key={reaction.label}
              onClick={() => handleReactionClick(reaction.label)}
              className={`px-2 md:px-4 py-2 rounded-lg border-2 transition-transform transform focus:outline-none text-xs md:text-sm lg:text-base ${
                selectedReaction === reaction.label
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              <span className="text-sm md:text-lg">{reaction.emoji}</span>{" "}
              {reaction.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleReportError}
        className={`flex items-center gap-2 text-xs md:text-sm lg:text-base px-4 py-2 rounded-lg border transition-all ${
          errorReported
            ? "bg-red-500 text-white border-red-500"
            : "bg-red-100 text-red-500 border-red-300"
        } hover:bg-red-600 hover:text-white`}
      >
        <FaExclamationTriangle />{" "}
        {errorReported ? "Cancel Error Report" : "Report Error"}
      </button>

      {errorReported && (
        <>
          <textarea
            className="w-full p-2 mt-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
            placeholder="Describe the issue with this question..."
            value={errorText}
            onChange={(e) => setErrorText(e.target.value)}
            maxLength={300}
          />
          <button
            onClick={handleSubmitError}
            disabled={isSubmitting}
            className="px-6 py-2 mt-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Error"}
          </button>
        </>
      )}
    </div>
  );
};

QuestionFeedback.propTypes = {
  questionId: PropTypes.string,
};

export default QuestionFeedback;
