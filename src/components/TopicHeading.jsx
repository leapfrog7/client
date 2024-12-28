// import PropTypes from "prop-types";

// TopicHeading.propTypes = {
//   topicName: PropTypes.string,
//   quizAttempted: PropTypes.string,
//   progress: PropTypes.string,
// };

// export default function TopicHeading({ topicName, quizAttempted, progress }) {
//   return (
//     <div className="bg-slate-100 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-2 justify-between items-center">
//       <h1 className="text-xl md:text-2xl font-bold text-blue-800 text-center">
//         {topicName}
//       </h1>
//       <div className="flex flex-col md:flex-row gap-2 md:gap-8 justify-between items-center">
//         <div className="flex text-sm md:text-base items-center gap-2">
//           <span className="text-sm md:text-base">Attempted Questions: </span>
//           <span className=" font-semibold text-gray-700 text-sm md:text-base  rounded-lg text-center">
//             {quizAttempted}
//           </span>
//         </div>
//         <div className="flex text-sm md:text-base items-center gap-2">
//           <span className="text-sm md:text-base">Progress: </span>
//           <span className=" font-semibold text-gray-700 text-sm md:text-base px-2 py-1 rounded-lg text-center">
//             {progress}%
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
// const BASE_URL = "http://localhost:5000/api/v1";

TopicHeading.propTypes = {
  topicName: PropTypes.string.isRequired,
};

export default function TopicHeading({ topicName }) {
  const [topicId, setTopicId] = useState(null);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    // Decode the JWT token to get the user ID
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("User is not authenticated.");
      return;
    }
    const { userId } = jwtDecode(token);

    // Step 1: Fetch the topic ID based on topic name
    const fetchTopicId = async () => {
      try {
        // This mapping is for matching the topic name which is visible with that of the what is stored in database
        if (topicName == "Conduct Rules") {
          topicName = "Conduct_Rules";
        }

        if (topicName == "CCS CCA Rules") {
          topicName = "CCA_Rules";
        }

        if (topicName == "Pension Rules") {
          topicName = "Pension_Rules";
        }
        if (topicName == "RTI Act") {
          topicName = "RTI_Act";
        }

        if (topicName == "CCS Leave Rules") {
          topicName = "Leave_Rules";
        }
        if (topicName == "Parliamentary Procedure") {
          topicName = "Parliamentary_Procedure";
        }
        if (topicName == "DFPR, 2024") {
          topicName = "DFPR_2024";
        }
        if (topicName == "Office Procedure") {
          topicName = "Office_Procedure";
        }
        if (topicName == "FR") {
          topicName = "FR_SR";
        }
        if (topicName == "Economy") {
          topicName = "CA_Economy";
        }
        if (topicName == "Govt. Schemes") {
          topicName = "CA_Schemes";
        }

        const response = await axios.get(`${BASE_URL}/quiz/getTopicId`, {
          params: { topicName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTopicId(response.data.topicId);
        setError("");
      } catch (err) {
        console.error("Error fetching topic ID:", err);
        setError("Topic not found or an error occurred");
        setTopicId(null);
      }
    };

    // Step 2: Fetch progress data once topicId is available
    const fetchTopicProgress = async (topicId) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/quiz/progress/${userId}/${topicId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAttemptedQuestions(response.data.attemptedQuestions);
        setProgress(response.data.progress);
      } catch (error) {
        console.error("Error fetching topic progress:", error);
      }
    };

    // Fetch topicId first, then fetch progress data if topicId is found
    if (topicName) {
      fetchTopicId();
    }

    if (topicId) {
      fetchTopicProgress(topicId);
    }
  }, [topicName, topicId]);

  return (
    <div className="bg-slate-100 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-2 justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold text-blue-800 text-center">
        {topicName}
      </h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 justify-between items-center">
          <div className="flex text-sm md:text-base items-center gap-2">
            <span className="text-sm md:text-base">Attempted Questions: </span>
            <span className="font-semibold text-gray-700 text-sm md:text-base rounded-lg text-center">
              {attemptedQuestions}
            </span>
          </div>
          <div className="flex text-sm md:text-base items-center gap-2">
            <span className="text-sm md:text-base">Progress: </span>
            <span className="font-semibold text-gray-700 text-sm md:text-base px-2 py-1 rounded-lg text-center">
              {progress}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
