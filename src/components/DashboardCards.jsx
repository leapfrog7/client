import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { IoMdDoneAll } from "react-icons/io";

const DashboardCard = ({
  title,
  progress,
  path,
  attemptedQuestions,
  bgColor,
  textColor,
}) => {
  return (
    <Link
      to={path}
      className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center hover:bg-gradient-to-t from-slate-50 to-yellow-50"
    >
      <h3 className="text-base md:text-lg font-semibold mb-4">{title}</h3>
      <div className="w-16 h-16 mb-2 ">
        <CircularProgressbar
          value={parseFloat(progress)}
          text={`${progress}%`}
          styles={buildStyles({
            textSize: "22px",
            pathColor: "#220790",
            textColor: "#000",
            trailColor: "#ddd",
          })}
        />
      </div>
      <p
        className={`${bgColor} p-2 rounded-lg text-xs md:text-sm text-center flex items-center justify-center space-x-1 ${textColor}`}
      >
        <span>Attempted Qs-</span>
        <span className="items-center space-x-1">
          <span className="flex items-center gap-1">
            {attemptedQuestions ? (
              <>
                {attemptedQuestions} <IoMdDoneAll />
              </>
            ) : (
              0
            )}
          </span>
        </span>
      </p>
    </Link>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string,
  progress: PropTypes.string,
  path: PropTypes.string,
  attemptedQuestions: PropTypes.number,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};

export default DashboardCard;
