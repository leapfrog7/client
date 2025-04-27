import { useState, useEffect } from "react";
import axios from "axios";
import CghsUnitTable from "../../components/Tools/CghsUnitTable";
import CghsUnitModal from "../../components/Tools/CghsUnitModal";
import NearbyUnits from "../../components/Tools/NearbyUnits";
import { MdCancel } from "react-icons/md";
import { FaTreeCity } from "react-icons/fa6";
import { IoMdWifi } from "react-icons/io";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import Select from "react-select";
import { Link } from "react-router-dom";

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
  const [viewMode, setViewMode] = useState("city"); // 'city' | 'nearby'
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyError, setNearbyError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const cityOptions = validCities.map((city) => ({
    label: city,
    value: city,
  }));

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    if (viewMode === "nearby") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setNearbyError(""); // clear any previous error
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          setNearbyError(
            "📍 Location access denied. Cannot show nearby hospitals."
          );
          setUserLocation(null);
        }
      );
    }
  }, [viewMode]);
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

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-4 md:p-8 md:w-11/12 mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
          CGHS Empanelled Centers
        </h2>
        <p className="text-xs md:text-sm text-gray-600 max-w-2xl mx-auto">
          Search, explore, and find nearby units, check available specialties,
          and get directions — all in one place.
        </p>
      </div>

      <div className="flex w-full md:w-96 mx-auto border rounded-full overflow-hidden text-sm md:text-base font-medium mb-6 shadow-sm">
        <button
          onClick={() => setViewMode("city")}
          className={`w-1/2 px-4 py-2 transition-all duration-200 ${
            viewMode === "city"
              ? "bg-indigo-700 text-white"
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          <span className="flex gap-2 items-center justify-center">
            <p>View by City</p>
            <FaTreeCity />
          </span>
        </button>
        <button
          onClick={() => setViewMode("nearby")}
          className={`w-1/2 px-4 py-2 transition-all duration-200 ${
            viewMode === "nearby"
              ? "bg-indigo-700 text-white"
              : "bg-white text-gray-500 hover:bg-gray-100"
          }`}
        >
          <span className="flex gap-2 items-center justify-center">
            <p>Find Nearby</p>
            <IoMdWifi />
          </span>
        </button>
      </div>

      {viewMode === "city" && (
        <>
          {/* Filter Controls Container */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* City Selector */}
            <div className="flex md:flex-row md:items-center gap-2 w-full md:w-auto rounded-lg bg-blue-50 p-4">
              <label className="text-sm md:text-base font-medium text-gray-700">
                Select City:
              </label>
              <div className="w-full md:w-96 text-xs md:text-sm">
                <Select
                  options={cityOptions}
                  value={{ label: selectedCity, value: selectedCity }}
                  onChange={(selected) => setSelectedCity(selected.value)}
                  isSearchable
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "0.375rem",
                      padding: "2px 4px",
                      fontSize: "0.875rem",
                    }),
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#eef2ff", // light indigo on hover
                      primary: "#6366f1", // indigo-500 for selection
                    },
                  })}
                />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="🔍 Search name, specialty, or locality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10 text-xs md:text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                  title="Clear search"
                >
                  <MdCancel size={20} />
                </button>
              )}
            </div>
          </div>

          <CghsUnitTable
            units={currentUnits}
            onMoreOptions={setSelectedUnit}
            showDistance={false}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center flex-wrap gap-2 mt-6 text-sm md:text-base">
              {/* Previous */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <MdNavigateBefore size={20} />
              </button>

              {/* Page Buttons with Ellipses */}
              {generatePageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-full border transition ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <MdNavigateNext size={20} />
              </button>
            </div>
          )}
        </>
      )}
      {viewMode === "nearby" && (
        <NearbyUnits
          onMoreOptions={setSelectedUnit}
          userLocation={userLocation}
          error={nearbyError}
        />
      )}

      <div className="bg-indigo-50 rounded-lg p-6 my-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl font-semibold text-indigo-700">
            Looking for CGHS Rates?
          </h3>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Find CGHS rates for Tests/ Procedure and Implants city-wise.
          </p>
        </div>

        <Link
          to="/pages/public/cghs-rates"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full transition"
        >
          Explore CGHS Units
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-12 text-center px-4">
        <strong>Disclaimer:</strong> While every effort has been made to ensure
        the accuracy of the information presented, users are advised that
        details such as empanelment status, location, and services are subject
        to change. We shall not be held liable for any inadvertent errors or
        outdated information.
      </p>

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
