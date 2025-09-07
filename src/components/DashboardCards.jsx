import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IoMdDoneAll } from "react-icons/io";
import { BiReset } from "react-icons/bi";
import { FaRegClipboard } from "react-icons/fa6";
import axios from "axios";

const DashboardCard = ({
  userId,
  title = "Untitled",
  progress = "0",
  path = "#",
  attemptedQuestions = 0,
  topicId,
}) => {
  useEffect(() => {
    console.log(
      `🆕 Rendering ${title} - Progress: ${progress}, Attempted: ${attemptedQuestions}`
    );
  }, [progress, attemptedQuestions]);

  const [loading, setLoading] = useState(false);
  const [avgLoading, setAvgLoading] = useState(true);
  const [avgPercent, setAvgPercent] = useState(null); // null = no attempts
  const [avgAttempts, setAvgAttempts] = useState(0);
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1";
  // ✅ Ensure progress is a valid number
  const progressValue = parseFloat(progress) || 0;

  // Fetch average score for this topic (per user)
  useEffect(() => {
    if (!userId || !topicId) return;
    const token = localStorage.getItem("jwtToken");
    let cancelled = false;

    (async () => {
      try {
        setAvgLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/quiz/topicAverage/${userId}/${topicId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (cancelled) return;
        setAvgPercent(
          typeof data?.avgPercent === "number" ? data.avgPercent : null
        );
        setAvgAttempts(data?.attempts || 0);
      } catch (e) {
        if (!cancelled) {
          setAvgPercent(null);
          setAvgAttempts(0);
        }
      } finally {
        if (!cancelled) setAvgLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, topicId]);

  // ✅ Define colors based on progress percentage
  const getProgressColor = () => {
    if (progressValue <= 30)
      return { path: "#f87171", text: "text-red-700", bg: "bg-red-100" }; // 🔴 Low progress (Red)
    if (progressValue <= 70)
      return { path: "#facc15", text: "text-yellow-700", bg: "bg-yellow-100" }; // 🟡 Medium (Yellow)
    return { path: "#10b981", text: "text-green-700", bg: "bg-green-100" }; // 🟢 High (Green)
  };

  const { path: pathColor, text: textColor, bg: bgColor } = getProgressColor();

  // ✅ Function to reset progress for this topic
  const handleReset = async () => {
    if (
      !window.confirm(`Are you sure you want to reset progress for "${title}"?`)
    )
      return;
    const token = localStorage.getItem("jwtToken"); // ✅ Retrieve token

    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }
    setLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/quiz/resetProgress/${userId}/${topicId}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Added Authentication Header
        }
      );
      //onReset(topicId); // ✅ Notify Dashboard to update UI
      window.location.reload(); // ✅ Reload the page
    } catch (error) {
      console.error("❌ Error resetting progress:", error);
      alert("Failed to reset progress. Please try again.");
    } finally {
      console.log(
        `Rendering ${title} - Progress: ${progress}, Attempted: ${attemptedQuestions}`
      );
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold mb-4 text-center text-gray-500">
        {title}
      </h3>

      {/* Circular Progress Bar */}
      <div className="w-16 h-16 mb-2">
        <CircularProgressbar
          value={progressValue}
          text={`${progressValue}%`}
          styles={buildStyles({
            textSize: "22px",
            pathColor: pathColor, // Dynamically set progress bar color
            textColor: "#000",
            trailColor: "#ddd",
          })}
        />
      </div>

      {/* Attempted Questions */}
      <p
        className={`flex items-center justify-center gap-1 ${bgColor} p-2 rounded-lg text-xs md:text-sm text-center border border-gray-200 ${textColor}`}
      >
        <span>Attempted Qs:</span>
        <span className="flex items-center gap-1">
          {attemptedQuestions} <IoMdDoneAll />
        </span>
      </p>

      {/* Average Score chip */}
      {/* Average Score meter */}

      <div className="flex flex-col 2xl:flex-row gap-3 my-4">
        {/* Reset Progress Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="inline-flex items-center justify-center text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-red-300 font-medium rounded-md text-sm px-4 py-2.5 text-center transition-all duration-300 ease-in-out"
        >
          {loading ? "Resetting..." : "Reset  "}{" "}
          <BiReset className="text-lg ml-1" />
        </button>

        {/* Navigation to Quiz Page */}
        <Link
          to={path}
          className="inline-flex items-center justify-center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2.5 text-center transition-all duration-300 ease-in-out"
          style={{ height: "40px" }} // ✅ Ensures height consistency
        >
          Take Quiz <FaRegClipboard className="ml-1" />
        </Link>
      </div>
      {/* Average Score meter */}
      <div className="mt-2 w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] md:text-xs text-gray-600">
            Average score
          </span>
          <span className="text-[11px] md:text-xs text-gray-700">
            {avgLoading
              ? "…"
              : avgPercent == null
              ? "—"
              : `${Number(avgPercent).toFixed(1)}%`}
            <span className="ml-1 text-[10px] text-gray-500">
              {avgLoading ? "" : `(${avgAttempts}×)`}
            </span>
          </span>
        </div>

        {(() => {
          // ✅ robust numeric handling
          const val =
            avgPercent == null
              ? null
              : Math.max(0, Math.min(100, Number(avgPercent))); // clamp 0–100

          // ✅ discrete color by thresholds
          const color =
            val == null
              ? "bg-gray-300"
              : val > 60
              ? "bg-green-500"
              : val > 40
              ? "bg-yellow-400"
              : "bg-red-400";

          const width = val == null ? "0%" : `${val}%`;

          return (
            <div
              role="img"
              aria-label={
                avgLoading
                  ? "Loading average score"
                  : val == null
                  ? "No attempts yet"
                  : `Average score ${val}% based on ${avgAttempts} attempts`
              }
              title={
                val == null
                  ? "Your average will appear after your first attempt"
                  : `Average score: ${val}%`
              }
              className="relative h-2.5 rounded-full bg-gray-200 overflow-hidden"
            >
              {/* fill */}
              <div
                className={`h-full transition-[width] duration-500 ${color}`}
                style={{ width }}
              />

              {/* goal zone from 60% */}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 bg-gray-100/30"
                style={{ left: "60%" }}
                aria-hidden
              />

              {/* tick at 60% */}
              <div className="pointer-events-none absolute inset-0">
                <span className="absolute top-0 bottom-0 left-[60%] w-px bg-gray-100/30" />
              </div>
            </div>
          );
        })()}

        {!avgLoading && avgPercent == null && (
          <div className="mt-1 text-[10px] md:text-xs text-gray-500">
            Take a quiz to start seeing your average.
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Prop Validation
DashboardCard.propTypes = {
  userId: PropTypes.string,
  title: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  path: PropTypes.string,
  attemptedQuestions: PropTypes.number,
  topicId: PropTypes.string,
  onReset: PropTypes.func,
};

export default DashboardCard;
