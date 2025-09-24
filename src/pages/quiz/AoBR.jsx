import Tabs from "../../components/Tabs";
import useAuthGuard from "../../assets/useAuthGuard";
import PropTypes from "prop-types";
import TopicHeading from "../../components/TopicHeading";

AoBR.propTypes = {
  progress: PropTypes.string,
  quizAttempted: PropTypes.string,
};

export default function AoBR({ progress, quizAttempted }) {
  const userId = useAuthGuard(); // <- handles all redirects/expiry

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <TopicHeading
        topicName={"AoBR"}
        progress={progress}
        quizAttempted={quizAttempted}
      />

      <Tabs userId={userId} topicName={"AoBR"} />
      {/* This topic Name should be exactly same as in MongoDB */}
    </div>
  );
}
