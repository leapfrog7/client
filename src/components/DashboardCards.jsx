import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IoMdDoneAll } from "react-icons/io";

const DashboardCard = ({
  title = "Untitled",
  progress = "0",
  path = "#",
  attemptedQuestions = 0,
}) => {
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

  return (
    <Link
      to={path}
      className={`bg-white p-4 rounded-lg shadow-md flex flex-col items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-t from-white to-gray-100`}
    >
      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold mb-4 text-center">
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
        className={`flex items-center justify-center gap-1 ${bgColor} p-2 rounded-lg text-xs md:text-sm text-center ${textColor}`}
      >
        <span>Attempted Qs:</span>
        <span className="flex items-center gap-1">
          {attemptedQuestions} <IoMdDoneAll />
        </span>
      </p>
    </Link>
  );
};

// ✅ Prop Validation
DashboardCard.propTypes = {
  title: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  path: PropTypes.string,
  attemptedQuestions: PropTypes.number,
};

export default DashboardCard;
