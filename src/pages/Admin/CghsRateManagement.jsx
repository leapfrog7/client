// src/pages/Admin/CghsRateManagement.jsx

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const CghsRateManagement = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Delhi");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cghsCode: "",
    rates: {
      Delhi: { nabhRate: "", nonNabhRate: "" },
    },
    reference: "",
    note: "",
    tags: "",
  });
  const BASE_URL = "https://server-v4dy.onrender.com";
  // const BASE_URL = "http://localhost:5000";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ratesPerPage = 10;

  const [editId, setEditId] = useState(null);
  const nameInputRef = useRef(null);
  const token = localStorage.getItem("jwtToken"); // assuming your admin token is stored here
  useEffect(() => {
    if (modalOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [modalOpen]);

  // Filter based on search term

  const filteredRates = rates.filter((rate) => {
    const search = searchTerm.toLowerCase();
    return (
      rate.name.toLowerCase().includes(search) ||
      rate.category.toLowerCase().includes(search) ||
      rate.cghsCode?.toLowerCase().includes(search) ||
      (rate.rates &&
        rate.rates[selectedCity]?.nabhRate?.toString().includes(search)) ||
      (rate.rates &&
        rate.rates[selectedCity]?.nonNabhRate?.toString().includes(search))
    );
  });

  // Pagination logic
  const indexOfLastRate = currentPage * ratesPerPage;
  const indexOfFirstRate = indexOfLastRate - ratesPerPage;
  const currentRates = filteredRates.slice(indexOfFirstRate, indexOfLastRate);

  const totalPages = Math.ceil(filteredRates.length / ratesPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/cghsRateManagement/list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRates(response.data);
    } catch (error) {
      toast.error("Failed to fetch rates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    };
    try {
      if (editId) {
        await axios.put(
          `${BASE_URL}/api/v1/cghsRateManagement/updateCghsRate/${editId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Rate updated successfully");
      } else {
        await axios.post(
          `${BASE_URL}/api/v1/cghsRateManagement/addCghsRate`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Rate added successfully");
      }
      setModalOpen(false);
      fetchRates();
      setFormData({
        name: "",
        category: formData.category,
        cghsCode: "",
        rates: {
          Delhi: { nabhRate: "", nonNabhRate: "" },
        },
        reference: "",
        note: formData.note,
        tags: "",
      });
      setEditId(null);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (rate) => {
    setFormData({
      name: rate.name,
      description: rate.description || "",
      category: rate.category,
      cghsCode: rate.cghsCode || "",
      rates: rate.rates || { Delhi: { nabhRate: "", nonNabhRate: "" } },
      reference: rate.reference,
      note: rate.note,
      tags: rate.tags ? rate.tags.join(", ") : "",
    });
    setSelectedCity("Delhi"); // Default to Delhi when opening modal
    setEditId(rate._id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this rate?"))
      return;
    try {
      await axios.delete(
        `${BASE_URL}/api/v1/cghsRateManagement/deleteCghsRate/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Rate deactivated successfully");
      fetchRates();
    } catch (error) {
      toast.error("Failed to deactivate rate");
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">CGHS Rates Management</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            const nextCghsCode = rates.length;
            setFormData({
              ...formData,
              name: "",
              description: "",
              category: formData.category,
              cghsCode: nextCghsCode.toString(),
              rates: { Delhi: { nabhRate: "", nonNabhRate: "" } },
              reference: "",
              note: formData.note,
              tags: "",
            });
            setEditId(null);
            setModalOpen(true);
          }}
        >
          Add New Rate
        </button>
      </div>

      {/* Search + Pagination Controls */}
      <div className="flex justify-between items-center mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Name, Category, or Rate"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded w-1/3"
        />

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Name</th>
                <th className="border px-3 py-2 text-left">CGHS Code</th>
                <th className="border px-3 py-2 text-left">Category</th>
                <th className="border px-3 py-2 text-center">NABH Rate</th>
                <th className="border px-3 py-2 text-center">Non-NABH Rate</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRates.map((rate, idx) => (
                <tr
                  key={rate._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-3 py-2">{rate.name}</td>
                  <td className="border px-3 py-2">{rate.cghsCode || "N/A"}</td>
                  <td className="border px-3 py-2">{rate.category}</td>
                  <td className="border px-3 py-2 text-center">
                    {rate.rates &&
                    rate.rates[selectedCity]?.nabhRate !== undefined
                      ? rate.rates[selectedCity].nabhRate
                      : "N/A"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {rate.rates &&
                    rate.rates[selectedCity]?.nonNabhRate !== undefined
                      ? rate.rates[selectedCity].nonNabhRate
                      : "N/A"}
                  </td>

                  <td className="border px-3 py-2 text-center space-x-2">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      onClick={() => handleEdit(rate)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      onClick={() => handleDelete(rate._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (Same as before) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              {/* Add more cities if you want */}
            </select>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                ref={nameInputRef}
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full border p-2 rounded"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select Category</option>
                <option value="Procedure">Procedure</option>
                <option value="Test">Test</option>
                <option value="Implant">Implant</option>
                <option value="Medical Device">Medical Device</option>
                <option value="Others">Others</option>
              </select>

              <input
                name="cghsCode"
                placeholder="CGHS Code (optional)"
                value={formData.cghsCode}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="nonNabhRate"
                placeholder={`Non-NABH Rate for ${selectedCity}`}
                value={formData.rates[selectedCity]?.nonNabhRate || ""}
                onChange={(e) => {
                  const updatedRates = {
                    ...formData.rates,
                    [selectedCity]: {
                      ...formData.rates[selectedCity],
                      nonNabhRate: e.target.value,
                    },
                  };
                  setFormData({ ...formData, rates: updatedRates });
                }}
                type="number"
                className="w-full border p-2 rounded"
              />
              <input
                name="nabhRate"
                placeholder={`NABH Rate for ${selectedCity}`}
                value={formData.rates[selectedCity]?.nabhRate || ""}
                onChange={(e) => {
                  const updatedRates = {
                    ...formData.rates,
                    [selectedCity]: {
                      ...formData.rates[selectedCity],
                      nabhRate: e.target.value,
                    },
                  };
                  setFormData({ ...formData, rates: updatedRates });
                }}
                type="number"
                className="w-full border p-2 rounded"
              />
              <input
                name="reference"
                placeholder="Reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="note"
                placeholder="Note"
                value={formData.note}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="tags"
                placeholder="Tags (comma separated)"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editId ? "Update" : "Add"} Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CghsRateManagement;
