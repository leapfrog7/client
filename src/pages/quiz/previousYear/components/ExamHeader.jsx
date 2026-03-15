import PropTypes from "prop-types";
import { FaCalendarAlt, FaFileAlt } from "react-icons/fa";
import Timer from "../Timer";

export default function ExamHeader({ currentPaper, remainingTime }) {
  return (
    <div className=" w-full rounded-lg bg-gradient-to-br from-emerald-50 via-white to-sky-100">
      <div className="px-3 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm">
            <FaCalendarAlt className="mr-2 text-slate-500" />
            <span>{currentPaper.year}</span>
          </div>

          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm sm:text-sm">
            <FaFileAlt className="mr-2 text-slate-500" />
            <span>{currentPaper.paperType}</span>
          </div>
          <p className=" text-sm text-slate-600 p-1">
            Your exam is currently in progress{" "}
            <span className="animate-pulse text-red-600">𖥠</span>
          </p>
        </div>

        <div className="md:flex md:flex-col md:gap-2 items-center justify-center mt-1 px-3 py-4 sm:px-4 sm:py-5 md:bg-gradient-to-r from-pink-50/30 to-violet-50/30 md:w-1/3 md:mx-auto md:rounded-lg">
          <div className=" mb-3 text-center">
            <p className=" text-xs md:text-sm font-semibold tracking-wide text-slate-800">
              Time Remaining
            </p>
          </div>

          <Timer duration={remainingTime} />
        </div>
      </div>
    </div>
  );
}

ExamHeader.propTypes = {
  currentPaper: PropTypes.shape({
    year: PropTypes.string,
    paperType: PropTypes.string,
  }).isRequired,
  remainingTime: PropTypes.number.isRequired,
};
