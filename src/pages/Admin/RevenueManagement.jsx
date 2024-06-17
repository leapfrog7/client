import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Pagination from "./Pagination";

const RevenueManagement = () => {
  const [revenueEntries, setRevenueEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("jwtToken");

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1/";

  useEffect(() => {
    checkAdminStatus();
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const response = await axios.get(`${BASE_URL}revenue`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRevenueEntries(response.data);
      calculateTotalRevenue(response.data);
    } catch (error) {
      console.error("Error fetching revenue", error);
    }
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

  const calculateTotalRevenue = (entries) => {
    const total = entries.reduce(
      (sum, entry) => sum + (entry.confirmed ? entry.amount : 0),
      0
    );
    setTotalRevenue(total);
  };

  const handleConfirm = async (revenueId) => {
    try {
      await axios.patch(
        `${BASE_URL}revenue/${revenueId}`,
        {
          confirmed: true,
          amount: 999,
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

  // Get current entries
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = revenueEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
      <h2 className="text-xl md:text-2xl font-bold mb-4 ml-4">
        Revenue Management
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm md:text-base text-center px-1">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4 border">Name</th>
              <th className="py-2 px-2 md:px-4 border">Amount</th>
              <th className="py-2 px-2 md:px-4 border">Confirmed</th>
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
                <td className="py-2 px-2 md:px-4 border">
                  {entry.confirmed ? "Yes" : "No"}
                </td>
                <td className="py-2 px-2 md:px-4 border text-xs">
                  {editingEntry && editingEntry._id === entry._id ? (
                    <button
                      onClick={handleEditSave}
                      className="bg-blue-500 text-white px-2 md:px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      {!entry.confirmed && (
                        <button
                          onClick={() => handleConfirm(entry._id)}
                          className="bg-green-200 text-green-700 px-2 md:px-4 py-2 rounded hover:bg-green-300 transition duration-200"
                        >
                          Add to Revenue
                        </button>
                      )}
                      {entry.confirmed && (
                        <button
                          onClick={() => handleRefund(entry._id)}
                          className="bg-red-500 text-white px-2 md:px-4 py-2 rounded hover:bg-red-700 transition duration-200"
                        >
                          Remove Revenue
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(entry)}
                        className="bg-yellow-100 text-yellow-700 px-2 md:px-4 py-2 rounded ml-2 hover:bg-yellow-300 transition duration-200 mt-2 md:mt-0"
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

      <Pagination
        entriesPerPage={entriesPerPage}
        totalEntries={revenueEntries.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      <div className="mt-4">
        <h3 className="text-xl font-bold">Total Revenue: ₹{totalRevenue}</h3>
      </div>
    </div>
  );
};

export default RevenueManagement;
