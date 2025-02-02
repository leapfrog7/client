// import { useState, useEffect } from "react";
// import axios from "axios";
// import PropTypes from "prop-types";
// import { GrCaretNext } from "react-icons/gr";
// import { GrCaretPrevious } from "react-icons/gr";

// const BookmarkComponent = ({ userId, topicId }) => {
//   const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedQuestionId, setExpandedQuestionId] = useState(null);
//   //for Pagination of Bookmarks
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10; // Number of items per page

//   const token = localStorage.getItem("jwtToken");

//   const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; //This is the Server Base URL

//   useEffect(() => {
//     const fetchBookmarks = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
//           params: { userId, topicId },
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         //console.log(response.data);
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

//   const toggleExpand = (questionId) => {
//     if (expandedQuestionId === questionId) {
//       setExpandedQuestionId(null);
//     } else {
//       setExpandedQuestionId(questionId);
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };
//   // Calculate the data to display for the current page
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedQuestions = bookmarkedQuestions.slice(startIndex, endIndex);
//   const totalPages = Math.ceil(bookmarkedQuestions.length / pageSize);

//   if (loading) {
//     return <div>Loading bookmarks...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (bookmarkedQuestions.length === 0) {
//     return <div>No bookmarks available for this topic.</div>;
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="bg-white rounded-lg shadow-md">
//         <h2 className="text-xl md:text-2xl font-bold mb-4 w-full text-center text-gray-800">
//           Bookmarked Questions
//         </h2>
//         {paginatedQuestions.map((question, index) => (
//           <div
//             key={index}
//             className="mb-4 text-sm md:text-base shadow-lg rounded-lg p-4 "
//           >
//             <p
//               className="cursor-pointer whitespace-pre-line font-semibold"
//               onClick={() => toggleExpand(question._id)}
//             >
//               {`Question ${startIndex + index + 1}: ${question.questionText}`}
//             </p>
//             {expandedQuestionId === question._id && (
//               <div className="mt-2 bg-gradient-to-b from-white to-slate-100 rounded-lg p-2">
//                 {question.options.map((option, i) => (
//                   <p key={i} className="text-gray-700">
//                     {option}
//                   </p>
//                 ))}
//                 <p className="mt-4 text-gray-700">
//                   <span className="text-green-800 font-semibold bg-green-100 rounded-md">
//                     {`Correct Answer: ${question.correctAnswer}`}
//                   </span>
//                   <br />
//                   <br />
//                   <span className="whitespace-pre-line">
//                     <strong>Explanation:</strong> {question.explanation}
//                   </span>
//                 </p>
//               </div>
//             )}
//           </div>
//         ))}

//         {/* Pagination Controls */}
//         <div className="flex justify-center my-4 pb-4 gap-4">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => handlePageChange(currentPage - 1)}
//             className="px-4 py-2 mx-1 text-xs md:text-base bg-blue-500 text-white rounded disabled:bg-gray-400"
//           >
//             <GrCaretPrevious />
//           </button>
//           <span className="px-4 py-2 text-xs md:text-base mx-1 bg-gray-200 rounded">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => handlePageChange(currentPage + 1)}
//             className="px-4 text-xs md:text-base py-2 mx-1 bg-blue-500 text-white rounded disabled:bg-gray-400"
//           >
//             <GrCaretNext />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// BookmarkComponent.propTypes = {
//   userId: PropTypes.string.isRequired,
//   topicId: PropTypes.string.isRequired,
// };

// export default BookmarkComponent;

import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai"; // ✅ Import delete icon

const BookmarkComponent = ({ userId, topicId }) => {
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const token = localStorage.getItem("jwtToken");
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1"; // Server URL
  // const BASE_URL = "http://localhost:5000/api/v1";

  // ✅ Fetch Bookmarks on Component Mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/quiz/fetchAllBookmarks`, {
          params: { userId, topicId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const topicBookmark = response.data.bookmarks.find(
          (bookmark) => bookmark.topic._id === topicId
        );

        if (topicBookmark) {
          setBookmarkedQuestions(topicBookmark.questions);
        } else {
          setBookmarkedQuestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
        setError("Failed to fetch bookmarks");
      } finally {
        setLoading(false);
      }
    };

    if (userId && topicId) {
      fetchBookmarks();
    }
  }, [userId, topicId]);

  // ✅ Toggle Question Details
  const toggleExpand = (questionId) => {
    setExpandedQuestionId(
      expandedQuestionId === questionId ? null : questionId
    );
  };

  // ✅ Remove Bookmark Function
  const removeBookmark = async (questionId) => {
    try {
      await axios.delete(`${BASE_URL}/quiz/removeBookmark`, {
        data: { userId, topicId, questionId },
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Update UI after removal
      setBookmarkedQuestions((prev) =>
        prev.filter((question) => question._id !== questionId)
      );
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
      alert("Failed to remove bookmark. Try again.");
    }
  };

  // ✅ Pagination Logic
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedQuestions = bookmarkedQuestions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(bookmarkedQuestions.length / pageSize);

  // ✅ Loading & Error States
  if (loading) return <div>Loading bookmarks...</div>;
  if (error) return <div>{error}</div>;
  if (bookmarkedQuestions.length === 0)
    return <div>No bookmarks available for this topic.</div>;

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-bold mb-4 w-full text-center text-gray-800">
          Bookmarked Questions
        </h2>

        {paginatedQuestions.map((question, index) => (
          <div
            key={index}
            className="mb-4 text-sm md:text-base shadow-lg rounded-lg p-4 "
          >
            <div className="flex justify-between items-end ">
              <p
                className="cursor-pointer font-semibold text-gray-900"
                onClick={() => toggleExpand(question._id)}
              >
                {`Q${startIndex + index + 1}: ${question.questionText}`}
              </p>
              <button
                onClick={() => removeBookmark(question._id)}
                className="bg-red-200 text-red-600 hover:text-red-800 transition duration-200 ease-in-out p-1 rounded-md"
              >
                <AiOutlineDelete className="text-lg" />
              </button>
            </div>

            {expandedQuestionId === question._id && (
              <div className="mt-2 bg-gray-50 rounded-lg p-2">
                {question.options.map((option, i) => (
                  <p key={i} className="text-gray-700">
                    {option}
                  </p>
                ))}
                <p className="mt-4 text-gray-700">
                  <span className="text-green-800 font-semibold bg-green-100 rounded-md px-2 py-1">
                    {`Correct Answer: ${question.correctAnswer}`}
                  </span>
                  <br />
                  <br />
                  <span className="whitespace-pre-line">
                    <strong>Explanation:</strong> {question.explanation}
                  </span>
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Pagination Controls */}
        <div className="flex justify-center my-4 pb-4 gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 mx-1 text-xs md:text-base bg-blue-500 text-white rounded-full disabled:bg-gray-400"
          >
            <GrCaretPrevious />
          </button>
          <span className="px-4 py-2 text-xs md:text-base mx-1 bg-gray-200 rounded">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 text-xs md:text-base py-2 mx-1 bg-blue-500 text-white rounded-full disabled:bg-gray-400"
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
};

export default BookmarkComponent;
