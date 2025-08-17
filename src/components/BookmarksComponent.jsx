// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import PropTypes from "prop-types";
// // import { GrCaretNext } from "react-icons/gr";
// // import { GrCaretPrevious } from "react-icons/gr";

// // const BookmarkComponent = ({ userId, topicId }) => {
// //   const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [expandedQuestionId, setExpandedQuestionId] = useState(null);
// //   //for Pagination of Bookmarks
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const pageSize = 10; // Number of items per page

// //   const token = localStorage.getItem("jwtToken");

// //   const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL

// //   useEffect(() => {
// //     const fetchBookmarks = async () => {
// //       setLoading(true);
// //       try {
// //         const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
// //           params: { userId, topicId },
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         //console.log(response.data);
// //         const topicBookmark = response.data.bookmarks.find(
// //           (bookmark) => bookmark.topic._id === topicId
// //         );
// //         if (topicBookmark) {
// //           setBookmarkedQuestions(topicBookmark.questions);
// //         } else {
// //           setBookmarkedQuestions([]);
// //         }
// //       } catch (error) {
// //         console.error("Failed to fetch bookmarks:", error);
// //         setError("Failed to fetch bookmarks");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (userId && topicId) {
// //       fetchBookmarks();
// //     }
// //   }, [userId, topicId]);

// //   const toggleExpand = (questionId) => {
// //     if (expandedQuestionId === questionId) {
// //       setExpandedQuestionId(null);
// //     } else {
// //       setExpandedQuestionId(questionId);
// //     }
// //   };

// //   const handlePageChange = (newPage) => {
// //     setCurrentPage(newPage);
// //   };
// //   // Calculate the data to display for the current page
// //   const startIndex = (currentPage - 1) * pageSize;
// //   const endIndex = startIndex + pageSize;
// //   const paginatedQuestions = bookmarkedQuestions.slice(startIndex, endIndex);
// //   const totalPages = Math.ceil(bookmarkedQuestions.length / pageSize);

// //   if (loading) {
// //     return <div>Loading bookmarks...</div>;
// //   }

// //   if (error) {
// //     return <div>{error}</div>;
// //   }

// //   if (bookmarkedQuestions.length === 0) {
// //     return <div>No bookmarks available for this topic.</div>;
// //   }

// //   return (
// //     <div className="min-h-screen">
// //       <div className="bg-white rounded-lg shadow-md">
// //         <h2 className="text-xl md:text-2xl font-bold mb-4 w-full text-center text-gray-800">
// //           Bookmarked Questions
// //         </h2>
// //         {paginatedQuestions.map((question, index) => (
// //           <div
// //             key={index}
// //             className="mb-4 text-sm md:text-base shadow-lg rounded-lg p-4 "
// //           >
// //             <p
// //               className="cursor-pointer whitespace-pre-line font-semibold"
// //               onClick={() => toggleExpand(question._id)}
// //             >
// //               {`Question ${startIndex + index + 1}: ${question.questionText}`}
// //             </p>
// //             {expandedQuestionId === question._id && (
// //               <div className="mt-2 bg-gradient-to-b from-white to-slate-100 rounded-lg p-2">
// //                 {question.options.map((option, i) => (
// //                   <p key={i} className="text-gray-700">
// //                     {option}
// //                   </p>
// //                 ))}
// //                 <p className="mt-4 text-gray-700">
// //                   <span className="text-green-800 font-semibold bg-green-100 rounded-md">
// //                     {`Correct Answer: ${question.correctAnswer}`}
// //                   </span>
// //                   <br />
// //                   <br />
// //                   <span className="whitespace-pre-line">
// //                     <strong>Explanation:</strong> {question.explanation}
// //                   </span>
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         ))}

