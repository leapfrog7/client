import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export default function PageFeedback({ pageSlug }) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("Suggestion");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null); // "up" | "down" | null
  const [dismissed, setDismissed] = useState(false);

  //   const [visible, setVisible] = useState(true);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
  //   const BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    if (feedbackGiven) {
      const timer = setTimeout(() => {
        setDismissed(true); // Hides the entire feedback module
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [feedbackGiven]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setName(decoded.name || "");
        setEmail(decoded.email || "");
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleThumbsUp = async () => {
    try {
      setSubmitting(true);
      await axios.post(`${BASE_URL}/generalFeedback`, {
        page: pageSlug,
        category: "Praise",
        message: "This page was helpful.",
      });
      setFeedbackGiven(true);
    } catch (err) {
      alert("Error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleThumbsDown = () => {
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert("Please enter your suggestion or complaint.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`${BASE_URL}/generalFeedback`, {
        page: pageSlug,
        category,
        message,
        name: name.trim() || undefined,
        email: email.trim() || undefined,
      });
      setFeedbackGiven(true);
    } catch (err) {
      alert("Error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  if (dismissed) return null;

  if (feedbackGiven) {
    return (
      <div className="mt-6 bg-green-50 border border-green-300 text-green-800 p-4 rounded text-sm">
        ✅ Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded shadow-sm ">
      <div className="flex gap-3 items-center">
        <p className="text-sm text-blue-900 mb-3">
          Did you find this page helpful?
        </p>

        {/* Thumbs Options */}
        <div className="flex gap-6 text-2xl text-blue-600 mb-3">
          <button
            onClick={() => {
              setSelected("up");
              handleThumbsUp();
            }}
            disabled={submitting}
            title="Yes"
            className={`text-2xl transition-transform hover:scale-110 ${
              selected === "up" ? "text-blue-800" : "text-gray-500"
            }`}
          >
            {selected === "up" ? <FaThumbsUp /> : <FaRegThumbsUp />}
          </button>

          <button
            onClick={() => {
              setSelected("down");
              handleThumbsDown();
            }}
            disabled={submitting}
            title="No"
            className={`text-2xl transition-transform hover:scale-110 ${
              selected === "down" ? "text-blue-800" : "text-gray-500"
            }`}
          >
            {selected === "down" ? <FaThumbsDown /> : <FaRegThumbsDown />}
          </button>
        </div>
      </div>

      {/* Conditional Form */}
      {showForm && (
        <div className="mt-4 flex flex-col gap-3 relative">
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Suggestion"
                checked={category === "Suggestion"}
                onChange={(e) => setCategory(e.target.value)}
              />
              Suggestion
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Complaint"
                checked={category === "Complaint"}
                onChange={(e) => setCategory(e.target.value)}
              />
              Complaint
            </label>
          </div>

          <textarea
            placeholder="Tell us how we can improve..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded text-sm"
          />

          <div className="flex flex-col sm:flex-row gap-2 text-sm">
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-between gap-2 mt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm self-start"
            >
              🚀 Submit
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setCategory("Suggestion");
                setMessage("");
                setSelected(false);
              }}
              className="px-4 py-1 text-sm rounded border border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

PageFeedback.propTypes = {
  pageSlug: PropTypes.string.isRequired,
};
