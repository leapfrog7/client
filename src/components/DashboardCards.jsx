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
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1";
  // ✅ Ensure progress is a valid number
  const progressValue = parseFloat(progress) || 0;

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
