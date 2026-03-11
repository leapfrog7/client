import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";

const ITEMS_PER_PAGE = 10;
const MAX_PAGE_BUTTONS = 5;

const reactionEmoji = (reaction) => {
  switch (reaction) {
    case "Helpful":
      return "👍";
    case "Confusing":
      return "🤔";
    case "Needs More Info":
      return "❓";
    case "Too Easy":
      return "😴";
    case "Challenging":
      return "💡";
    default:
      return "📝";
  }
};

const FeedbackManagement = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filter, setFilter] = useState(""); // "" | Helpful | ... | errorOnly
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // UI prefs
  const [clampQuestions, setClampQuestions] = useState(true);
  const [expandedRows, setExpandedRows] = useState(() => new Set());

  const authHeaders = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    }),
    [],
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/feedbackManagement/questionFeedback`,
        authHeaders,
      );
      setFeedbackData(response.data.feedbackCounts || []);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      setFeedbackData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtered list (single source of truth)
  const filteredData = useMemo(() => {
    let filtered = Array.isArray(feedbackData) ? feedbackData : [];

    // Filter by feedback type
    if (filter) {
      filtered = filtered.filter((item) => {
        if (filter === "errorOnly") {
          return item.errorReports && item.errorReports.length > 0;
        }
        return Array.isArray(item.reactions) && item.reactions.includes(filter);
      });
    }

    // Filter by date range (inclusive end date)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        if (!item.createdAt) return false;
        const d = new Date(item.createdAt);
        return d >= start && d <= end;
      });
    }

    return filtered;
  }, [feedbackData, filter, startDate, endDate]);

  // Reset to first page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, startDate, endDate]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  }, [filteredData.length]);

  // Clamp current page if list shrinks (delete/refetch)
  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const getPageNumbers = () => {
    const half = Math.floor(MAX_PAGE_BUTTONS / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + MAX_PAGE_BUTTONS - 1);

    if (end - start + 1 < MAX_PAGE_BUTTONS) {
      start = Math.max(1, end - MAX_PAGE_BUTTONS + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!feedbackId) return;
    if (!window.confirm("Delete this feedback entry?")) return;

    try {
      setDeletingId(feedbackId);

      const response = await axios.delete(
        `${BASE_URL}/feedbackManagement/questionFeedback/${feedbackId}`,
        authHeaders,
      );

      const result = response.data; // ✅ axios uses response.data
      if (result?.success) {
        // Optimistic remove if possible (if your list contains feedbackId)
        setFeedbackData((prev) =>
          prev.filter(
            (x) => x.feedbackId !== feedbackId && x._id !== feedbackId,
          ),
        );
        // If backend aggregates counts and this delete affects aggregation,
        // a refetch is safer:
        await fetchData();
      } else {
        alert(result?.message || "Failed to delete feedback.");
      }
    } catch (error) {
      console.error("❌ Error deleting feedback:", error);
      alert("Failed to delete feedback.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleRowExpand = (rowKey) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  };

  return (
    <div className="p-3 md:p-6 bg-white rounded-2xl shadow-sm border">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
            Question Feedback
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Filter and review feedback. Long questions are clamped for
            readability.
          </p>
        </div>

        <div className="text-xs text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredData.length}
          </span>{" "}
          items • Page{" "}
          <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalPages}</span>
        </div>
      </div>

      {/* Controls (streamlined) */}
      <div className="mb-4 rounded-2xl border bg-gray-50 p-3 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Feedback type
              </label>
              <select
                className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="Helpful">Helpful</option>
                <option value="Confusing">Confusing</option>
                <option value="Needs More Info">Needs More Info</option>
                <option value="Too Easy">Too Easy</option>
                <option value="Challenging">Challenging</option>
                <option value="errorOnly">Errors only</option>
              </select>
            </div>

            {/* Start */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Start date
              </label>
              <input
                type="date"
                className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                End date
              </label>
              <input
                type="date"
                className="w-full border border-gray-200 p-2 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between md:justify-end">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={clampQuestions}
                onChange={() => setClampQuestions((v) => !v)}
              />
              Clamp questions (3 lines)
            </label>

            <button
              type="button"
              onClick={() => {
                setFilter("");
                setStartDate("");
                setEndDate("");
              }}
              className="px-3 py-2 rounded-xl border bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="border-b px-3 py-2 text-left">Question</th>
              <th className="border-b px-3 py-2 text-left">Feedback</th>
              <th className="border-b px-3 py-2 text-center">Total</th>
              <th className="border-b px-3 py-2 text-center">Date</th>
              <th className="border-b px-3 py-2 text-left">User</th>
              <th className="border-b px-3 py-2 text-left">Errors</th>
              <th className="border-b px-3 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-gray-600" colSpan={7}>
                  Loading feedback…
                </td>
              </tr>
            ) : paginatedData.length ? (
              paginatedData.map((item) => {
                const rowKey = item.feedbackId || item._id;
                const expanded = expandedRows.has(rowKey);

                // count reactions
                const counts = (item.reactions || []).reduce((acc, r) => {
                  acc[r] = (acc[r] || 0) + 1;
                  return acc;
                }, {});

                const hasLongText =
                  typeof item.questionText === "string" &&
                  item.questionText.length > 160;

                return (
                  <tr key={rowKey} className="hover:bg-gray-50 align-top">
                    {/* Question (clamp + per-row expand) */}
                    <td className="border-b px-3 py-3 text-left w-[420px]">
                      <div
                        className={[
                          clampQuestions && !expanded ? "line-clamp-3" : "",
                          "text-gray-900",
                        ].join(" ")}
                      >
                        {item.questionText || "—"}
                      </div>

                      {clampQuestions && hasLongText ? (
                        <button
                          type="button"
                          onClick={() => toggleRowExpand(rowKey)}
                          className="mt-1 text-xs font-semibold text-blue-700 hover:underline"
                        >
                          {expanded ? "Show less" : "Show more"}
                        </button>
                      ) : null}
                    </td>

                    {/* Feedback types */}
                    <td className="border-b px-3 py-3 text-left">
                      {Object.keys(counts).length ? (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(counts).map(([reaction, count]) => (
                            <span
                              key={reaction}
                              className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-700"
                            >
                              <span>{reactionEmoji(reaction)}</span>
                              <span>{reaction}</span>
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-800">
                                {count}
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">
                          No feedback yet
                        </span>
                      )}
                    </td>

                    <td className="border-b px-3 py-3 text-center font-semibold text-gray-900">
                      {item.totalFeedback ?? 0}
                    </td>

                    <td className="border-b px-3 py-3 text-center text-gray-700">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="border-b px-3 py-3 text-left">
                      <div className="font-semibold text-gray-900">
                        {item.userName || "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.userEmail || ""}
                      </div>
                    </td>

                    <td className="border-b px-3 py-3 text-left">
                      {item.errorReports?.length ? (
                        <ul className="list-disc list-inside space-y-1">
                          {item.errorReports.slice(0, 3).map((e, idx) => (
                            <li
                              key={`${rowKey}-err-${idx}`}
                              className="text-xs text-red-700"
                            >
                              {e?.description || "No description"}
                            </li>
                          ))}
                          {item.errorReports.length > 3 ? (
                            <li className="text-xs text-gray-500">
                              +{item.errorReports.length - 3} more…
                            </li>
                          ) : null}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No errors</span>
                      )}
                    </td>

                    <td className="border-b px-3 py-3 text-center">
                      <button
                        className="px-3 py-2 rounded-lg border text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                        onClick={() => handleDeleteFeedback(rowKey)}
                        disabled={deletingId === rowKey}
                        title="Delete feedback"
                      >
                        {deletingId === rowKey ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-4 py-6 text-gray-600" colSpan={7}>
                  No feedback data available for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (compact, not every page button) */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
          <div className="text-gray-600">
            Page{" "}
            <span className="font-semibold text-gray-900">{currentPage}</span>{" "}
            of <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-1 py-1 md:px-3 md:py-2  border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              First
            </button>
            <button
              className="px-1 py-1 md:px-3 md:py-2  border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ◀
            </button>

            {/* page numbers window */}
            {getPageNumbers().map((p) => (
              <button
                key={p}
                className={`px-2 py-1 md:px-3 md:py-2  border rounded-lg ${
                  p === currentPage
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}

            <button
              className="px-1 py-1 md:px-3 md:py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              ▶
            </button>
            <button
              className="px-1 py-1 md:px-3 md:py-2  border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement;
