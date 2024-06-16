import { useState, useEffect } from "react";
import axios from "axios";

const AddMinistryForm = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Ministry");
  const [parent, setParent] = useState("");
  const [allocatedWorkText, setAllocatedWorkText] = useState("");
  const [ministries, setMinistries] = useState([]);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/";
  //   const BASE_URL = "http://localhost:5000/api/v1";

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}MDO_WorkAllocation/fetchAllMDO`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        setMinistries(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching ministries:", error);
      }
    };

    fetchMinistries();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const allocatedWork = allocatedWorkText
      .split("\n")
      .filter((work) => work.trim() !== "")
      .map((description) => ({ description }));

    try {
      const response = await axios.post(
        `${BASE_URL}aobr/addMDO`,
        {
          name,
          type,
          parent: type === "Department" ? parent : null,
          allocatedWork: type === "Ministry" && parent ? [] : allocatedWork,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      console.log(response.data.message);
      setName("");
      setType("Ministry");
      setParent("");
      setAllocatedWorkText("");
    } catch (error) {
      console.error("Error adding Ministry/Department:", error);
      alert("Error adding Ministry/Department");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Type:
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              if (e.target.value === "Ministry") setParent("");
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Ministry">Ministry</option>
            <option value="Department">Department</option>
          </select>
        </label>
      </div>

      {type === "Department" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Parent Ministry:
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select Ministry</option>
              {ministries
                .filter((m) => m.type === "Ministry")
                .map((ministry) => (
                  <option key={ministry._id} value={ministry._id}>
                    {ministry.name}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}

      {(type === "Ministry" && !parent) || type === "Department" ? (
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Allocated Work (one per line):
            <textarea
              value={allocatedWorkText}
              onChange={(e) => setAllocatedWorkText(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="6"
              placeholder="Enter each work item on a new line"
            />
          </label>
        </div>
      ) : null}

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default AddMinistryForm;
