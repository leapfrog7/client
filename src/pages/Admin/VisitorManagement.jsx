import { useEffect, useState } from "react";

export default function VisitorManagement() {
  const [visitorData, setVisitorData] = useState([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all visitors
        const visitorsRes = await fetch(`${BASE_URL}/visitors`);
        const visitors = await visitorsRes.json();

        // Fetch active users
        const activeRes = await fetch(`${BASE_URL}/visitors/active`);
        const active = await activeRes.json();

        // Fetch summary statistics
        const summaryRes = await fetch(`${BASE_URL}/visitors/summary`);
        const summaryData = await summaryRes.json();

        // Update state with fetched data
        setVisitorData(visitors);
        setActiveUsers(active.activeUsers);
        setSummary(summaryData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 mx-auto text-center">
      <h1 className="text-2xl font-bold text-gray-800">Visitor Analytics</h1>
      <p className="text-gray-500 mt-4">Real-time visitor tracking data</p>

      {loading ? (
        <p className="text-gray-500 mt-4">Loading visitor data...</p>
      ) : (
        <>
          {/* Summary Section */}
          {summary && (
            <div className="bg-white p-4 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              <p className="text-gray-500">
                Total Visitors: {summary.totalVisitors}
              </p>
              <p className="text-gray-500">
                Unique Visitors: {summary.uniqueVisitors}
              </p>
              <p className="text-gray-500">Active Users: {activeUsers}</p>
              <h3 className="mt-4 text-lg font-semibold">Top Visited Pages:</h3>
              <ul className="text-gray-500">
                {summary.mostVisitedPages.map((page, index) => (
                  <li key={index}>
                    {page._id} - {page.count} visits
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Visitor Table */}
          <table className="min-w-full bg-white border border-gray-300 mt-6">
            <thead>
              <tr>
                <th className="border px-4 py-2">Visitor ID</th>
                <th className="border px-4 py-2">IP Address</th>
                <th className="border px-4 py-2">Visited At</th>
                <th className="border px-4 py-2">Page Visited</th>
                <th className="border px-4 py-2">Paid User</th>
              </tr>
            </thead>
            <tbody>
              {visitorData.length > 0 ? (
                visitorData.map((visitor, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{visitor.visitorId}</td>
                    <td className="border px-4 py-2">{visitor.ip}</td>
                    <td className="border px-4 py-2">
                      {new Date(visitor.visitedAt).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2">{visitor.pageVisited}</td>
                    <td className="border px-4 py-2">
                      {visitor.isPaidUser ? "Yes" : "No"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-4 py-2 text-gray-500">
                    No visitor data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
