import PropTypes from "prop-types";

TopicHeading.propTypes = {
  topicName: PropTypes.string,
  quizAttempted: PropTypes.string,
  progress: PropTypes.string,
};

export default function TopicHeading({ topicName, quizAttempted, progress }) {
  return (
    <div className="bg-slate-100 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-2 justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold text-blue-800 text-center">
        {topicName}
      </h1>
      <div className="flex flex-col md:flex-row gap-2 md:gap-8 justify-between items-center">
        <div className="flex text-sm md:text-base items-center gap-2">
          <span className="text-sm md:text-base">Attempted Questions: </span>
          <span className=" font-semibold text-gray-700 text-sm md:text-base  rounded-lg text-center">
            {quizAttempted}
          </span>
        </div>
        <div className="flex text-sm md:text-base items-center gap-2">
          <span className="text-sm md:text-base">Progress: </span>
          <span className=" font-semibold text-gray-700 text-sm md:text-base px-2 py-1 rounded-lg text-center">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
