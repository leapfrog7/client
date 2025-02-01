import PropTypes from "prop-types";
import DashboardCard from "./DashboardCards";
import DashboardHeader from "./DashBoardHeader";
// import { FiBarChart2 } from "react-icons/fi";
import { useMemo } from "react";

const Dashboard = ({ userStats }) => {
  // ✅ Use default values to prevent errors
  const paperITopics = useMemo(() => userStats?.paperI || [], [userStats]);
  const paperIITopics = useMemo(() => userStats?.paperII || [], [userStats]);

  return (
    <div className="min-h-screen bg-white flex flex-col p-4 mt-2 text-gray-700 md:rounded-md">
      {/* Dashboard Header */}

      <DashboardHeader />
      {/* Paper I Section */}
      <div className="mb-8 text-center">
        <h2 className="text-xl md:text-2xl font-extrabold mb-5 border border-l-white border-r-white border-t-black border-b-black bg-gradient-to-r  px-5 py-3 text-red-700  tracking-wide">
          Paper I
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {paperITopics.map((topic, index) => (
            <DashboardCard
              key={index}
              title={topic.title}
              progress={parseFloat(topic.progress) || 0} // ✅ Ensure it's a number
              path={topic.path}
              attemptedQuestions={topic.attemptedQuestions || 0}
              bgColor="bg-gradient-to-r from-pink-200 to-rose-100"
              textColor="text-pink-800"
            />
          ))}
        </div>
      </div>

      {/* Paper II Section */}
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-extrabold mb-5 border border-l-white border-r-white border-t-black border-b-black bg-gradient-to-r  px-5 py-3 text-blue-700 tracking-wide ">
          Paper II
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {paperIITopics.map((topic, index) => (
            <DashboardCard
              key={index}
              title={topic.title}
              progress={parseFloat(topic.progress) || 0} // ✅ Ensure it's a number
              path={topic.path}
              attemptedQuestions={topic.attemptedQuestions || 0}
              bgColor="bg-gradient-to-r from-purple-100 to-blue-100"
              textColor="text-purple-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ✅ Removed `username` from PropTypes since it's unused
Dashboard.propTypes = {
  userStats: PropTypes.shape({
    paperI: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        path: PropTypes.string.isRequired,
        attemptedQuestions: PropTypes.number, // ✅ No longer marked as required
      })
    ),
    paperII: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        progress: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        path: PropTypes.string.isRequired,
        attemptedQuestions: PropTypes.number, // ✅ No longer marked as required
      })
    ),
  }),
};

export default Dashboard;
