import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const ShowWorkAllocation = () => {
  const [selectedId, setSelectedId] = useState("");
  const [allocation, setAllocation] = useState(null);
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/"; //This is the Server Base URL
  //   const BASE_URL = "http://localhost:5000/api/v1/";

  useEffect(() => {
    const fetchMinistries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}MDO_WorkAllocation/fetchAllMDO`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        const allMinistries = response.data;

        const ministriesWithWork = allMinistries.filter(
          (m) =>
            m.type === "Ministry" &&
            m.allocatedWork &&
            m.allocatedWork.length > 0
        );

        const departments = allMinistries
          .filter((m) => m.type === "Department")
          .map((department) => {
            const parentMinistry = allMinistries.find(
              (ministry) => ministry._id === department.parent
            );
            return {
              ...department,
              parentMinistryName: parentMinistry
                ? parentMinistry.name
                : "Unknown",
            };
          });

        setMinistries([...ministriesWithWork, ...departments]);
      } catch (error) {
        console.error("Error fetching ministries/departments:", error);
        setError("Error fetching ministries/departments");
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, []);

  const handleSelectionChange = async (selectedOption) => {
    const id = selectedOption.value;
    setSelectedId(id);
    try {
      const response = await axios.get(`${BASE_URL}MDO_WorkAllocation`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      setAllocation(response.data);
    } catch (error) {
      console.error("Error fetching work allocation:", error);
    }
  };

  const options = ministries.map((ministry) => ({
    value: ministry._id,
    label:
      ministry.type === "Ministry"
        ? ministry.name
        : `${ministry.name} (${ministry.parentMinistryName})`,
  }));

  return (
    <div className="max-w-3xl mx-auto py-6 px-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl md:text-2xl font-bold bg-blue-200 text-center rounded-lg p-2 mb-2 text-gray-700">
        Complete AoBR
      </h1>
      <div className="mb-6">
        <label className="block text-gray-800 font-semibold mt-4">
          Select Ministry/Department:
          <Select
            value={options.find((option) => option.value === selectedId)}
            onChange={handleSelectionChange}
            options={options}
            placeholder="Select"
            className="mt-2 block w-full text-sm md:text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </label>
      </div>
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {allocation && (
        <div className="mt-8">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-customCyan mb-4 text-center bg-cyan-50 rounded-md">
            {allocation.name}
          </h3>
          {allocation.allocatedWork.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
              {allocation.allocatedWork.map((work, index) => (
                <li key={index} className="text-gray-700">
                  {work.description}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No allocated work found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowWorkAllocation;
