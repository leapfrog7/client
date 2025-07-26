import { useState } from "react";
import QuestionFeedback from "./QuestionFeedbackManagement"; // your current logic extracted
import GeneralFeedback from "./GeneralFeedbackManagement";

const FeedbackManagement = () => {
  const [tab, setTab] = useState("question");

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            tab === "question"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTab("question")}
        >
          Question Feedback
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "general"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setTab("general")}
        >
          General Feedback
        </button>
      </div>

      {tab === "question" ? <QuestionFeedback /> : <GeneralFeedback />}
    </div>
  );
};

export default FeedbackManagement;
