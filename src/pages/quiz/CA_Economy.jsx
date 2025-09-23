import Tabs from "../../components/Tabs";

import PropTypes from "prop-types";
import TopicHeading from "../../components/TopicHeading";
import useAuthGuard from "../../assets/useAuthGuard";

CA_Economy.propTypes = {
  progress: PropTypes.string,
  quizAttempted: PropTypes.string,
};

export default function CA_Economy({ progress, quizAttempted }) {
  const userId = useAuthGuard(); // <- handles all redirects/expiry
  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <TopicHeading
        topicName="Economy"
        progress={progress}
        quizAttempted={quizAttempted}
      />
      <Tabs userId={userId} topicName="CA_Economy" />
    </div>
  );
}
