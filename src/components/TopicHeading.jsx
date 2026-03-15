// // // import PropTypes from "prop-types";

// // // TopicHeading.propTypes = {
// // //   topicName: PropTypes.string,
// // //   quizAttempted: PropTypes.string,
// // //   progress: PropTypes.string,
// // // };

// // // export default function TopicHeading({ topicName, quizAttempted, progress }) {
// // //   return (
// // //     <div className="bg-slate-100 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-2 justify-between items-center">
// // //       <h1 className="text-xl md:text-2xl font-bold text-blue-800 text-center">
// // //         {topicName}
// // //       </h1>
// // //       <div className="flex flex-col md:flex-row gap-2 md:gap-8 justify-between items-center">
// // //         <div className="flex text-sm md:text-base items-center gap-2">
// // //           <span className="text-sm md:text-base">Attempted Questions: </span>
// // //           <span className=" font-semibold text-gray-700 text-sm md:text-base  rounded-lg text-center">
// // //             {quizAttempted}
// // //           </span>
// // //         </div>
// // //         <div className="flex text-sm md:text-base items-center gap-2">
// // //           <span className="text-sm md:text-base">Progress: </span>
// // //           <span className=" font-semibold text-gray-700 text-sm md:text-base px-2 py-1 rounded-lg text-center">
// // //             {progress}%
// // //           </span>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { jwtDecode } from "jwt-decode";
// // import PropTypes from "prop-types";

// // const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
// // // const BASE_URL = "http://localhost:5000/api/v1";

// // TopicHeading.propTypes = {
// //   topicName: PropTypes.string.isRequired,
// // };

// // export default function TopicHeading({ topicName }) {
// //   const [topicId, setTopicId] = useState(null);
// //   const [attemptedQuestions, setAttemptedQuestions] = useState(0);
// //   const [progress, setProgress] = useState(0);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     // Decode the JWT token to get the user ID
// //     const token = localStorage.getItem("jwtToken");
// //     if (!token) {
// //       console.error("User is not authenticated.");
// //       return;
// //     }
// //     const { userId } = jwtDecode(token);

// //     // Step 1: Fetch the topic ID based on topic name
// //     const fetchTopicId = async () => {
// //       try {
// //         // This mapping is for matching the topic name which is visible with that of the what is stored in database
// //         if (topicName == "Conduct Rules") {
// //           topicName = "Conduct_Rules";
// //         }

// //         if (topicName == "CCS CCA Rules") {
// //           topicName = "CCA_Rules";
// //         }

// //         if (topicName == "Pension Rules") {
// //           topicName = "Pension_Rules";
// //         }
// //         if (topicName == "RTI Act") {
// //           topicName = "RTI_Act";
// //         }

// //         if (topicName == "CCS Leave Rules") {
// //           topicName = "Leave_Rules";
// //         }
// //         if (topicName == "Parliamentary Procedure") {
// //           topicName = "Parliamentary_Procedure";
// //         }
// //         if (topicName == "DFPR, 2024") {
// //           topicName = "DFPR_2024";
// //         }
// //         if (topicName == "Office Procedure") {
// //           topicName = "Office_Procedure";
// //         }
// //         if (topicName == "FR") {
// //           topicName = "FR_SR";
// //         }
// //         if (topicName == "Economy") {
// //           topicName = "CA_Economy";
// //         }
// //         if (topicName == "Govt. Schemes") {
// //           topicName = "CA_Schemes";
// //         }

// //         const response = await axios.get(`${BASE_URL}/quiz/getTopicId`, {
// //           params: { topicName },
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         setTopicId(response.data.topicId);
// //         setError("");
// //       } catch (err) {
// //         console.error("Error fetching topic ID:", err);
// //         setError("Topic not found or an error occurred");
// //         setTopicId(null);
// //       }
// //     };

// //     // Step 2: Fetch progress data once topicId is available
// //     const fetchTopicProgress = async (topicId) => {
// //       try {
// //         const response = await axios.get(
// //           `${BASE_URL}/quiz/progress/${userId}/${topicId}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }
// //         );
// //         setAttemptedQuestions(response.data.attemptedQuestions);
// //         setProgress(response.data.progress);
// //       } catch (error) {
// //         console.error("Error fetching topic progress:", error);
// //       }
// //     };

