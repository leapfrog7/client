import PropTypes from "prop-types";
import DashboardCard from "./DashboardCards";
import { AiOutlineDashboard } from "react-icons/ai";

const Dashboard = ({ userStats }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col p-4 mt-2 text-gray-700 md:rounded-md">
      <h1 className="text-xl md:text-3xl font-bold mt-4 mb-6 text-center text-gray-600 flex items-center justify-center">
        Your Dashboard{" "}
        <AiOutlineDashboard className="ml-2 text-yellow-600 text-3xl" />
      </h1>

      <div className="mb-8 text-center">
        <h2 className="text-base md:text-lg font-bold mb-4 rounded-lg bg-gradient-to-r from-pink-200 to-rose-300 px-4 py-2 text-pink-700">
          Paper I
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {userStats.paperI.map((topic, index) => (
            <DashboardCard
              key={index}
              title={topic.title}
              progress={topic.progress}
              path={topic.path}
              attemptedQuestions={topic.attemptedQuestions}
              bgColor={"bg-gradient-to-r from-pink-200 to-rose-100"}
              textColor={"text-pink-800"}
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <h2 className="font-bold text-base md:text-lg mb-4 text-purple-800 bg-gradient-to-r from-purple-300 to-blue-100 rounded-lg px-4 py-2">
          Paper II
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6  ">
          {userStats.paperII.map((topic, index) => (
            <DashboardCard
              key={index}
              title={topic.title}
              progress={topic.progress}
              path={topic.path}
              attemptedQuestions={topic.attemptedQuestions}
              bgColor={" bg-gradient-to-r from-purple-100 to-blue-100"}
              textColor={"text-purple-800"}
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
