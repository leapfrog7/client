import PropTypes from "prop-types";
import DashboardCard from "./DashboardCards";

const Dashboard = ({ userStats }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col p-4 mt-2 text-gray-700 md:rounded-md">
      {/* This displays the user name which has currently logged in */}
      <h1 className="text-lg md:text-xl font-bold mt-2 mb-4 text-center">
        Dashboard of your progress so far...
      </h1>

      <div className="mb-8">
        <h2 className=" font-bold mb-4 rounded-lg bg-gradient-to-r from-pink-200 to-rose-300 px-4 py-2 text-pink-700">
          Paper I Topics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
        <h2 className="font-bold mb-4 text-purple-800 bg-gradient-to-r from-purple-300 to-blue-100 rounded-lg px-4 py-2">
          Paper II Topics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6  ">
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