// //         {/* Pagination Controls */}
// //         <div className="flex justify-center my-4 pb-4 gap-4">
// //           <button
// //             disabled={currentPage === 1}
// //             onClick={() => handlePageChange(currentPage - 1)}
// //             className="px-4 py-2 mx-1 text-xs md:text-base bg-blue-500 text-white rounded disabled:bg-gray-400"
// //           >
// //             <GrCaretPrevious />
// //           </button>
// //           <span className="px-4 py-2 text-xs md:text-base mx-1 bg-gray-200 rounded">
// //             Page {currentPage} of {totalPages}
// //           </span>
// //           <button
// //             disabled={currentPage === totalPages}
// //             onClick={() => handlePageChange(currentPage + 1)}
// //             className="px-4 text-xs md:text-base py-2 mx-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
// //           >
// //             <GrCaretNext />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // BookmarkComponent.propTypes = {
// //   userId: PropTypes.string.isRequired,
// //   topicId: PropTypes.string.isRequired,
// // };

// // export default BookmarkComponent;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import PropTypes from "prop-types";
// import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
// import { AiOutlineDelete } from "react-icons/ai"; // ✅ Import delete icon
// // import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// const BookmarkComponent = ({ userId, topicId }) => {
//   const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedQuestionId, setExpandedQuestionId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;

//   const token = localStorage.getItem("jwtToken");
//   const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; // Server URL
//   // const BASE_URL = "http://localhost:5000/api/v1";

