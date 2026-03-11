import { useState } from "react";
import QuestionFeedback from "./QuestionFeedbackManagement";
import GeneralFeedback from "./GeneralFeedbackManagement";

const FeedbackManagement = () => {
  const [tab, setTab] = useState("question");

  // Display preferences for Question Feedback table
  const [clampQuestions, setClampQuestions] = useState(true);
  const [dense, setDense] = useState(false);

  return (
    <div className="p-3 md:p-4">
      {/* Header row */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Feedback Management
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Review question-level feedback and general suggestions.
          </p>
        </div>

        {/* Tabs */}
        <div className="inline-flex w-full md:w-auto rounded-2xl border bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setTab("question")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${
              tab === "question"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Question Feedback
          </button>
          <button
            type="button"
            onClick={() => setTab("general")}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${
              tab === "general"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            General Feedback
          </button>
        </div>
      </div>

      {/* Display controls (only for question tab) */}
      {tab === "question" && (
        <div className="mb-4 rounded-2xl border bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="text-sm font-semibold text-gray-800">
              Display options
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <label className="inline-flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={clampQuestions}
                  onChange={() => setClampQuestions((v) => !v)}
                />
                Clamp questions (3 lines)
              </label>

              <label className="inline-flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={dense}
                  onChange={() => setDense((v) => !v)}
                />
                Dense rows
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="p-3 md:p-4">
          {tab === "question" ? (
            <QuestionFeedback clampQuestions={clampQuestions} dense={dense} />
          ) : (
            <GeneralFeedback />
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
