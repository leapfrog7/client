import { useState, useEffect } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
  //   const BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/checkAdmin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        setUsers(response.data.users);
      } catch (err) {
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const updatePaymentStatus = async (userId, paymentMade) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/checkAdmin`,
        { userId, paymentMade },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, paymentMade } : user
        )
      );
      console.log(response.data);
    } catch (err) {
      setError("Failed to update payment status");
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? It cannot be undone so please be 100% sure!"
    );
    if (!confirmDelete) return;
    try {
      await axios.delete(`${BASE_URL}/checkAdmin/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      // Remove the deleted user from the state
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Page</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>

              <th className="text-center py-3 px-6 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="py-3 px-6 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="py-4 px-6 border-b border-gray-200">
                  {user.name}
                </td>

                <td className=" text-center py-4 px-6 border-b border-gray-200">
                  <span
                    className={`px-6 py-2  text-sm ${
                      user.paymentMade
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.paymentMade ? "Paid" : "Not paid"}
                  </span>
                </td>
                <td className="text-center py-4 px-2 border-b border-gray-200 flex flex-col md:flex-row items-center">
                  <button
                    onClick={() =>
                      updatePaymentStatus(user._id, !user.paymentMade)
                    }
                    className={`px-4 py-2 rounded-xl text-white ${
                      user.paymentMade ? "bg-green-600" : "bg-red-600"
                    } hover:${
                      user.paymentMade ? "bg-green-800" : "bg-red-800"
                    }`}
                  >
                    {user.paymentMade ? "Paid" : "Not Paid"}
                  </button>
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="px-4 py-2 text-2xl  text-gray-600 ml-4 hover:text-red-800"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
