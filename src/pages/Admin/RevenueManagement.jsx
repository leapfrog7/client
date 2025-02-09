// import { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import Pagination from "./Pagination";

// const RevenueManagement = () => {
//   const [revenueEntries, setRevenueEntries] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [entriesPerPage] = useState(10);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [editingEntry, setEditingEntry] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const token = localStorage.getItem("jwtToken");

//   const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
//   // const BASE_URL = "http://localhost:5000/api/v1/";

//   useEffect(() => {
//     checkAdminStatus();
//     fetchRevenue();
//   }, []);

//   const fetchRevenue = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}revenue`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setRevenueEntries(response.data);
//       calculateTotalRevenue(response.data);
//     } catch (error) {
//       console.error("Error fetching revenue", error);
//     }
//   };

//   const checkAdminStatus = () => {
//     const token = localStorage.getItem("jwtToken");
//     if (token) {
//       const decodedToken = jwtDecode(token);
//       if (decodedToken.userType === "Admin") {
//         setIsAdmin(true);
//       } else {
//         setIsAdmin(false);
//       }
//     } else {
//       setIsAdmin(false);
//     }
//   };

//   const calculateTotalRevenue = (entries) => {
//     const total = entries.reduce(
//       (sum, entry) => sum + (entry.confirmed ? entry.amount : 0),
//       0
//     );
//     setTotalRevenue(total);
//   };

//   const handleConfirm = async (revenueId) => {
//     try {
//       await axios.patch(
//         `${BASE_URL}revenue/${revenueId}`,
//         {
//           confirmed: true,
//           amount: 999,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchRevenue();
//     } catch (error) {
//       console.error("Error confirming revenue", error);
//     }
//   };

//   const handleRefund = async (revenueId) => {
//     try {
//       await axios.patch(
//         `${BASE_URL}revenue/${revenueId}`,
//         {
//           confirmed: false,
//           amount: 0,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       fetchRevenue();
//     } catch (error) {
//       console.error("Error refunding revenue", error);
//     }
//   };

//   const handleEditAmount = async (revenueId, newAmount) => {
//     try {
//       await axios.patch(
//         `${BASE_URL}revenue/${revenueId}`,
//         {
//           amount: newAmount,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setEditingEntry(null);
//       fetchRevenue();
//     } catch (error) {
//       console.error("Error updating amount", error);
//     }
//   };

//   const handleEditClick = (entry) => {
//     setEditingEntry({ ...entry });
//   };

//   const handleEditChange = (e) => {
//     setEditingEntry({ ...editingEntry, amount: e.target.value });
//   };

//   const handleEditSave = () => {
//     handleEditAmount(editingEntry._id, parseFloat(editingEntry.amount));
//   };

//   // Get current entries
//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = revenueEntries.slice(
//     indexOfFirstEntry,
//     indexOfLastEntry
//   );

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   //To throw Unauthorized Access information is user is Not Admin
//   if (!isAdmin) {
//     return (
//       <div className="p-8 mx-auto flex flex-col text-center gap-4 ">
//         <span className="text-3xl bg-red-100 text-red-800 py-6">
//           Unauthorized Access
//         </span>
//         <a href="/" className="text-blue-500 text-xl">
//           Go Home
//         </a>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 className="text-xl md:text-2xl font-bold mb-4 ml-4">
//         Revenue Management
//       </h2>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border text-sm md:text-base text-center px-1">
//           <thead>
//             <tr>
//               <th className="py-2 px-2 md:px-4 border">Name</th>
//               <th className="py-2 px-2 md:px-4 border">Amount</th>
//               <th className="py-2 px-2 md:px-4 border">Confirmed</th>
//               <th className="py-2 px-2 md:px-4 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentEntries.map((entry) => (
//               <tr key={entry._id} className="hover:bg-sky-50">
//                 <td className="py-2 px-2 md:px-4 border">
//                   {entry.userId.name}
//                 </td>
//                 <td className="py-2 px-2 md:px-4 border">
//                   {editingEntry && editingEntry._id === entry._id ? (
//                     <input
//                       type="number"
//                       value={editingEntry.amount}
//                       onChange={handleEditChange}
//                       className="p-1 border rounded w-24 sm:w-32"
//                     />
//                   ) : (
//                     `₹${entry.amount}`
//                   )}
//                 </td>
//                 <td className="py-2 px-2 md:px-4 border">
//                   {entry.confirmed ? "Yes" : "No"}
//                 </td>
//                 <td className="py-2 px-2 md:px-4 border text-xs">
//                   {editingEntry && editingEntry._id === entry._id ? (
//                     <button
//                       onClick={handleEditSave}
//                       className="bg-blue-500 text-white px-2 md:px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <>
//                       {!entry.confirmed && (
//                         <button
//                           onClick={() => handleConfirm(entry._id)}
//                           className="bg-green-200 text-green-700 px-2 md:px-4 py-2 rounded hover:bg-green-300 transition duration-200"
//                         >
//                           Add to Revenue
//                         </button>
//                       )}
//                       {entry.confirmed && (
//                         <button
//                           onClick={() => handleRefund(entry._id)}
//                           className="bg-red-500 text-white px-2 md:px-4 py-2 rounded hover:bg-red-700 transition duration-200"
//                         >
//                           Remove Revenue
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleEditClick(entry)}
//                         className="bg-yellow-100 text-yellow-700 px-2 md:px-4 py-2 rounded ml-2 hover:bg-yellow-300 transition duration-200 mt-2 md:mt-0"
//                       >
//                         Edit Amount
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Pagination
//         entriesPerPage={entriesPerPage}
//         totalEntries={revenueEntries.length}
//         paginate={paginate}
//         currentPage={currentPage}
//       />
//       <div className="mt-4">
//         <h3 className="text-xl font-bold">Total Revenue: ₹{totalRevenue}</h3>
//       </div>
//     </div>
//   );
// };

