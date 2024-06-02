import PropTypes from "prop-types";
import DashboardCard from "./DashboardCards";

const Dashboard = ({ userStats, username }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-4">
      {/* This displays the user name which has currently logged in */}
      <h1 className="text-xl md:text-2xl font-bold  mb-4">
        Hi, {username} - here is your progress...
      </h1>

      <div className="mb-8">
        <h2 className=" font-bold mb-4">Paper I Topics</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {userStats.paperI.map((topic, index) => (
            <DashboardCard
              key={index}
              title={topic.title}
              progress={topic.progress}
              path={topic.path}
            />
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Paper II Topics</h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {userStats.paperII.map((topic, index) => (
            <DashboardCard
              key={index}
              title={topic.title}
              progress={topic.progress}
              path={topic.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  userStats: PropTypes.object,
  username: PropTypes.string,
};
export default Dashboard;
