import Tabs from "../../components/Tabs";
import useAuthGuard from "../../assets/useAuthGuard";
import PropTypes from "prop-types";
import TopicHeading from "../../components/TopicHeading";

CCA.propTypes = {
  progress: PropTypes.string,
  quizAttempted: PropTypes.string,
};

export default function CCA({ progress, quizAttempted }) {
  const userId = useAuthGuard(); // <- handles all redirects/expiry

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <TopicHeading
        topicName={"CCS CCA Rules"}
        progress={progress}
        quizAttempted={quizAttempted}
      />
      <Tabs userId={userId} topicName={"CCA_Rules"} />
    </div>
  );
}
