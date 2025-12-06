import { useState, useEffect } from "react";
import axios from "axios";
// import Pagination from "./Pagination";
import { jwtDecode } from "jwt-decode";
import { FaTrash, FaRedo, FaEdit, FaSearch } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [newPassword] = useState("Undersigned@123");
  const [isAdmin, setIsAdmin] = useState(false);

  const [showEmail, setShowEmail] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  // ✅ Search Input State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1/";

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}userManagement`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
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

  // ✅ Function to Handle Search Input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination when searching
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (
      filter !== "all" &&
      (filter === "paid" ? !user.paymentMade : user.paymentMade)
    ) {
      return false;
    }

    // ✅ Search by Name, Email, or Mobile
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery)
    );
  });

  //For Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // ✅ Number of Page Numbers to Show
  const maxPageButtons = 3;

  // ✅ Function to Generate Page Range
  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  // ✅ Function to Navigate Pages
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}userManagement/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleUpdateUser = async (user) => {
    try {
      await axios.patch(`${BASE_URL}userManagement/${user._id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await axios.patch(
        `${BASE_URL}userManagement/${userId}/reset-password`,
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error resetting password", error);
    }
  };

  const handleChangePaymentStatus = async (user) => {
    const newPaymentStatus = !user.paymentMade;
    try {
      await axios.patch(
        `${BASE_URL}userManagement/${user._id}`,
        {
          paymentMade: newPaymentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error changing payment status", error);
    }
  };

  const handleInputChange = (e) => {
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
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
      <h2 className="text-lg md:text-xl font-bold mb-4 pl-4 text-center text-blue-700 tracking-wide">
        User Management
      </h2>
      <div className="mb-4 flex items-center justify-center gap-3 text-sm">
        <div className="mb-2 flex flex-col items-center justify-center gap-2">
          <label className="mr-0 font-semibold">Filter : </label>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="p-1 border rounded"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <div className="mb-4 ml-3 gap-2 text-center flex flex-col md:flex-row">
          <label className="mr-2 font-semibold">Show Columns: </label>
          <div className="flex gap-2 items-center justify-center">
            <label className="mr-2 text-xs md:text-sm lg:text-base">
              <input
                type="checkbox"
                checked={showEmail}
                onChange={() => setShowEmail(!showEmail)}
              />{" "}
              Email
            </label>
            <label className="mr-2 text-xs md:text-sm lg:text-base">
              <input
                type="checkbox"
                checked={showMobile}
                onChange={() => setShowMobile(!showMobile)}
              />{" "}
              Mobile
            </label>
            <label className="mr-2 text-xs md:text-sm lg:text-base">
              <input
                type="checkbox"
                checked={showBatch}
                onChange={() => setShowBatch(!showBatch)}
              />{" "}
              Batch
            </label>
          </div>
        </div>
      </div>

      {/* ✅ Search & Filter Section */}
      <div className="flex flex-wrap items-center justify-center gap-4 my-4">
        {/* Search Input */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile"
            value={searchQuery}
            onChange={handleSearchChange}
            className="text-sm pl-10 pr-3 py-2 border rounded-lg shadow-sm w-64 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Filter Dropdown */}
        <select
          value={filter}
          onChange={handleFilterChange}
          className="p-2 border rounded shadow-sm"
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-center text-sm md:text-base px-1">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4 border">Name</th>
              {showEmail && <th className="py-2 px-2 md:px-4 border">Email</th>}
              {showMobile && (
                <th className="py-2 px-2 md:px-4 border">Mobile</th>
              )}
              {showBatch && <th className="py-2 px-2 md:px-4 border">Batch</th>}
              <th className="py-2 px-2 md:px-4 border">Status</th>
              <th className="py-2 px-2 md:px-4 *:border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => {
              const activationDate = user.paymentMadeDate
                ? new Date(user.paymentMadeDate)
                : null;
              const today = new Date();
              const daysSinceActivation = activationDate
                ? Math.floor((today - activationDate) / (1000 * 60 * 60 * 24))
                : 0;

              return (
                <tr key={user._id}>
                  <td className="py-2 px-2 md:px-4 border">{user.name}</td>
                  {showEmail && (
                    <td className="py-2 px-2 md:px-4 border">{user.email}</td>
                  )}
                  {showMobile && (
                    <td className="py-2 px-2 md:px-4 border">{user.mobile}</td>
                  )}
                  {showBatch && (
                    <td className="py-2 px-2 md:px-4 border">{user.batch}</td>
                  )}
                  <td className="py-2 px-4 border">
                    {user.paymentMade ? "Paid" : "Unpaid"}

                    {/* ✅ Payment Activation Date (Only if Paid) */}
                    {user.paymentMade && user.paymentMadeDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Activated on:{" "}
                        <span className="font-semibold text-green-700">
                          {activationDate.toLocaleDateString()}
                        </span>
                        {/* ✅ Days Since Activation */}
                        <div
                          className={`mt-1 ${
                            daysSinceActivation > 365
                              ? "text-red-600 font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {daysSinceActivation} days since activation
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-2 md:px-4 border text-center flex gap-2 flex-col md:flex-row">
                    <div>
                      <button
                        onClick={() => handleChangePaymentStatus(user)}
                        className={` text-xs md:text-sm lg:text-base px-2 py-2 md:px-4 rounded ml-2 transition duration-200 ${
                          user.paymentMade
                            ? "bg-green-200 hover:bg-green-300 text-green-800"
                            : "bg-red-200 hover:bg-red-300 text-red-800"
                        } `}
                      >
                        {user.paymentMade ? `Mark as Unpaid ` : `Mark as Paid `}
                      </button>
                    </div>
                    <div className="flex gap-1 text-center items-center justify-center text-xs md:text-sm lg:text-base">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="bg-yellow-200 text-slate-500 px-4 py-2 rounded hover:bg-yellow-300 transition duration-200"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-500 transition duration-200"
                        disabled
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleResetPassword(user._id)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
                      >
                        <FaRedo />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ✅ Compact Pagination UI */}
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
          {getPageNumbers().map((page) => (
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
          ))}

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

      {editingUser && (
        <div className="mt-4 p-4 bg-white border rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-2">Edit User</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUser(editingUser);
            }}
          >
            <div className="mb-2">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={editingUser.name}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={editingUser.email}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Mobile:</label>
              <input
                type="text"
                name="mobile"
                value={editingUser.mobile}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Batch:</label>
              <input
                type="text"
                name="batch"
                value={editingUser.batch}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Payment Status:</label>
              <select
                name="paymentMade"
                value={editingUser.paymentMade}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    paymentMade: e.target.value === "true",
                  })
                }
                className="p-2 border rounded w-full"
              >
                <option value="true">Paid</option>
                <option value="false">Unpaid</option>
              </select>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-green-700 text-green-100 px-4 py-2 rounded hover:bg-green-200 transition duration-200"
              >
                Update
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-red-700 text-white px-4 py-2 rounded ml-2 hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
