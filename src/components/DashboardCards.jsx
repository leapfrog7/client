import { useMemo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IoMdDoneAll } from "react-icons/io";
import { BiReset } from "react-icons/bi";
import { FaRegClipboard } from "react-icons/fa6";

const DashboardCard = ({
  title = "Untitled",
  progress = "0",
  path = "#",
  attemptedQuestions = 0,
  topicId,
  avgPercent = null,
  avgAttempts = 0,
  avgLoading = false,
  onReset,
  isResetting = false,
}) => {
  const progressValue = useMemo(() => {
    const parsed = Number(progress);
    if (Number.isNaN(parsed)) return 0;
    return Math.max(0, Math.min(100, parsed));
  }, [progress]);

  const canReset = Boolean(topicId && onReset) && !isResetting;

  const getProgressColor = () => {
    if (progressValue <= 30) {
      return { path: "#f87171", text: "text-red-700", bg: "bg-red-100" };
    }
    if (progressValue <= 70) {
      return { path: "#facc15", text: "text-yellow-700", bg: "bg-yellow-100" };
    }
    return { path: "#10b981", text: "text-green-700", bg: "bg-green-100" };
  };

  const { path: pathColor, text: textColor, bg: bgColor } = getProgressColor();

  const avgValue =
    avgPercent == null ? null : Math.max(0, Math.min(100, Number(avgPercent)));

  const avgColor =
    avgValue == null
      ? "bg-gray-300"
      : avgValue > 60
        ? "bg-green-500"
        : avgValue > 40
          ? "bg-yellow-400"
          : "bg-red-400";

  const avgWidth = avgValue == null ? "0%" : `${avgValue}%`;

  return (
    <div className="bg-white p-2 rounded-lg shadow-md flex flex-col items-center">
      <h3 className="text-base md:text-lg font-semibold mb-4 text-center text-gray-600">
        {title}
      </h3>

      <div className="w-16 h-16 mb-3">
        <CircularProgressbar
          value={progressValue}
          text={`${progressValue}%`}
          styles={buildStyles({
            textSize: "22px",
            pathColor,
            textColor: "#000",
            trailColor: "#ddd",
          })}
        />
      </div>

      <p
        className={`flex items-center justify-center gap-1 ${bgColor} p-2 rounded-lg text-xs md:text-sm text-center border border-gray-200 ${textColor}`}
      >
        <span>Attempted Qs:</span>
        <span className="flex items-center gap-1">
          {attemptedQuestions} <IoMdDoneAll />
        </span>
      </p>

      <div className="mt-4 w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] md:text-xs text-gray-600">
            Average score
          </span>
          <span className="text-[11px] md:text-xs text-gray-700">
            {avgLoading
              ? "…"
              : avgValue == null
                ? "—"
                : `${avgValue.toFixed(1)}%`}
            <span className="ml-1 text-[10px] text-gray-500">
              {avgLoading ? "" : `(${avgAttempts}×)`}
            </span>
          </span>
        </div>

        <div
          role="img"
          aria-label={
            avgLoading
              ? "Loading average score"
              : avgValue == null
                ? "No attempts yet"
                : `Average score ${avgValue}% based on ${avgAttempts} attempts`
          }
          title={
            avgValue == null
              ? "Your average will appear after your first attempt"
              : `Average score: ${avgValue}%`
          }
          className="relative h-2.5 rounded-full bg-gray-200 overflow-hidden"
        >
          <div
            className={`h-full transition-[width] duration-500 ${avgColor}`}
            style={{ width: avgWidth }}
          />

          <div
            className="pointer-events-none absolute inset-y-0 right-0 bg-gray-100/30"
            style={{ left: "60%" }}
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-0">
            <span className="absolute top-0 bottom-0 left-[60%] w-px bg-gray-100/30" />
          </div>
        </div>

        {!avgLoading && avgValue == null && (
          <div className="mt-1 text-[10px] md:text-xs text-gray-500">
            Take a quiz to start seeing your average.
          </div>
        )}
      </div>

      <div className="flex flex-col w-full gap-2 md:gap-4 my-4">
        <Link
          to={path}
          className="inline-flex items-center justify-center text-sky-800 bg-gradient-to-r from-cyan-100 to-blue-100 hover:bg-gradient-to-bl focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2.5 text-center transition-all duration-300 ease-in-out border border-sky-800"
        >
          Take Quiz <FaRegClipboard className="ml-1" />
        </Link>

        <button
          onClick={() => onReset?.(topicId, title)}
          disabled={!canReset}
          className={`inline-flex items-center justify-center font-medium rounded-md text-sm px-4 py-2.5 text-center transition-all duration-300 ease-in-out border ${
            canReset
              ? "text-gray-700 bg-zinc-100  hover:bg-gray-50"
              : "text-gray-400 bg-gray-100  cursor-not-allowed"
          }`}
          title={
            !topicId || !onReset
              ? "Reset unavailable for this topic right now"
              : "Reset topic progress"
          }
        >
          {isResetting ? "Resetting..." : "Reset"}
          <BiReset className="text-lg ml-1" />
        </button>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string,
  progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  path: PropTypes.string,
  attemptedQuestions: PropTypes.number,
  topicId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  avgPercent: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
  avgAttempts: PropTypes.number,
  avgLoading: PropTypes.bool,
  onReset: PropTypes.func,
  isResetting: PropTypes.bool,
};

export default DashboardCard;
