import { useState, useEffect } from "react";
import axios from "axios";
import CghsUnitTable from "../../components/Tools/CghsUnitTable";
import CghsUnitModal from "../../components/Tools/CghsUnitModal";
import NearbyUnits from "../../components/Tools/NearbyUnits";
import { MdCancel } from "react-icons/md";

const validCities = [
  "Delhi",
  "Gurugram",
  "Faridabad",
  "Ghaziabad",
  "Noida",
  "Mumbai",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Bhopal",
  "Indore",
  "Bengaluru",
];

// const BASE_URL = "http://localhost:5000/api/v1/public/cghsUnits"; // Replace with your live URL
const BASE_URL = "https://server-v4dy.onrender.com/api/v1/public/cghsUnits";

const CghsUnitPublic = () => {
  const [units, setUnits] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    const filtered = units.filter(
      (unit) =>
        unit?.address?.city?.toLowerCase() === selectedCity.toLowerCase()
    );
    setFilteredUnits(filtered);
    setCurrentPage(1);
  }, [selectedCity, units]);

  useEffect(() => {
    const cityFiltered = units.filter(
      (unit) =>
        unit?.address?.city?.toLowerCase() === selectedCity.toLowerCase()
    );

    // Apply search if at least 3 characters
    const searched =
      searchTerm.length >= 3
        ? cityFiltered.filter((unit) => {
            const nameMatch = unit.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());
            const specialtyMatch = unit.empanelledFor?.some((spec) =>
              spec.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const localityMatch = unit.address?.line1
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase());

            return nameMatch || specialtyMatch || localityMatch;
          })
        : cityFiltered;

    setFilteredUnits(searched);
    setCurrentPage(1);
  }, [selectedCity, units, searchTerm]);

  const fetchUnits = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setUnits(response.data || []);
    } catch (error) {
      console.error("Error fetching CGHS units:", error);
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUnits = filteredUnits.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  return (
    <div className="p-4 md:p-8 md:w-11/12 mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        CGHS Empanelled Units
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <label className="font-medium text-sm md:text-base">
          Showing Units in:
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border rounded p-2 text-sm"
        >
          {validCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name, specialty or locality..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full md:w-96"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className=" hover:text-red-500 text-xl font-bold rounded-full relative right-8 text-gray-400"
            title="Clear search"
          >
            <MdCancel />
          </button>
        )}
      </div>

      <NearbyUnits onMoreOptions={setSelectedUnit} />

      <CghsUnitTable
        units={currentUnits}
        onMoreOptions={setSelectedUnit}
        showDistance={false}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap text-sm">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ⬅️ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      )}

      {/* Modal */}
      <CghsUnitModal
        isOpen={!!selectedUnit}
        unit={selectedUnit}
        onClose={() => setSelectedUnit(null)}
      />
    </div>
  );
};

export default CghsUnitPublic;
