import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaNewspaper } from "react-icons/fa";
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
    <div className="bg-white flex flex-col p-0 mt-2 text-gray-700 md:rounded-md">
      <DashboardHeader userId={userId} />

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

      <div className="mt-6">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-amber-50 via-white to-zinc-100 p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 ">
                <FaNewspaper className="text-lg" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-zinc-800 sm:text-lg">
                    Current Affairs
                  </h2>
                  <span className="inline-flex rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-700">
                    Monthly
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Curated primarily from Press Information Bureau releases and
                  cover important developments, Government initiatives, and
                  other misc relevant updates to support exam-focused
                  preparation.
                </p>
              </div>
            </div>

            <div className="sm:shrink-0">
              <Link
                to="/pages/current_affairs"
                className="inline-flex items-center justify-center rounded-xl bg-amber-200 px-4 py-2.5 text-sm font-semibold text-zinc-600 shadow-sm transition hover:bg-amber-100 hover:border hover:border-amber-600"
              >
                Open Current Affairs
              </Link>
            </div>
          </div>
        </div>
      </div>
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
