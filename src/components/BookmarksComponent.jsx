import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const BookmarkComponent = ({ userId, topicId }) => {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  const token = localStorage.getItem("jwtToken");

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
          params: { userId, topicId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //console.log(response.data);
        const topicBookmark = response.data.bookmarks.find(
          (bookmark) => bookmark.topic._id === topicId
        );
        if (topicBookmark) {
          setBookmarkedQuestions(topicBookmark.questions);
        } else {
          setBookmarkedQuestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        setError("Failed to fetch bookmarks");
      } finally {
        setLoading(false);
      }
    };

    if (userId && topicId) {
      fetchBookmarks();
    }
  }, [userId, topicId]);

  const toggleExpand = (questionId) => {
    if (expandedQuestionId === questionId) {
      setExpandedQuestionId(null);
    } else {
      setExpandedQuestionId(questionId);
    }
  };

  if (loading) {
    return <div>Loading bookmarks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (bookmarkedQuestions.length === 0) {
    return <div>No bookmarks available for this topic.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-bold mb-4 w-full text-center text-gray-800">
          Bookmarked Questions
        </h2>
        {bookmarkedQuestions.map((question, index) => (
          <div
            key={index}
            className="mb-4 text-sm md:text-base shadow-lg rounded-lg p-4 bg-white"
          >
            <p
              className=" cursor-pointer"
              onClick={() => toggleExpand(question._id)}
            >
              {`Question ${index + 1}: ${question.questionText}`}
            </p>
            {expandedQuestionId === question._id && (
              <div className="mt-2">
                {question.options.map((option, i) => (
                  <p key={i} className="text-gray-700">
                    {option}
                  </p>
                ))}
                <p className="mt-2 text-gray-700">
                  <span className="text-green-800 font-semibold">
                    {`Correct Answer: ${question.correctAnswer}`}
                  </span>
                  <br />
                  <br />
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

BookmarkComponent.propTypes = {
  userId: PropTypes.string.isRequired,
  topicId: PropTypes.string.isRequired,
};

export default BookmarkComponent;
