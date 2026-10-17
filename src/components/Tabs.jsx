import { SERVER_ORIGIN } from "../util/serverConfig.js";
const BASE_URL = (SERVER_ORIGIN + "/api/v1"); //This is the Server Base URL
import { useState, useEffect } from "react";
import QuizComponent from "./QuizComponent";
import axios from "axios";
import PropTypes from "prop-types";
import BookmarksComponent from "./BookmarksComponent";
import { QuizSkeleton } from "./quiz/QuizStateViews";

const Tabs = ({ userId, topicName }) => {
  const [activeTab, setActiveTab] = useState("quiz");
  const [topicId, setTopicId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("jwtToken");
  // const BASE_URL = "http://localhost:5000/api/v1";

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    let cancelled = false;
    setTopicId(null);
    setError("");
    if (!userId || !token) return;

    const fetchTopicId = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/quiz/getTopicId`, {
          params: { topicName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (cancelled) return;
        if (!response.data?.topicId) {
          setError("Topic not found or an error occurred");
          return;
        }
        setTopicId(response.data.topicId);
        setError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching topic ID:", err);
        setError("Topic not found or an error occurred");
        setTopicId(null);
      }
    };
    fetchTopicId();
    return () => {
      cancelled = true;
    };
  }, [topicName, token, userId]);

  return (
    <div className="min-h-screen w-full md:w-4/5 bg-gradient-to-t from-slate-50 to-sky-50 mx-auto">
      <div className="mb-4 flex text-sm md:text-lg">
        <button
          onClick={() => handleTabClick("quiz")}
          className={`w-[50%] py-2  ${
            activeTab === "quiz"
              ? "bg-white text-customBlue font-semibold border border-white border-b-customBlue border-b-4"
              : "bg-white text-gray-500 border border-white border-b-4"
          } `}
        >
          Attempt Quiz
        </button>
        <button
          onClick={() => handleTabClick("bookmarked")}
          className={` w-[50%] py-2 ${
            activeTab === "bookmarked"
              ? "bg-white text-customBlue border font-semibold border-white border-b-customBlue border-b-4"
              : "bg-white text-gray-500 border border-white border-b-4"
          } `}
        >
          My Bookmarks
        </button>
      </div>
      <div>
        {error ? (
          <p role="alert" className="p-4 text-red-700">{error}</p>
        ) : !topicId || !userId ? (
          <QuizSkeleton />
        ) : activeTab === "quiz" ? (
          <QuizComponent
            userId={userId}
            topicName={topicName}
            topicId={topicId}
          />
        ) : (
          <BookmarksComponent userId={userId} topicId={topicId} />
        )}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  userId: PropTypes.string,
  topicName: PropTypes.string,
};

export default Tabs;
