// import { useState, useEffect, useMemo } from "react";
// import PropTypes from "prop-types";
// import DashboardCard from "./DashboardCards";
// import DashboardHeader from "./DashBoardHeader";
// import { jwtDecode } from "jwt-decode"; // ✅ Import jwtDecode
// // import axios from "axios";
// // import { FiBarChart2 } from "react-icons/fi";

// const Dashboard = ({ userStats }) => {
//   // ✅ Use default values to prevent errors
//   const paperITopics = useMemo(() => userStats?.paperI || [], [userStats]);
//   const paperIITopics = useMemo(() => userStats?.paperII || [], [userStats]);
//   const [userId, setUserId] = useState(null); // ✅ Store userId
//   const [loading, setLoading] = useState(true); // ✅ Prevent rendering while loading

//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken"); // ✅ Retrieve JWT token
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token); // ✅ Decode token
//         setUserId(decodedToken.userId); // ✅ Extract and store userId
//       } catch (error) {
//         console.error("❌ Invalid token:", error);
//       }
//     }
//     setLoading(false); // ✅ Mark loading as false once processed
//   }, []);

//   if (loading) {
//     return <p>Loading Dashboard...</p>; // ✅ Show loading state while waiting for `userId`
//   }

//   if (!userId) {
//     return <p>Error: User not authenticated</p>; // ✅ Handle missing `userId`
//   }

//   return (
//     <div className="min-h-screen bg-white flex flex-col p-4 mt-2 text-gray-700 md:rounded-md">
//       {/* Dashboard Header */}
//       <DashboardHeader />
//       {/* Paper I Section */}
//       <div className="mb-8 text-center">
//         <h2 className="text-xl md:text-2xl font-extrabold mb-5 border border-l-white border-r-white border-t-black border-b-black bg-gradient-to-r  px-5 py-3 text-red-700  tracking-wide">
//           Paper I
//         </h2>

//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//           {paperITopics.map((topic, index) => (
//             <DashboardCard
//               key={index} // ✅ Use topicId as unique key
//               userId={userId}
//               title={topic.title}
//               progress={parseFloat(topic.progress) || 0} // ✅ Ensure it's a number
//               path={topic.path}
//               topicId={topic.topicId} // ✅ Directly pass topicId
//               attemptedQuestions={topic.attemptedQuestions || 0}
//               bgColor="bg-gradient-to-r from-pink-200 to-rose-100"
//               textColor="text-pink-800"
//             />
//           ))}
//         </div>
//       </div>

//       {/* Paper II Section */}
//       <div className="text-center">
//         <h2 className="text-xl md:text-2xl font-extrabold mb-5 border border-l-white border-r-white border-t-black border-b-black bg-gradient-to-r  px-5 py-3 text-blue-700 tracking-wide ">
//           Paper II
//         </h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//           {paperIITopics.map((topic, index) => (
//             <DashboardCard
//               key={index}
//               userId={userId}
//               title={topic.title}
//               progress={parseFloat(topic.progress) || 0} // ✅ Ensure it's a number
//               path={topic.path}
//               topicId={topic.topicId} // ✅ Directly pass topicId
//               attemptedQuestions={topic.attemptedQuestions || 0}
//               bgColor="bg-gradient-to-r from-purple-100 to-blue-100"
//               textColor="text-purple-800"
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Removed `username` from PropTypes since it's unused
// Dashboard.propTypes = {
//   userStats: PropTypes.shape({
//     paperI: PropTypes.arrayOf(
//       PropTypes.shape({
//         title: PropTypes.string.isRequired,
//         progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//         path: PropTypes.string.isRequired,
//         attemptedQuestions: PropTypes.number, // ✅ No longer marked as required
//       })
//     ),
//     paperII: PropTypes.arrayOf(
//       PropTypes.shape({
//         title: PropTypes.string.isRequired,
//         progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//         path: PropTypes.string.isRequired,
//         attemptedQuestions: PropTypes.number, // ✅ No longer marked as required
//       })
//     ),
//   }),
// };
import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import DashboardCard from "./DashboardCards";
import DashboardHeader from "./DashBoardHeader";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";

