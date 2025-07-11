import Tabs from "../../components/Tabs";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import TopicHeading from "../../components/TopicHeading";

TARules.propTypes = {
  progress: PropTypes.string,
  quizAttempted: PropTypes.string,
};

export default function TARules({ progress, quizAttempted }) {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    getUserId();
  }, []);

  function getUserId() {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        console.log(decodedToken, currentTime);
        if (decodedToken.exp < currentTime) {
          // Check if the token is expired
          console.log("Token expired");
          localStorage.removeItem("jwtToken");
          navigate("/pages/TokenExpired");
        } else {
          console.log(decodedToken.userId);
          setUserId(decodedToken.userId);
        }
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("jwtToken");
      }
    } else {
      console.log("User is logged out");
      navigate("/pages/NotLoggedIn");
    }
  }

  return (
    <div className="w-11/12 md:w-10/12 mx-auto mt-2">
      <TopicHeading
        topicName={"TA Rules"}
        progress={progress}
        quizAttempted={quizAttempted}
      />
      <Tabs userId={userId} topicName={"TA_Rules"} />
    </div>
  );
}
