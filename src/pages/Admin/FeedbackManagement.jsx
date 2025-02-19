import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
// const BASE_URL = "http://localhost:5000/api/v1";

const FeedbackManagement = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/feedbackManagement/questionFeedback`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setFeedbackData(response.data.feedbackCounts || []);
      setFilteredData(response.data.feedbackCounts || []);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };
  // Fetch feedback data
  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on feedback type and date range
  useEffect(() => {
    let filtered = feedbackData;
    console.log(feedbackData);
    // Filter by feedback type
    if (filter) {
      filtered = filtered.filter((item) => {
        if (filter === "") return true; // Show all
        if (filter === "errorOnly") {
          return item.errorReports && item.errorReports.length > 0;
        }
        return item.reactions.includes(filter);
      });
    }

    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [filter, startDate, endDate, feedbackData]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 🚀 Delete Feedback Handler
  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;

    try {
      const response = await fetch(
        `${BASE_URL}/feedbackManagement/questionFeedback/${feedbackId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("✅ Feedback deleted successfully!");
        fetchData(); // 🔄 Refresh the table
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error("❌ Error deleting feedback:", error);
      alert("Failed to delete feedback.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Feedback Management
      </h2>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-6 items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 p-6 rounded-lg shadow-lg border border-gray-300">
        {/* Feedback Type Filter */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
          <label className="font-semibold text-blue-800 text-base mb-2">
            🎯 Filter by Feedback Type:
          </label>
          <select
            className="border border-blue-400 p-2 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-100 transition-all duration-300"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">🌐 All Types</option>
            <option value="Helpful">👍 Helpful</option>
            <option value="Confusing">🤔 Confusing</option>
            <option value="Needs More Info">❓ Needs More Info</option>
            <option value="Too Easy">😴 Too Easy</option>
            <option value="Challenging">💡 Challenging</option>
            <option value="errorOnly">🚨 Errors Only</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-2/3">
          <div className="flex flex-col items-center md:items-start w-full">
            <label className="font-semibold text-blue-800 text-base mb-2">
              🗓️ Start Date:
            </label>
            <input
              type="date"
              className="border border-blue-400 p-2 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-100 transition-all duration-300"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center md:items-start w-full">
            <label className="font-semibold text-blue-800 text-base mb-2">
              🗓️ End Date:
            </label>
            <input
              type="date"
              className="border border-blue-400 p-2 rounded-lg w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-blue-100 transition-all duration-300"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-sm text-center">
          <thead className="bg-blue-50 text-gray-700">
            <tr>
              <th className="border px-4 py-2">Question</th>
              <th className="border px-4 py-2">Feedback Types</th>
              <th className="border px-4 py-2">Total Feedback</th>
              <th className="border px-4 py-2">Date Submitted</th>
              <th className="border px-4 py-2">Error Reports</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.questionText}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    {item.reactions.length > 0 ? (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {/* Count occurrences of each reaction */}
                        {Object.entries(
                          item.reactions.reduce((acc, reaction) => {
                            acc[reaction] = (acc[reaction] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([reaction, count]) => (
                          <div
                            key={reaction}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg shadow-md flex items-center gap-2"
                          >
                            <span className="text-xl">
                              {reaction === "Helpful"
                                ? "👍"
                                : reaction === "Confusing"
                                ? "🤔"
                                : reaction === "Needs More Info"
                                ? "❓"
                                : reaction === "Too Easy"
                                ? "😴"
                                : reaction === "Challenging"
                                ? "💡"
                                : "❓"}
                            </span>
                            <span>{reaction}:</span>
                            <strong>{count}</strong>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">
                        No feedback recorded yet
                      </span>
                    )}
                  </td>
                  <td className="border px-4 py-2">{item.totalFeedback}</td>
                  <td className="border px-4 py-2">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {item.errorReports && item.errorReports.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {item.errorReports.map((error, index) => (
                          <li key={index} className="text-red-600 font-medium">
                            {error.description || "No description provided"}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Errors Reported"
                    )}
                  </td>

                  <td className="border px-4 py-2">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteFeedback(item.feedbackId)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No feedback data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          className={`px-3 py-2 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={`px-3 py-2 border rounded ${
              currentPage === page + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </button>
        ))}

        <button
          className={`px-3 py-2 border rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500"
              : "bg-blue-600 text-white"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedbackManagement;
