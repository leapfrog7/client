import Tabs from "../../components/Tabs";
import useAuthGuard from "../../assets/useAuthGuard";
import PropTypes from "prop-types";
import TopicHeading from "../../components/TopicHeading";

FR.propTypes = {
  progress: PropTypes.string,
  quizAttempted: PropTypes.string,
};

export default function FR({ progress, quizAttempted }) {
  const userId = useAuthGuard();

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <TopicHeading
        topicName={"FR"}
        progress={progress}
        quizAttempted={quizAttempted}
      />
      <Tabs userId={userId} topicName={"FR_SR"} />
      {/* This topic Name must be as per dbTitle */}
    </div>
  );
}
