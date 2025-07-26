import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";
const ITEMS_PER_PAGE = 10;

const GeneralFeedbackManagement = () => {
  const [view, setView] = useState("list"); // 'list' or 'summary'
  const [summaryData, setSummaryData] = useState([]);

  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/generalFeedback`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching general feedback:", err);
    }
    setLoading(false);
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/generalFeedback/summary`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setSummaryData(res.data.summary || []);
    } catch (err) {
      console.error("Error fetching feedback summary:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;

    try {
      const res = await axios.delete(`${BASE_URL}/generalFeedback/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (res.data.success) {
        alert("✅ Feedback deleted");
        fetchFeedback();
      } else {
        alert("❌ Failed to delete");
      }
    } catch (err) {
      alert("Error deleting feedback.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(feedbacks.length / ITEMS_PER_PAGE);
  const paginated = feedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        General Feedback
      </h2>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            view === "list"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setView("list")}
        >
          🔄 Feedback List
        </button>
        <button
          className={`px-4 py-2 rounded ${
            view === "summary"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => {
            setView("summary");
            if (summaryData.length === 0) fetchSummary();
          }}
        >
          📊 Summary by Page
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : view === "list" ? (
        feedbacks.length === 0 ? (
          <div className="text-gray-500">No general feedback available.</div>
        ) : (
          <>
            {/* ✅ List Table + Pagination */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 text-sm text-center">
                <thead className="bg-blue-50 text-gray-700">
                  <tr>
                    <th className="border px-4 py-2">Page</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Message</th>
                    <th className="border px-4 py-2">User</th>
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((fb) => (
                    <tr key={fb.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{fb.page}</td>
                      <td className="border px-4 py-2">{fb.category}</td>
                      <td className="border px-4 py-2 text-left">
                        {fb.message}
                      </td>
                      <td className="border px-4 py-2">
                        <div className="font-semibold">
                          {fb.userName || "Anonymous"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {fb.userEmail || "—"}
                        </div>
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(fb.createdAt).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDelete(fb.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
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
                onClick={() => setCurrentPage(currentPage - 1)}
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
                  onClick={() => setCurrentPage(page + 1)}
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
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )
      ) : (
        // ✅ Summary Table View
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm text-center">
            <thead className="bg-blue-50 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Page</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Praise</th>
                <th className="border px-4 py-2">Suggestions</th>
                <th className="border px-4 py-2">Complaints</th>
                <th className="border px-4 py-2">Latest Feedback</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((item) => {
                const counts = Object.fromEntries(
                  item.categories.map((c) => [c.category, c.count])
                );
                return (
                  <tr key={item.page} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{item.page}</td>
                    <td className="border px-4 py-2">{item.total}</td>
                    <td className="border px-4 py-2">
                      {counts["Praise"] || 0}
                    </td>
                    <td className="border px-4 py-2">
                      {counts["Suggestion"] || 0}
                    </td>
                    <td className="border px-4 py-2">
                      {counts["Complaint"] || 0}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(item.latestDate).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GeneralFeedbackManagement;
