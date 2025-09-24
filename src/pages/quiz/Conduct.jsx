import Tabs from "../../components/Tabs";
import useAuthGuard from "../../assets/useAuthGuard";
import PropTypes from "prop-types";
import TopicHeading from "../../components/TopicHeading";

Conduct.propTypes = {
  progress: PropTypes.string,
  quizAttempted: PropTypes.string,
};

export default function Conduct({ progress, quizAttempted }) {
  const userId = useAuthGuard(); // <- handles all redirects/expiry

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <TopicHeading
        topicName={"Conduct Rules"}
        progress={progress}
        quizAttempted={quizAttempted}
      />
      <Tabs userId={userId} topicName={"Conduct_Rules"} />
    </div>
  );
}