// //     // Fetch topicId first, then fetch progress data if topicId is found
// //     if (topicName) {
// //       fetchTopicId();
// //     }

// //     if (topicId) {
// //       fetchTopicProgress(topicId);
// //     }
// //   }, [topicName, topicId]);

// //   return (
// //     <div className="bg-slate-100 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-2 justify-between items-center">
// //       <h1 className="text-xl md:text-2xl font-bold text-blue-800 text-center">
// //         {topicName}
// //       </h1>
// //       {error ? (
// //         <p className="text-red-500">{error}</p>
// //       ) : (
// //         <div className="flex flex-col md:flex-row gap-2 md:gap-8 justify-between items-center">
// //           <div className="flex text-sm md:text-base items-center gap-2">
// //             <span className="text-sm md:text-base">Attempted Questions: </span>
// //             <span className="font-semibold text-gray-700 text-sm md:text-base rounded-lg text-center">
// //               {attemptedQuestions}
// //             </span>
// //           </div>
// //           <div className="flex text-sm md:text-base items-center gap-2">
// //             <span className="text-sm md:text-base">Progress: </span>
// //             <span className="font-semibold text-gray-700 text-sm md:text-base px-2 py-1 rounded-lg text-center">
// //               {progress}%
// //             </span>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import PropTypes from "prop-types";

// const BASE_URL = "https://server-v4dy.onrender.com/api/v1";

// const topicNameMap = {
//   "Conduct Rules": "Conduct_Rules",
//   "CCS CCA Rules": "CCA_Rules",
//   "Pension Rules": "Pension_Rules",
//   "RTI Act": "RTI_Act",
//   "CCS Leave Rules": "Leave_Rules",
//   "Parliamentary Procedure": "Parliamentary_Procedure",
//   "DFPR, 2024": "DFPR_2024",
//   "Office Procedure": "Office_Procedure",
//   FR: "FR_SR",
//   Economy: "CA_Economy",
//   "Govt. Schemes": "CA_Schemes",
//   "TA Rules": "TA_Rules",
//   "NPS Rules": "NPS_Rules",
//   Allowances: "HRA_Rules",
// };

// TopicHeading.propTypes = {
//   topicName: PropTypes.string.isRequired,
// };

// export default function TopicHeading({ topicName }) {
//   const [topicId, setTopicId] = useState(null);
//   const [attemptedQuestions, setAttemptedQuestions] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     if (!token) return;

//     const { userId } = jwtDecode(token);
//     const mappedTopicName = topicNameMap[topicName] || topicName;

//     const fetchTopicId = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/quiz/getTopicId`, {
//           params: { topicName: mappedTopicName },
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTopicId(response.data.topicId);
//         setError("");
//       } catch (err) {
//         console.error("Error fetching topic ID:", err);
//         setError("Topic not found.");
//         setTopicId(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchTopicProgress = async (topicId) => {
//       try {
//         const response = await axios.get(
//           `${BASE_URL}/quiz/progress/${userId}/${topicId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           },
//         );
//         setAttemptedQuestions(response.data.attemptedQuestions);
//         setProgress(response.data.progress);
//       } catch (error) {
//         console.error("Error fetching topic progress:", error);
//       }
//     };

//     if (mappedTopicName) fetchTopicId();
//     if (topicId) fetchTopicProgress(topicId);
//   }, [topicName, topicId]);

//   // ✅ Determine Progress Bar Color
//   const getProgressColor = () => {
//     if (progress < 30) return "bg-rose-400"; // 🔴 Red for <30%
//     if (progress <= 70) return "bg-yellow-300"; // 🟡 Yellow for 30%-70%
//     return "bg-green-300"; // 🟢 Green for >70%
//   };

//   return (
//     <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
//       <h1 className="text-xl md:text-2xl font-bold text-blue-800 text-center">
//         {topicName}
//       </h1>

//       {loading ? (
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <div className="flex gap-4 justify-between items-center">
//           <div className="flex items-center gap-2 text-sm md:text-base">
//             <span>Attempted Questions:</span>
//             <span className="font-bold text-gray-700">
//               {attemptedQuestions}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 text-sm md:text-base">
//             <span>Progress:</span>
//             <div className="w-32 bg-gray-200 rounded-full overflow-hidden relative">
//               <div
//                 className={`${getProgressColor()} h-6 transition-all duration-500`}
//                 style={{ width: `${progress}%` }}
//               ></div>