// export default RevenueManagement;

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const RevenueManagement = () => {
  const [revenueEntries, setRevenueEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10; // Number of entries per page

  const [editingEntry, setEditingEntry] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("jwtToken");

  //Revenue States
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [pendingRevenue, setPendingRevenue] = useState(0);
  const [transactionsCount, setTransactionsCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1/";

  const [searchQuery, setSearchQuery] = useState(""); // For the search input

  useEffect(() => {
    checkAdminStatus();
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`${BASE_URL}revenue`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const revenueData = response.data;

      setRevenueEntries(revenueData);
      calculateMetrics(revenueData);
    } catch (error) {
      console.error("Error fetching revenue", error);
    }
  };

  const calculateMetrics = (entries) => {
    const total = entries.reduce(
      (sum, entry) => sum + (entry.confirmed ? entry.amount : 0),
      0
    );

    const pending = entries.reduce(
      (sum, entry) => sum + (!entry.confirmed ? entry.amount : 0),
      0
    );

    const transactions = entries.length;

    const active = new Set(
      entries
        .filter((entry) => entry.confirmed)
        .map((entry) => entry.userId._id)
    ).size;

    setTotalRevenue(total);
    setPendingRevenue(pending);
    setTransactionsCount(transactions);
    setActiveUsers(active);
  };

  const checkAdminStatus = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.userType === "Admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  };

  // const calculateTotalRevenue = (entries) => {
  //   const total = entries.reduce(
  //     (sum, entry) => sum + (entry.confirmed ? entry.amount : 0),
  //     0
  //   );
  //   setTotalRevenue(total);
  // };

  const handleConfirm = async (revenueId) => {
    try {
      await axios.patch(
        `${BASE_URL}revenue/${revenueId}`,
        {
          confirmed: true,
          amount: 1199,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRevenue();
    } catch (error) {
      console.error("Error confirming revenue", error);
    }
  };

  const handleRefund = async (revenueId) => {
    try {
      await axios.patch(
        `${BASE_URL}revenue/${revenueId}`,
        {
          confirmed: false,
          amount: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchRevenue();
    } catch (error) {
      console.error("Error refunding revenue", error);
    }
  };

  const handleEditAmount = async (revenueId, newAmount) => {
    try {
      await axios.patch(
        `${BASE_URL}revenue/${revenueId}`,
        {
          amount: newAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingEntry(null);
      fetchRevenue();
    } catch (error) {
      console.error("Error updating amount", error);
    }
  };

  const handleEditClick = (entry) => {
    setEditingEntry({ ...entry });
  };

  const handleEditChange = (e) => {
    setEditingEntry({ ...editingEntry, amount: e.target.value });
  };

  const handleEditSave = () => {
    handleEditAmount(editingEntry._id, parseFloat(editingEntry.amount));
  };

  // ✅ Filter Revenue Entries Based on Search Query
  const filteredEntries = revenueEntries.filter((entry) =>
    entry.userId.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Pagination Logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  // ✅ Apply Pagination After Filtering
  const currentEntries = filteredEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  // const currentEntries = revenueEntries.slice(
  //   indexOfFirstEntry,
  //   indexOfLastEntry
  // );
  //const totalPages = Math.ceil(revenueEntries.length / entriesPerPage);

  // ✅ Function to Navigate Pages
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  //To throw Unauthorized Access information is user is Not Admin
  if (!isAdmin) {
    return (
      <div className="p-8 mx-auto flex flex-col text-center gap-4 ">
        <span className="text-3xl bg-red-100 text-red-800 py-6">
          Unauthorized Access
        </span>
        <a href="/" className="text-blue-500 text-xl">
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 ml-4 text-center text-amber-600 tracking-wide">
        Revenue Management
      </h2>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-4 my-2 md:my-4 lg:my-6">
          <div className="bg-gradient-to-tl from-cyan-100 to-blue-200 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-sm md:text-lg lg:text-xl font-semibold">
              Total Revenue
            </h3>
            <p className="text-sm md:text-lg lg:text-xl font-semibold text-blue-800">
              ₹{totalRevenue}
            </p>
          </div>

          <div className="bg-gradient-to-tl from-amber-200 to-yellow-400 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-xs md:text-base md:text-lg lg:text-xl font-semibold">
              Pending Revenue
            </h3>
            <p className="text-sm md:text-lg lg:text-xl font-semibold text-yellow-700">
              ₹{pendingRevenue}
            </p>
          </div>

          <div className="bg-gradient-to-tl from-green-300 to-cyan-400 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-sm md:text-lg lg:text-xl font-semibold">
              Total Transactions
            </h3>
            <p className="text-sm md:text-lg lg:text-xl font-semibold text-green-700">
              {transactionsCount}
            </p>
          </div>

          <div className="bg-gradient-to-tl from-rose-200 to-pink-400 p-4 rounded-lg shadow-md text-center">
            <h3 className="text-sm md:text-lg lg:text-xl font-semibold">
              Active Users
            </h3>
            <p className="text-sm md:text-lg lg:text-xl font-semibold text-purple-700">
              {activeUsers}
            </p>
          </div>
        </div>

        <div className="flex justify-center my-6">
          <div className="relative w-full max-w-md">
            {/* ✅ Search Icon */}
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </span>

            {/* ✅ Search Input */}
            <input
              type="text"
              placeholder="Search by User Name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // ✅ Reset pagination when searching
              }}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none  focus:border-blue-400 transition duration-100 ease-in-out shadow-md hover:shadow-lg"
            />
          </div>
        </div>

        <table className="min-w-full bg-white border text-xs md:text-base text-center px-1">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4 border">Name</th>
              <th className="py-2 px-2 md:px-4 border">Amount</th>
              <th className="py-2 px-2 md:px-4 border">Status</th>
              <th className="py-2 px-2 md:px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry) => (
              <tr key={entry._id} className="hover:bg-sky-50">
                <td className="py-2 px-2 md:px-4 border">
                  {entry.userId.name}
                </td>
                <td className="py-2 px-2 md:px-4 border">
                  {editingEntry && editingEntry._id === entry._id ? (
                    <input
                      type="number"
                      value={editingEntry.amount}
                      onChange={handleEditChange}
                      className="p-1 border rounded w-24 sm:w-32"
                    />
                  ) : (
                    `₹${entry.amount}`
                  )}
                </td>
                {/* ✅ Status Badge */}
                <td className="py-2 px-4 border">
                  <span
                    className={`px-3 py-1 rounded-full text-xs md:text-base font-semibold ${
                      entry.confirmed
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {entry.confirmed ? "Confirmed" : "Pending"}
                  </span>
                </td>
                {/* ✅ Actions */}
                <td className="py-2 px-4 border flex justify-center gap-2">
                  {editingEntry && editingEntry._id === entry._id ? (
                    <>
                      <input
                        type="number"
                        value={editingEntry.amount}
                        onChange={(e) =>
                          setEditingEntry({
                            ...editingEntry,
                            amount: e.target.value,
                          })
                        }
                        className="px-2 py-1 border rounded w-20 text-center"
                      />
                      <button
                        onClick={handleEditSave}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingEntry(null)}
                        className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {entry.confirmed ? (
                        <button
                          onClick={() => handleRefund(entry._id)}
                          className="bg-red-700 text-white px-2 rounded hover:bg-red-600 transition"
                        >
                          Refund
                        </button>
                      ) : (
                        <button
                          onClick={() => handleConfirm(entry._id)}
                          className="bg-green-700 text-white px-2 rounded hover:bg-green-600 transition "
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(entry)}
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-500 transition"
                      >
                        Edit Amount
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Compact Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 text-sm">
          {/* First Button */}
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:bg-gray-100"
          >
            First
          </button>

          {/* Previous Button */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:bg-gray-100"
          >
            Prev
          </button>

          {/* Dynamic Page Numbers */}
          {Array.from({ length: Math.min(3, totalPages) }, (_, index) => {
            const page = Math.max(1, currentPage - 2) + index;
            return (
              page <= totalPages && (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              )
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:bg-gray-100"
          >
            Next
          </button>

          {/* Last Button */}
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:bg-gray-100"
          >
            Last
          </button>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-bold">Total Revenue: ₹{totalRevenue}</h3>
      </div>
    </div>
  );
};

export default RevenueManagement;
