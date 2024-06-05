import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashboardCard = ({ title, progress, path }) => {
  return (
    <Link
      to={path}
      className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center hover:bg-gradient-to-t from-cyan-50 to-gray-50"
    >
      <h3 className="text-base md:text-lg font-semibold mb-4">{title}</h3>
      <div className="w-16 h-16 mb-2 ">
        <CircularProgressbar
          value={parseFloat(progress)}
          text={`${progress}`}
          styles={buildStyles({
            textSize: "22px",
            pathColor: "#220790",
            textColor: "#000",
            trailColor: "#ddd",
          })}
        />
      </div>
    </Link>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string,
  progress: PropTypes.string,
  path: PropTypes.string,
};

export default DashboardCard;
