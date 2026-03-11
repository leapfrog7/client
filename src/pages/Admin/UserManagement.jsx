import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaTrash, FaRedo, FaEdit, FaSearch } from "react-icons/fa";

const USERS_PER_PAGE = 10;
const MAX_PAGE_BUTTONS = 5;

const UserManagement = () => {
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/";
  // const BASE_URL = "http://localhost:5000/api/v1/";

  const token = localStorage.getItem("jwtToken");

  const authHeaders = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token],
  );

  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all"); // all | paid | unpaid
  const [searchQuery, setSearchQuery] = useState("");

  const [showEmail, setShowEmail] = useState(false);
  const [showMobile, setShowMobile] = useState(false);
  const [showBatch, setShowBatch] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [editingUser, setEditingUser] = useState(null);

  const DEFAULT_RESET_PASSWORD = "Undersigned@123";

  // ---- Admin check ----
  useEffect(() => {
    const t = localStorage.getItem("jwtToken");
    if (!t) {
      setIsAdmin(false);
      return;
    }
    try {
      const decoded = jwtDecode(t);
      setIsAdmin(decoded?.userType === "Admin");
    } catch {
      setIsAdmin(false);
    }
  }, []);

  // ---- Fetch Users ----
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}userManagement`,
          authHeaders,
        );
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching users", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin, BASE_URL, authHeaders]);

  // ---- Derived: filtered & searched ----
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return (users || []).filter((user) => {
      // Filter paid/unpaid
      if (filter === "paid" && !user.paymentMade) return false;
      if (filter === "unpaid" && user.paymentMade) return false;

      if (!q) return true;

      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const mobile = String(user.mobile || "");

      return (
        name.includes(q) ||
        email.includes(q) ||
        mobile.includes(searchQuery.trim()) // keep numeric search friendly
      );
    });
  }, [users, filter, searchQuery]);

  // ---- Pagination ----
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE)),
    [filteredUsers.length],
  );

  // Reset page on filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  // Clamp page if list shrinks
  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = useMemo(
    () => filteredUsers.slice(indexOfFirstUser, indexOfLastUser),
    [filteredUsers, indexOfFirstUser, indexOfLastUser],
  );

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

  const paginate = (pageNumber) => {
    setCurrentPage((p) => {
      const next = Math.min(Math.max(1, pageNumber), totalPages);
      return next === p ? p : next;
    });
  };

  // ---- Handlers ----
  const handleEditUser = (user) => setEditingUser({ ...user });

  const handleInputChange = (e) => {
    setEditingUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateUser = async (user) => {
    if (!user?._id) return;

    setActionLoadingId(user._id);
    try {
      await axios.patch(
        `${BASE_URL}userManagement/${user._id}`,
        user,
        authHeaders,
      );

      // ✅ Update local state instead of refetching everything
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, ...user } : u)),
      );
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResetPassword = async (userId) => {
    if (!userId) return;

    setActionLoadingId(userId);
    try {
      await axios.patch(
        `${BASE_URL}userManagement/${userId}/reset-password`,
        { password: DEFAULT_RESET_PASSWORD },
        authHeaders,
      );
      // no need to refetch users
    } catch (error) {
      console.error("Error resetting password", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleChangePaymentStatus = async (user) => {
    if (!user?._id) return;

    const newPaymentStatus = !user.paymentMade;

    setActionLoadingId(user._id);
    try {
      await axios.patch(
        `${BASE_URL}userManagement/${user._id}`,
        { paymentMade: newPaymentStatus },
        authHeaders,
      );

      // ✅ Update local state for smooth UI
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? {
                ...u,
                paymentMade: newPaymentStatus,
                // keep date if server sets it; otherwise leave as-is
                paymentMadeDate: newPaymentStatus
                  ? u.paymentMadeDate || new Date().toISOString()
                  : u.paymentMadeDate,
              }
            : u,
        ),
      );
    } catch (error) {
      console.error("Error changing payment status", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete is currently disabled in your UI; kept here for future
  const handleDeleteUser = async (userId) => {
    if (!userId) return;

    setActionLoadingId(userId);
    try {
      await axios.delete(`${BASE_URL}userManagement/${userId}`, authHeaders);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error deleting user", error);
    } finally {
      setActionLoadingId(null);
    }
  };

  // ---- Unauthorized ----
  if (!isAdmin) {
    return (
      <div className="p-8 mx-auto flex flex-col text-center gap-4">
        <span className="text-3xl bg-red-100 text-red-800 py-6">
          Unauthorized Access
        </span>
        <a href="/" className="text-blue-500 text-xl">
          Go Home
        </a>
      </div>
    );
  }

  // ---- UI ----
  return (
    <div className=" md:px-4">
      <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-blue-700 tracking-wide">
        User Management
      </h2>

      {/* Controls */}
      <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-3 md:p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          {/* Search */}
          <div className="w-full md:w-[360px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                type="text"
                placeholder="Name, email, mobile"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm w-full pl-10 pr-3 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="w-full md:w-[180px]">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border rounded-xl shadow-sm"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          {/* Columns */}
          <div className="w-full md:w-auto">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Columns
            </label>
            <div className="flex flex-wrap gap-3 items-center">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showEmail}
                  onChange={() => setShowEmail((v) => !v)}
                />
                Email
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showMobile}
                  onChange={() => setShowMobile((v) => !v)}
                />
                Mobile
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showBatch}
                  onChange={() => setShowBatch((v) => !v)}
                />
                Batch
              </label>
            </div>
          </div>
        </div>

        {/* Summary row */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredUsers.length}
            </span>{" "}
            users
            {searchQuery.trim() ? (
              <>
                {" "}
                • search:{" "}
                <span className="font-semibold text-gray-800">
                  “{searchQuery.trim()}”
                </span>
              </>
            ) : null}
          </div>

          <div>
            Page{" "}
            <span className="font-semibold text-gray-800">{currentPage}</span>{" "}
            of <span className="font-semibold text-gray-800">{totalPages}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full bg-white border text-center text-sm md:text-base">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-2 md:px-4 border">Name</th>
              {showEmail && <th className="py-2 px-2 md:px-4 border">Email</th>}
              {showMobile && (
                <th className="py-2 px-2 md:px-4 border">Mobile</th>
              )}
              {showBatch && <th className="py-2 px-2 md:px-4 border">Batch</th>}
              <th className="py-2 px-2 md:px-4 border">Status</th>
              <th className="py-2 px-2 md:px-4 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  className="py-6 px-4 text-gray-600"
                  colSpan={
                    3 +
                    (showEmail ? 1 : 0) +
                    (showMobile ? 1 : 0) +
                    (showBatch ? 1 : 0)
                  }
                >
                  Loading users…
                </td>
              </tr>
            ) : currentUsers.length ? (
              currentUsers.map((user) => {
                const activationDate = user.paymentMadeDate
                  ? new Date(user.paymentMadeDate)
                  : null;
                const today = new Date();
                const daysSinceActivation = activationDate
                  ? Math.floor((today - activationDate) / (1000 * 60 * 60 * 24))
                  : 0;

                const isRowBusy = actionLoadingId === user._id;

                return (
                  <tr key={user._id} className={isRowBusy ? "opacity-70" : ""}>
                    <td className="py-2 px-2 md:px-4 border">{user.name}</td>

                    {showEmail && (
                      <td className="py-2 px-2 md:px-4 border">{user.email}</td>
                    )}

                    {showMobile && (
                      <td className="py-2 px-2 md:px-4 border">
                        {user.mobile}
                      </td>
                    )}

                    {showBatch && (
                      <td className="py-2 px-2 md:px-4 border">{user.batch}</td>
                    )}

                    <td className="py-2 px-2 md:px-4 border">
                      <div className="font-semibold">
                        {user.paymentMade ? (
                          <span className="text-green-700">Paid</span>
                        ) : (
                          <span className="text-red-700">Unpaid</span>
                        )}
                      </div>

                      {user.paymentMade && activationDate ? (
                        <div className="text-xs text-gray-500 mt-1">
                          Activated on:{" "}
                          <span className="font-semibold text-green-700">
                            {activationDate.toLocaleDateString()}
                          </span>
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
                      ) : null}
                    </td>

                    <td className="py-2 px-2 md:px-4 border">
                      <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                        <button
                          onClick={() => handleChangePaymentStatus(user)}
                          disabled={isRowBusy}
                          className={`text-xs md:text-sm px-3 py-2 rounded-lg transition duration-200 border
                            ${
                              user.paymentMade
                                ? "bg-green-50 hover:bg-green-100 text-green-800 border-green-200"
                                : "bg-red-50 hover:bg-red-100 text-red-800 border-red-200"
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {user.paymentMade ? "Mark Unpaid" : "Mark Paid"}
                        </button>

                        <div className="flex gap-2 items-center justify-center">
                          <button
                            onClick={() => handleEditUser(user)}
                            disabled={isRowBusy}
                            className="bg-yellow-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-yellow-200 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-gray-200 text-gray-500 px-3 py-2 rounded-lg"
                            disabled
                            title="Delete (disabled)"
                          >
                            <FaTrash />
                          </button>

                          <button
                            onClick={() => handleResetPassword(user._id)}
                            disabled={isRowBusy}
                            className="bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            title="Reset password"
                          >
                            <FaRedo />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  className="py-6 px-4 text-gray-600"
                  colSpan={
                    3 +
                    (showEmail ? 1 : 0) +
                    (showMobile ? 1 : 0) +
                    (showBatch ? 1 : 0)
                  }
                >
                  No users found for the current filter/search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-sm">
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:bg-gray-100"
          >
            First
          </button>

          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:bg-gray-100"
          >
            Prev
          </button>

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

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:bg-gray-100"
          >
            Next
          </button>

          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition disabled:bg-gray-100"
          >
            Last
          </button>
        </div>
      )}

      {/* Edit modal/panel */}
      {editingUser && (
        <div className="mt-6 mx-auto max-w-3xl p-4 bg-white border rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-3">Edit User</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUser(editingUser);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={editingUser.name || ""}
                onChange={handleInputChange}
                className="p-2 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={editingUser.email || ""}
                onChange={handleInputChange}
                className="p-2 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={editingUser.mobile || ""}
                onChange={handleInputChange}
                className="p-2 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Batch</label>
              <input
                type="text"
                name="batch"
                value={editingUser.batch || ""}
                onChange={handleInputChange}
                className="p-2 border rounded-xl w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">
                Payment Status
              </label>
              <select
                name="paymentMade"
                value={String(!!editingUser.paymentMade)}
                onChange={(e) =>
                  setEditingUser((prev) => ({
                    ...prev,
                    paymentMade: e.target.value === "true",
                  }))
                }
                className="p-2 border rounded-xl w-full"
              >
                <option value="true">Paid</option>
                <option value="false">Unpaid</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800 transition duration-200"
                disabled={actionLoadingId === editingUser._id}
              >
                Update
              </button>

              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300 transition duration-200"
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
