import { useState, useEffect } from "react";
import { FiBarChart2 } from "react-icons/fi";
// import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DashboardHeader = () => {
  const [stats, setStats] = useState({
    attemptedPaperI: 0,
    attemptedPaperII: 0,
    totalQuestions: 0,
    overallPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1";

  // ✅ Extract userId from JWT token
  const token = localStorage.getItem("jwtToken");
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
      console.log("This is the user ID - ", userId);
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/quiz/getOverallStats/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Failed to load stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return (
    <div
      className="relative bg-cover bg-center bg-no-repeat shadow-lg rounded-lg p-6 mb-8 text-center animate-fadeIn"
      style={{
        backgroundImage: "url('/assets/abstract-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/50 rounded-lg"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold flex items-center gap-3">
            <span className="leading-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
              My Dashboard
            </span>
            <FiBarChart2 className="text-pink-300 text-4xl md:text-5xl" />
          </h1>
          <p className="text-gray-200 text-base md:text-xl font-medium mt-1">
            Track your progress in real-time
          </p>
        </div>

        {/* ✅ Loading State */}
        {loading ? (
          <div className="bg-white bg-opacity-20 backdrop-blur-md p-4 rounded-lg shadow-md text-white text-center">
            <h2 className="text-lg font-bold mb-2">Loading Quiz Summary...</h2>
            <p className="text-gray-300">Fetching latest stats...</p>
          </div>
        ) : error ? (
          <div className="bg-white bg-opacity-20 backdrop-blur-md p-4 rounded-lg shadow-md text-white text-center">
            <h2 className="text-lg font-bold mb-2">Error</h2>
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <div className="bg-black bg-opacity-20 backdrop-blur-md p-4 rounded-lg shadow-md text-white text-center">
            <h2 className="text-lg font-bold mb-2">Quick Progress Stats</h2>
            <div className="flex md:flex-row items-center gap-6">
              <div className="flex flex-col items-center">
                <p className="text-lg md:text-xl lg:text-2xl font-semibold">
                  {stats.attemptedPaperI}
                </p>
                <p className="text-xs md:text-sm text-gray-200">
                  Paper I Attempted
                </p>
              </div>

              <div className="w-8 h-1 bg-gray-400 md:w-1 md:h-8"></div>

              <div className="flex flex-col items-center">
                <p className="text-lg md:text-xl lg:text-2xl font-semibold">
                  {stats.attemptedPaperII}
                </p>
                <p className="text-xs md:text-sm text-gray-200">
                  Paper II Attempted
                </p>
              </div>

              <div className="w-8 h-1 bg-gray-400 md:w-1 md:h-8"></div>

              <div className="flex flex-col items-center">
                <p className="text-lg md:text-xl lg:text-2xl font-semibold">
                  {typeof stats.overallPercentage === "number"
                    ? stats.overallPercentage.toFixed(1)
                    : "0.0"}
                  %
                </p>
                <p className="text-xs md:text-sm text-gray-200 flex items-center gap-1">
                  Overall Completion{" "}
                  {/* <FaCheckCircle className="text-green-500" /> */}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