const Dashboard = ({ userStats, userId, onStatsUpdate }) => {
  const [resettingTopicId, setResettingTopicId] = useState(null);
  const [avgByTopic, setAvgByTopic] = useState({});
  const [avgLoadingMap, setAvgLoadingMap] = useState({});

  const paperITopics = useMemo(() => userStats?.paperI || [], [userStats]);
  const paperIITopics = useMemo(() => userStats?.paperII || [], [userStats]);
  const allTopics = useMemo(
    () => [...paperITopics, ...paperIITopics].filter((t) => t?.topicId),
    [paperITopics, paperIITopics],
  );

  const hasPaperI = paperITopics.length > 0;
  const hasPaperII = paperIITopics.length > 0;
  const hasAnyTopics = hasPaperI || hasPaperII;
  useEffect(() => {
    if (!userId || allTopics.length === 0) {
      setAvgByTopic({});
      setAvgLoadingMap({});
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const controller = new AbortController();
    let active = true;

    const fetchAverages = async () => {
      const loadingState = {};
      allTopics.forEach((topic) => {
        loadingState[String(topic.topicId)] = true;
      });
      setAvgLoadingMap(loadingState);

      try {
        const res = await axios.get(
          `${BASE_URL}/quiz/topicAverages/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        );

        if (!active) return;

        const data = res.data || {};
        const nextAvgMap = {};
        const nextLoadingMap = {};

        allTopics.forEach((topic) => {
          const key = String(topic.topicId);
          nextAvgMap[key] = {
            avgPercent: data[key]?.avgPercent ?? null,
            attempts: data[key]?.attempts ?? 0,
          };
          nextLoadingMap[key] = false;
        });

        setAvgByTopic(nextAvgMap);
        setAvgLoadingMap(nextLoadingMap);
      } catch (error) {
        if (!active) return;
        console.error("Error fetching topic averages:", error);

        const fallbackAvgMap = {};
        const nextLoadingMap = {};

        allTopics.forEach((topic) => {
          const key = String(topic.topicId);
          fallbackAvgMap[key] = {
            avgPercent: null,
            attempts: 0,
          };
          nextLoadingMap[key] = false;
        });

        setAvgByTopic(fallbackAvgMap);
        setAvgLoadingMap(nextLoadingMap);
      }
    };

    fetchAverages();

    return () => {
      active = false;
      controller.abort();
    };
  }, [userId, allTopics]);

  const handleResetTopic = async (topicId, title) => {
    if (!userId || !topicId) return;

    const confirmed = window.confirm(
      `Are you sure you want to reset progress for "${title}"?`,
    );
    if (!confirmed) return;

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    setResettingTopicId(topicId);

    try {
      await axios.delete(
        `${BASE_URL}/quiz/resetProgress/${userId}/${topicId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (typeof onStatsUpdate === "function") {
        onStatsUpdate((prevStats) => {
          if (!prevStats) return prevStats;

          const resetTopic = (topic) =>
            String(topic.topicId) === String(topicId)
              ? {
                  ...topic,
                  progress: 0,
                  attemptedQuestions: 0,
                }
              : topic;

          return {
            ...prevStats,
            paperI: (prevStats.paperI || []).map(resetTopic),
            paperII: (prevStats.paperII || []).map(resetTopic),
          };
        });
      }

      setAvgByTopic((prev) => ({
        ...prev,
        [String(topicId)]: {
          avgPercent: null,
          attempts: 0,
        },
      }));
    } catch (error) {
      console.error("Error resetting progress:", error);
      alert("Failed to reset progress. Please try again.");
    } finally {
      setResettingTopicId(null);
    }
  };

  return (
    <div className="bg-white flex flex-col p-4 mt-2 text-gray-700 md:rounded-md">
      <DashboardHeader />

      {!hasAnyTopics && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-600 shadow-sm">
          Your dashboard will appear here once topic stats are available.
        </div>
      )}

      {hasPaperI && (
        <div className="mb-8 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-5 border border-l-white border-r-white border-t-black border-b-black px-5 py-3 text-red-700 tracking-wide">
            Paper I
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {paperITopics.map((topic) => {
              const topicKey = String(topic.topicId);
              const avgData = avgByTopic[topicKey] || {
                avgPercent: null,
                attempts: 0,
              };

              return (
                <DashboardCard
                  key={topic.topicId || topic.path || topic.title}
                  title={topic.title}
                  progress={parseFloat(topic.progress) || 0}
                  path={topic.path}
                  topicId={topic.topicId}
                  attemptedQuestions={topic.attemptedQuestions || 0}
                  avgPercent={avgData.avgPercent}
                  avgAttempts={avgData.attempts}
                  avgLoading={Boolean(avgLoadingMap[topicKey])}
                  onReset={handleResetTopic}
                  isResetting={String(resettingTopicId) === topicKey}
                />
              );
            })}
          </div>
        </div>
      )}

      {hasPaperII && (
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-extrabold mb-5 border border-l-white border-r-white border-t-black border-b-black px-5 py-3 text-blue-700 tracking-wide">
            Paper II
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {paperIITopics.map((topic) => {
              const topicKey = String(topic.topicId);
              const avgData = avgByTopic[topicKey] || {
                avgPercent: null,
                attempts: 0,
              };

              return (
                <DashboardCard
                  key={topic.topicId || topic.path || topic.title}
                  title={topic.title}
                  progress={parseFloat(topic.progress) || 0}
                  path={topic.path}
                  topicId={topic.topicId}
                  attemptedQuestions={topic.attemptedQuestions || 0}
                  avgPercent={avgData.avgPercent}
                  avgAttempts={avgData.attempts}
                  avgLoading={Boolean(avgLoadingMap[topicKey])}
                  onReset={handleResetTopic}
                  isResetting={String(resettingTopicId) === topicKey}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  userId: PropTypes.string,
  onStatsUpdate: PropTypes.func,
  userStats: PropTypes.shape({
    paperI: PropTypes.arrayOf(
      PropTypes.shape({
        topicId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string.isRequired,
        progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        path: PropTypes.string.isRequired,
        attemptedQuestions: PropTypes.number,
      }),
    ),
    paperII: PropTypes.arrayOf(
      PropTypes.shape({
        topicId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string.isRequired,
        progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        path: PropTypes.string.isRequired,
        attemptedQuestions: PropTypes.number,
      }),
    ),
  }),
};

export default Dashboard;