//   // ✅ Fetch Bookmarks on Component Mount
//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
//           params: { userId, topicId },
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const topicBookmark = response.data.bookmarks.find(
//           (bookmark) => bookmark.topic._id === topicId
//         );

//         if (topicBookmark) {
//           setBookmarkedQuestions(topicBookmark.questions);
//         } else {
//           setBookmarkedQuestions([]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch bookmarks:", error);
//         setError("Failed to fetch bookmarks");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId && topicId) {
//       fetchBookmarks();
//     }
//   }, [userId, topicId]);

//   // ✅ Toggle Question Details
//   const toggleExpand = (questionId) => {
//     setExpandedQuestionId(
//       expandedQuestionId === questionId ? null : questionId
//     );
//   };

//   // ✅ Remove Bookmark Function
//   const removeBookmark = async (questionId) => {
//     try {
//       await axios.delete(`${BASE_URL}/quiz/removeBookmark`, {
//         data: { userId, topicId, questionId },
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // ✅ Update UI after removal
//       setBookmarkedQuestions((prev) =>
//         prev.filter((question) => question._id !== questionId)
//       );
//     } catch (error) {
//       console.error("Failed to remove bookmark:", error);
//       alert("Failed to remove bookmark. Try again.");
//     }
//   };

//   // ✅ Pagination Logic
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedQuestions = bookmarkedQuestions.slice(startIndex, endIndex);
//   const totalPages = Math.ceil(bookmarkedQuestions.length / pageSize);

//   // ✅ Loading & Error States
//   if (loading) return <div>Loading bookmarks...</div>;
//   if (error) return <div>{error}</div>;
//   if (bookmarkedQuestions.length === 0)
//     return <div>No bookmarks available for this topic.</div>;

//   return (
//     <div className="min-h-screen bg-white">
//       {/* <div className="bg-white rounded-lg shadow-md"> */}
//       {/* <h2 className="text-xl md:text-2xl font-bold mb-4 w-full text-center text-gray-800">
//         Bookmarked Questions
//       </h2> */}

//       {paginatedQuestions.map((question, index) => (
//         <div
//           key={index}
//           className="mb-4 text-sm md:text-base shadow-lg rounded-lg p-4 "
//         >
//           <div className="flex justify-between items-end ">
//             <p
//               className="cursor-pointer font-semibold text-gray-900 whitespace-pre-line"
//               onClick={() => toggleExpand(question._id)}
//             >
//               {`Q${startIndex + index + 1}: ${question.questionText}`}
//             </p>
//             <button
//               onClick={() => removeBookmark(question._id)}
//               className="bg-red-200 text-red-600 hover:text-red-800 transition duration-200 ease-in-out p-1 rounded-md"
//             >
//               <AiOutlineDelete className="text-lg" />
//             </button>
//           </div>

//           {expandedQuestionId === question._id && (
//             // <div className="mt-2 bg-gray-50 rounded-lg p-2">
//             //   {question.options.map((option, i) => (
//             //     <p key={i} className="text-gray-700">
//             //       {option}
//             //     </p>
//             //   ))}
//             //   <p className="mt-4 text-gray-700">
//             //     <span className="text-green-800 font-semibold bg-green-100 rounded-md px-2 py-1">
//             //       {`Correct Answer: ${question.correctAnswer}`}
//             //     </span>
//             //     <br />
//             //     <br />
//             //     <span className="whitespace-pre-line">
//             //       <strong>Explanation:</strong> {question.explanation}
//             //     </span>
//             //   </p>
//             // </div>
//             <div className="mt-2 bg-gray-50 rounded-lg p-4 shadow-sm">
//               <ul className="list-disc list-inside text-gray-700 space-y-1">
//                 {question.options.map((option, i) => (
//                   <li
//                     key={i}
//                     className="px-2 py-1 rounded-md hover:bg-gray-100 transition"
//                   >
//                     {option}
//                   </li>
//                 ))}
//               </ul>

//               <p className="mt-4 text-gray-700 space-y-3">
//                 {/* Answer Section */}
//                 <span className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 rounded-md px-3 py-2 shadow-sm">
//                   <span className="font-bold text-green-700">
//                     Correct Answer: <br />
//                     <span className="text-green-700 font-normal mt-1">
//                       {question.correctAnswer}
//                     </span>
//                   </span>
//                 </span>

//                 {/* Explanation Section */}
//                 <div className="bg-blue-50 border-l-4 border-blue-400 rounded-md px-3 py-2 shadow-sm">
//                   <strong className="text-blue-700">Explanation:</strong>
//                   <p className="text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
//                     {question.explanation}
//                   </p>
//                 </div>
//               </p>
//             </div>
//           )}
//         </div>
//       ))}

//       {/* Pagination Controls */}
//       <div className="flex justify-center my-4 pb-4 gap-4">
//         <button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage(currentPage - 1)}
//           className="px-4 py-2 mx-1 text-xs md:text-base bg-blue-500 text-white rounded-full disabled:bg-gray-400"
//         >
//           <GrCaretPrevious />
//         </button>
//         <span className="px-4 py-2 text-xs md:text-base mx-1 bg-gray-200 rounded">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage(currentPage + 1)}
//           className="px-4 text-xs md:text-base py-2 mx-1 bg-blue-500 text-white rounded-full disabled:bg-gray-400"
//         >
//           <GrCaretNext />
//         </button>
//       </div>
//     </div>
//     // </div>
//   );
// };

// BookmarkComponent.propTypes = {
//   userId: PropTypes.string.isRequired,
//   topicId: PropTypes.string.isRequired,
// };

// export default BookmarkComponent;

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import { FiSearch, FiX } from "react-icons/fi";

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const highlight = (text = "", term = "") => {
  if (!term) return [text];
  const safe = escapeRegExp(term);
  const regex = new RegExp(`(${safe})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const SkeletonRow = () => (
  <div className="mb-4 p-4 rounded-lg border bg-white">
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-3 bg-gray-100 rounded w-3/5" />
      <div className="h-16 bg-gray-50 rounded" />
    </div>
  </div>
);

const BookmarkComponent = ({ userId, topicId, attemptedIds = [] }) => {
  // data
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [expandedId, setExpandedId] = useState(null);

  // controls (no sorting; we keep API order exactly)
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // const [explanationOnly, setExplanationOnly] = useState(false);
  const [attemptedFilter, setAttemptedFilter] = useState("all"); // "all" | "attempted" | "unattempted"
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const searchInputRef = useRef(null);
  const token = localStorage.getItem("jwtToken");
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1";

  const [confirm, setConfirm] = useState({ open: false, id: null });

  const openConfirm = (id) => setConfirm({ open: true, id });
  const closeConfirm = () => setConfirm({ open: false, id: null });

  const confirmDelete = async () => {
    if (!confirm.id) return;
    await removeBookmark(confirm.id);
    closeConfirm();
  };

  // fetch topic-wise bookmarks
  useEffect(() => {
    let ok = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
          params: { userId, topicId },
          headers: { Authorization: `Bearer ${token}` },
        });
        const t = res.data?.bookmarks?.find((b) => b.topic?._id === topicId);
        if (ok) setBookmarkedQuestions(t ? t.questions || [] : []);
      } catch (e) {
        console.error(e);
        if (ok) setError("Failed to fetch bookmarks");
      } finally {
        if (ok) setLoading(false);
      }
    };
    if (userId && topicId) run();
    return () => {
      ok = false;
    };
  }, [userId, topicId]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") setQuery("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleExpand = useCallback(
    (id) => setExpandedId((prev) => (prev === id ? null : id)),
    []
  );

  // single delete (optimistic)
  const removeBookmark = useCallback(
    async (questionId) => {
      const prev = bookmarkedQuestions;
      setBookmarkedQuestions((qs) => qs.filter((q) => q._id !== questionId));
      try {
        await axios.delete(`${BASE_URL}/quiz/removeBookmark`, {
          data: { userId, topicId, questionId },
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.error("Failed to remove bookmark:", e);
        alert("Failed to remove bookmark. Reverting.");
        setBookmarkedQuestions(prev);
      }
    },
    [bookmarkedQuestions, userId, topicId]
  );

  // filter + search (no sorting; preserve API order)
  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    let out = bookmarkedQuestions;

    // if (explanationOnly) {
    //   out = out.filter((qn) => (qn.explanation || "").trim().length > 0);
    // }

    if (attemptedFilter !== "all" && attemptedIds.length > 0) {
      const isAtt = (id) => attemptedIds.includes(id);
      out = out.filter((qn) =>
        attemptedFilter === "attempted" ? isAtt(qn._id) : !isAtt(qn._id)
      );
    }

    if (q) {
      out = out.filter((qn) => {
        const hay =
          (qn.questionText || "") +
          " " +
          (Array.isArray(qn.options) ? qn.options.join(" ") : "") +
          " " +
          (qn.explanation || "");
        return hay.toLowerCase().includes(q);
      });
    }

    return out; // order unchanged
  }, [bookmarkedQuestions, debouncedQuery, attemptedFilter, attemptedIds]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = filtered.slice(startIndex, endIndex);

  // reset page when controls change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, attemptedFilter, pageSize]);

  // UI states
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="h-9 w-full bg-gray-100 rounded mb-4 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!bookmarkedQuestions || bookmarkedQuestions.length === 0)
    return (
      <div className="p-6 text-center text-gray-700">
        No bookmarks available for this topic.
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Search block (own row) */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto p-1 md:p-2">
          <div className="relative mt-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search question, options, explanation…"
              className="w-full border rounded-lg pl-9 pr-8 py-2 text-sm"
              aria-label="Search bookmarks"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                title="Clear"
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Controls row: filters + page size (responsive stack) */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              {attemptedIds.length > 0 && (
                <select
                  value={attemptedFilter}
                  onChange={(e) => setAttemptedFilter(e.target.value)}
                  className="border rounded px-2 py-2 text-sm"
                  title="Attempted filter"
                  aria-label="Attempted filter"
                >
                  <option value="all">All</option>
                  <option value="attempted">Attempted</option>
                  <option value="unattempted">Unattempted</option>
                </select>
              )}
            </div>

            <div className="flex justify-end items-center gap-2">
              <label className="text-xs md:text-sm text-gray-600">
                Bookmarks Per page
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border rounded px-2 py-1 text-xs md:text-sm"
                title="Items per page"
                aria-label="Items per page"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-4xl mx-auto p-1 md:p-3">
        {/* Range info */}
        <div className="mb-2 text-xs md:text-sm text-gray-500 text-right">
          Showing {filtered.length === 0 ? 0 : startIndex + 1}–
          {Math.min(endIndex, filtered.length)} of {filtered.length}
          {debouncedQuery && (
            <span className="ml-2">• Searching for “{debouncedQuery}”</span>
          )}
        </div>

        {pageItems.length === 0 ? (
          <div className="p-6 text-center text-gray-600 bg-gray-50 rounded">
            No results. Try clearing filters or changing your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pageItems.map((q, idx) => {
              const qNum = startIndex + idx + 1;
              const attempted =
                attemptedIds.length > 0 ? attemptedIds.includes(q._id) : null;

              return (
                <div
                  key={q._id}
                  className={`rounded-lg border bg-white p-3 shadow-sm ${
                    attempted === null
                      ? "border-gray-200"
                      : attempted
                      ? "border-green-200"
                      : "border-gray-200"
                  }`}
                >
                  {/* Question header row */}
                  <div className="flex flex-col items-start text-sm">
                    {/* Question (expand area) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleExpand(q._id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleExpand(q._id);
                        }
                      }}
                      className="flex-1 text-left font-semibold text-gray-900 whitespace-pre-line cursor-pointer"
                      title="Expand/collapse"
                    >
                      <span className="mr-1 text-gray-500">Q{qNum}:</span>
                      {highlight(q.questionText || "", debouncedQuery)}
                    </div>

                    {/* Delete button pushed right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirm(q._id);
                      }}
                      className="ml-auto bg-red-100 text-red-600 hover:text-red-800 transition p-1 rounded-md"
                      title="Remove bookmark"
                      aria-label="Remove bookmark"
                    >
                      <AiOutlineDelete className="text-lg" />
                    </button>
                  </div>

                  {confirm.open && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                      onClick={closeConfirm}
                      aria-modal="true"
                      role="dialog"
                    >
                      <div
                        className="w-[92%] max-w-sm rounded-xl bg-white p-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-semibold text-gray-900">
                          Remove bookmark?
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          This action can’t be undone.
                        </p>

                        <div className="mt-4 flex justify-end gap-2">
                          <button
                            onClick={closeConfirm}
                            className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmDelete}
                            className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Meta line */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {attempted !== null && (
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 ${
                          attempted
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {attempted ? "Attempted" : "Unattempted"}
                      </span>
                    )}
                    {q.createdAt &&
                      `• ${new Date(q.createdAt).toLocaleDateString()}`}
                  </div>

                  {/* Expanded content */}
                  {expandedId === q._id && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-1 text-sm">
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {(q.options || []).map((opt, i) => (
                          <li
                            key={i}
                            className="px-2 py-1 rounded hover:bg-gray-100"
                          >
                            {highlight(opt, debouncedQuery)}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 rounded-md px-3 py-2">
                          <span className="font-bold text-green-700">
                            Correct Answer:
                          </span>
                          <span className="text-green-700">
                            {q.correctAnswer ?? "-"}
                          </span>
                        </div>

                        {(q.explanation || "").trim().length > 0 && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-md px-3 py-2">
                            <strong className="text-blue-700">
                              Explanation:
                            </strong>
                            <p className="text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
                              {highlight(q.explanation || "", debouncedQuery)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center my-6 gap-4">
          <button
            disabled={safePage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-xs md:text-base bg-blue-500 text-white rounded-full disabled:bg-gray-400"
            aria-label="Previous page"
          >
            <GrCaretPrevious />
          </button>
          <span className="px-4 py-2 text-xs md:text-base bg-gray-200 rounded">
            Page {safePage} of {totalPages}
          </span>
          <button
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 text-xs md:text-base bg-blue-500 text-white rounded-full disabled:bg-gray-400"
            aria-label="Next page"
          >
            <GrCaretNext />
          </button>
        </div>
      </div>
    </div>
  );
};

BookmarkComponent.propTypes = {
  userId: PropTypes.string.isRequired,
  topicId: PropTypes.string.isRequired,
  attemptedIds: PropTypes.arrayOf(PropTypes.string),
};

export default BookmarkComponent;
