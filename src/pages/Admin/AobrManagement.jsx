import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes } from "react-icons/fa";
import DeleteConfirmation from "../../components/DeleteConfirmation";

const MinistryWorkAllocation = () => {
  const [ministries, setMinistries] = useState([]);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [newWork, setNewWork] = useState("");
  const [editingWorkIndex, setEditingWorkIndex] = useState(null);
  const [originalWork, setOriginalWork] = useState("");
  const [editingMinistry, setEditingMinistry] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const token = localStorage.getItem("jwtToken");
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
  // const BASE_URL = "http://localhost:5000/api/v1/";

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    try {
      const response = await axios.get(`${BASE_URL}aobrManagement`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const filteredMinistries = response.data.filter(
        (ministry) =>
          ministry.allocatedWork && ministry.allocatedWork.length > 0
      );
      setMinistries(filteredMinistries);
    } catch (error) {
      console.error("Error fetching ministries", error);
    }
  };

  const handleMinistryChange = (e) => {
    const selectedId = e.target.value;
    const ministry = ministries.find((ministry) => ministry._id === selectedId);
    setSelectedMinistry(ministry);
  };

  const handleAddWorkChange = (e) => {
    setNewWork(e.target.value);
  };

  const handleAddWork = async () => {
    if (!newWork.trim()) {
      alert("Work description cannot be empty.");
      return;
    }

    const updatedMinistry = {
      ...selectedMinistry,
      allocatedWork: [
        ...selectedMinistry.allocatedWork,
        { description: newWork },
      ],
    };

    try {
      await axios.put(
        `${BASE_URL}aobrManagement/${selectedMinistry._id}`,
        updatedMinistry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedMinistry(updatedMinistry);
      setNewWork("");
      fetchMinistries();
    } catch (error) {
      console.error("Error adding work", error);
    }
  };

  const handleEditWorkChange = (index, value) => {
    const updatedWork = [...selectedMinistry.allocatedWork];
    updatedWork[index].description = value;
    setSelectedMinistry({ ...selectedMinistry, allocatedWork: updatedWork });
  };

  const handleEditClick = (index) => {
    setOriginalWork(selectedMinistry.allocatedWork[index].description);
    setEditingWorkIndex(index);
  };

  const handleCancelEdit = () => {
    const updatedWork = [...selectedMinistry.allocatedWork];
    updatedWork[editingWorkIndex].description = originalWork;
    setSelectedMinistry({ ...selectedMinistry, allocatedWork: updatedWork });
    setEditingWorkIndex(null);
  };

  const handleSaveEdit = async () => {
    if (
      editingWorkIndex === null ||
      !selectedMinistry.allocatedWork[editingWorkIndex].description.trim()
    ) {
      alert("Work description cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}aobrManagement/${selectedMinistry._id}`,
        selectedMinistry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingWorkIndex(null);
      fetchMinistries();
    } catch (error) {
      console.error("Error updating work", error);
    }
  };

  const handleDeleteWork = (index) => {
    setDeleteIndex(index);
    setIsModalOpen(true);
  };

  const confirmDeleteWork = async () => {
    const updatedMinistry = {
      ...selectedMinistry,
      allocatedWork: selectedMinistry.allocatedWork.filter(
        (_, i) => i !== deleteIndex
      ),
    };

    try {
      await axios.put(
        `${BASE_URL}aobrManagement/${selectedMinistry._id}`,
        updatedMinistry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedMinistry(updatedMinistry);
      fetchMinistries();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting work", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMinistryNameChange = (e) => {
    const { name, value } = e.target;
    setSelectedMinistry({ ...selectedMinistry, [name]: value });
  };

  const handleSaveMinistryEdit = async () => {
    try {
      await axios.put(
        `${BASE_URL}aobrManagement/${selectedMinistry._id}`,
        selectedMinistry,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingMinistry(false);
      fetchMinistries();
    } catch (error) {
      console.error("Error updating ministry", error);
    }
  };

  return (
    <div className="p-4">
      <DeleteConfirmation
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDeleteWork}
        title="Confirm Deletion"
        message="Are you sure you want to delete this work item? This action cannot be undone."
      />

      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Ministry Work Allocation
      </h2>

      <div className="mb-4 text-sm md:text-base">
        <label className="block mb-2 text-sm md:text-base">
          Select Ministry/Department
        </label>
        <select
          onChange={handleMinistryChange}
          className="p-2 border rounded w-full mb-4"
        >
          <option className="text-sm md:text-base" value="">
            Select a Ministry/Department
          </option>
          {ministries.map((ministry) => (
            <option
              className="text-sm md:text-base w-11/12"
              key={ministry._id}
              value={ministry._id}
            >
              {ministry.name} ({ministry.type})
            </option>
          ))}
        </select>
      </div>

      {selectedMinistry && (
        <div className="bg-white p-4 rounded shadow-lg">
          {editingMinistry ? (
            <>
              <input
                type="text"
                name="name"
                value={selectedMinistry.name}
                onChange={handleMinistryNameChange}
                className="p-2 border rounded w-full mb-2"
              />
              {selectedMinistry.type === "Department" && (
                <div>
                  <label className="block mb-2">Parent Ministry</label>
                  <select
                    name="parent"
                    value={selectedMinistry.parent}
                    onChange={handleMinistryNameChange}
                    className="p-2 border rounded w-full mb-2"
                  >
                    <option value="">Select Parent Ministry</option>
                    {ministries
                      .filter((ministry) => ministry.type === "Ministry")
                      .map((ministry) => (
                        <option key={ministry._id} value={ministry._id}>
                          {ministry.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSaveMinistryEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700 transition duration-200"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={() => setEditingMinistry(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-base md:text-xl font-semibold mb-2">
                  {selectedMinistry.name} ({selectedMinistry.type})
                </h3>
                <button
                  onClick={() => setEditingMinistry(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-200 mb-4"
                >
                  <FaEdit />
                </button>
              </div>

              <ul className="list-disc list-inside mb-4 text-sm md:text-base">
                {selectedMinistry.allocatedWork.map((work, index) => (
                  <li
                    key={index}
                    className="mb-2 flex justify-between items-center"
                  >
                    <div className="flex-grow bg-slate-100 rounded-md p-2 hover:shadow-lg hover:bg-teal-100">
                      {editingWorkIndex === index ? (
                        <textarea
                          value={work.description}
                          onChange={(e) =>
                            handleEditWorkChange(index, e.target.value)
                          }
                          className="p-2 border rounded w-full"
                          rows={4} // Adjust the number of rows as needed
                        />
                      ) : (
                        <span>{work.description}</span>
                      )}
                    </div>
                    <div className="ml-4 flex space-x-2 text-sm md:text-base">
                      {editingWorkIndex === index ? (
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 transition duration-200"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-700 transition duration-200"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            onClick={() => handleEditClick(index)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-700 transition duration-200"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteWork(index)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 transition duration-200"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mb-4">
                <label className="block mb-2">Add New Work</label>
                <input
                  type="text"
                  value={newWork}
                  onChange={handleAddWorkChange}
                  className="p-2 border rounded w-full mb-2"
                />
                <button
                  onClick={handleAddWork}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 flex gap-2 items-center"
                >
                  <span>Add Work</span>
                  <FaPlus />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MinistryWorkAllocation;