//               {/* Centered Progress Text */}
//               <div className="absolute inset-0 flex items-center justify-center font-semibold text-gray-800">
//                 {progress}%
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";

const topicNameMap = {
  "Conduct Rules": "Conduct_Rules",
  "CCS CCA Rules": "CCA_Rules",
  "Pension Rules": "Pension_Rules",
  "RTI Act": "RTI_Act",
  "CCS Leave Rules": "Leave_Rules",
  "Parliamentary Procedure": "Parliamentary_Procedure",
  "DFPR, 2024": "DFPR_2024",
  "Office Procedure": "Office_Procedure",
  FR: "FR_SR",
  Economy: "CA_Economy",
  "Govt. Schemes": "CA_Schemes",
  "TA Rules": "TA_Rules",
  "NPS Rules": "NPS_Rules",
  Allowances: "HRA_Rules",
};

const clampPercent = (value) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, Math.min(100, parsed));
};

TopicHeading.propTypes = {
  topicName: PropTypes.string.isRequired,
};

export default function TopicHeading({ topicName }) {
  const [topicId, setTopicId] = useState(null);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);

  const mappedTopicName = useMemo(
    () => topicNameMap[topicName] || topicName,
    [topicName],
  );

  const progressValue = useMemo(() => clampPercent(progress), [progress]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    setTopicId(null);
    setAttemptedQuestions(0);
    setProgress(0);
    setError("");

    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    let cancelled = false;

    const fetchTopicId = async () => {
      try {
        setLoadingTopic(true);

        const response = await axios.get(`${BASE_URL}/quiz/getTopicId`, {
          params: { topicName: mappedTopicName },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cancelled) return;
        setTopicId(response.data?.topicId || null);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching topic ID:", err);
        setError("Topic not found.");
        setTopicId(null);
      } finally {
        if (!cancelled) setLoadingTopic(false);
      }
    };

    fetchTopicId();

    return () => {
      cancelled = true;
    };
  }, [mappedTopicName]);

  useEffect(() => {
    if (!topicId) return;

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    let userId = null;

    try {
      const decoded = jwtDecode(token);
      userId = decoded?.userId;
    } catch (err) {
      console.error("Invalid token:", err);
      setError("Session is invalid. Please sign in again.");
      return;
    }

    if (!userId) {
      setError("User information is missing.");
      return;
    }

    let cancelled = false;

    const fetchTopicProgress = async () => {
      try {
        setLoadingProgress(true);

        const response = await axios.get(
          `${BASE_URL}/quiz/progress/${userId}/${topicId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (cancelled) return;

        setAttemptedQuestions(Number(response.data?.attemptedQuestions) || 0);
        setProgress(clampPercent(response.data?.progress));
        setError("");
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching topic progress:", err);
        setError("Unable to fetch topic progress.");
        setAttemptedQuestions(0);
        setProgress(0);
      } finally {
        if (!cancelled) setLoadingProgress(false);
      }
    };

    fetchTopicProgress();

    return () => {
      cancelled = true;
    };
  }, [topicId]);

  const getProgressColor = () => {
    if (progressValue < 30) return "bg-rose-400";
    if (progressValue <= 70) return "bg-yellow-300";
    return "bg-green-300";
  };

  const isLoading = loadingTopic || loadingProgress;

  return (
    <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4 shadow-md md:flex-row">
      <h1 className="text-center text-xl font-bold text-blue-800 md:text-2xl">
        {topicName}
      </h1>

      {isLoading ? (
        <div
          className="h-8 w-8 animate-spin rounded-full border-t-2 border-blue-500"
          aria-label="Loading topic details"
        />
      ) : error ? (
        <p className="text-sm text-red-500 md:text-base">{error}</p>
      ) : (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <span>Attempted Questions:</span>
            <span className="font-bold text-gray-700">
              {attemptedQuestions}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm md:text-base">
            <span>Progress:</span>
            <div className="relative w-28 overflow-hidden rounded-full bg-gray-200 sm:w-32">
              <div
                className={`${getProgressColor()} h-6 transition-all duration-500`}
                style={{ width: `${progressValue}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-semibold text-gray-800">
                {progressValue}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
