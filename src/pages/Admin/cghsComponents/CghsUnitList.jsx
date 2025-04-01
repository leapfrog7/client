import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaEdit, FaTrash } from "react-icons/fa";

const CghsUnitList = ({ units, onEdit, onDelete }) => {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const cities = validCities;

  useEffect(() => {
    const filtered = units.filter((unit) => {
      const unitCity = unit?.address?.city?.trim().toLowerCase();
      const targetCity = selectedCity.trim().toLowerCase();
      return unitCity === targetCity;
    });
    setFilteredUnits(filtered);
    setCurrentPage(1);
  }, [selectedCity, units]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUnits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  return (
    <div className="mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h3 className="text-lg font-bold">Showing Units in:</h3>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border rounded p-2"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Empanelled For</th>
              <th className="text-left p-3">Accreditation</th>
              <th className="text-left p-3">Address</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No units found in {selectedCity}
                </td>
              </tr>
            ) : (
              currentItems.map((unit) => (
                <tr key={unit._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{unit.name}</td>
                  <td className="p-3">{unit.type}</td>
                  <td className="p-3">{unit.address?.city}</td>
                  <td className="p-3">
                    {unit.empanelledFor?.join(", ") || "-"}
                  </td>
                  <td className="p-3">{unit.accreditation || "-"}</td>
                  <td className="p-3">
                    {[
                      unit.address?.line1,
                      unit.address?.line2,
                      unit.address?.state,
                      unit.address?.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => onEdit(unit)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onDelete(unit._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

CghsUnitList.propTypes = {
  units: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default CghsUnitList;
