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
import { Helmet } from "react-helmet-async";
import PageFeedback from "../../components/PageFeedback";
import Loading from "../../components/Loading";
import PropTypes from "prop-types";

const validCities = [
  "Delhi",
  "Gurugram",
  "Faridabad",
  "Ghaziabad",
  "Noida",
  // "Mumbai",
  // "Chennai",
  // "Kolkata",
  // "Hyderabad",
  // "Bhopal",
  // "Indore",
  // "Bengaluru",
];

// const BASE_URL = "http://localhost:5000/api/v1/public/cghsUnits"; // Replace with your live URL
const BASE_URL = "https://server-v4dy.onrender.com/api/v1/public/cghsUnits";

function CitySelect({
  cityOptions,
  selectedCity,
  setSelectedCity,
  viewMode, // so we can disable when not in "city" mode
  instanceId = "city-select",
}) {
  return (
    <div className="w-full md:w-auto rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] items-center gap-2 md:gap-3">
        {/* Label */}
        <label
          htmlFor={instanceId}
          className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-700"
        >
          <FaTreeCity className="text-indigo-600" aria-hidden />
          <span>Select City</span>
        </label>

        {/* Select */}
        <div className="w-full md:w-96">
          <Select
            instanceId={instanceId}
            inputId={instanceId}
            options={cityOptions}
            value={
              selectedCity ? { label: selectedCity, value: selectedCity } : null
            }
            onChange={(opt) => setSelectedCity(opt?.value || "")}
            isSearchable
            isClearable
            isDisabled={viewMode !== "city"}
            placeholder="Type to search cities…"
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : null
            }
            className="text-sm"
            styles={{
              control: (base, state) => ({
                ...base,
                minHeight: 40,
                borderRadius: 8,
                padding: "0 4px",
                fontSize: "0.875rem",
                borderColor: state.isFocused ? "#6366f1" : "#e5e7eb",
                boxShadow: "none",
                "&:hover": {
                  borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
                },
                backgroundColor: viewMode !== "city" ? "#f9fafb" : "white",
              }),
              valueContainer: (base) => ({ ...base, padding: "0 4px" }),
              indicatorsContainer: (base) => ({ ...base, gap: 2 }),
              placeholder: (base) => ({ ...base, color: "#9ca3af" }),
              menuPortal: (base) => ({ ...base, zIndex: 50 }),
              menu: (base) => ({
                ...base,
                borderRadius: 8,
                overflow: "hidden",
              }),
              option: (base, state) => ({
                ...base,
                fontSize: "0.9rem",
                backgroundColor: state.isSelected
                  ? "#e0e7ff"
                  : state.isFocused
                  ? "#eef2ff"
                  : "white",
                color: state.isSelected ? "#3730a3" : "#111827",
                cursor: "pointer",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#eef2ff",
                primary: "#6366f1",
              },
            })}
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Start typing to filter cities. Clear to reset.
          </p>
        </div>
      </div>
    </div>
  );
}

CitySelect.propTypes = {
  cityOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedCity: PropTypes.string, // you had the warning here
  setSelectedCity: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired, // "city" | "nearby"
  instanceId: PropTypes.string,
};

const CghsUnitPublic = () => {
  const [units, setUnits] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [viewMode, setViewMode] = useState("city"); // 'city' | 'nearby'
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyError, setNearbyError] = useState("");
  const [loading, setLoading] = useState(true);

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
      setLoading(true); // Start loading
      const response = await axios.get(BASE_URL);
      setUnits(response.data || []);
    } catch (error) {
      console.error("Error fetching CGHS units:", error);
    } finally {
      setLoading(false);
    } // Done loading
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUnits = filteredUnits.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  const generatePageNumbers = () => {
    const pages = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) return <Loading />;

  return (
    <div className="p-4 md:p-8 md:w-11/12 mx-auto animate-fade-in">
      <Helmet>
        <title>CGHS Units Directory | UnderSigned</title>
        <meta
          name="description"
          content="Search and explore Central Government Health Scheme (CGHS) hospitals, labs, and wellness centres by city or location."
        />
        <link
          rel="canonical"
          href="https://undersigned.in/pages/public/cghs-units"
        />
      </Helmet>

      <div className="text-center mb-8 px-3">
        {/* Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 mb-1 flex items-center justify-center gap-2">
          <span aria-hidden>🏥</span>
          <span>CGHS Empanelled Centres</span>
        </h2>

        {/* Subtext (short, helpful, not noisy) */}
        <p className="text-[12px] sm:text-sm text-gray-600 max-w-xl mx-auto">
          Search units, check facilities, and get directions—quickly.
        </p>

        {/* Feature block */}
        <div className="mt-4 bg-gray-50 rounded-2xl shadow-sm">
          {/* Mobile-first: compact header */}
          <div className="px-3 py-3 sm:py-4">
            <p className="text-sm sm:text-base text-gray-700 font-semibold">
              All in one place
            </p>
          </div>

          {/* Features: compact 2×2 grid on mobile; roomier on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4">
            {/* Item */}
            <div
              className="flex items-center gap-2 sm:gap-2.5 bg-white lg:bg-indigo-50 border border-gray-200 lg:border-indigo-200 rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5
                      transition hover:shadow-sm"
            >
              <span className="text-base sm:text-lg" aria-hidden>
                🔍
              </span>
              <span className="text-xs sm:text-sm md:text-base text-gray-700 lg:text-indigo-700">
                Search & Explore
              </span>
            </div>

            <div
              className="flex items-center gap-2 sm:gap-2.5 bg-white lg:bg-green-50 border border-gray-200 lg:border-green-200 rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5
                      transition hover:shadow-sm"
            >
              <span className="text-base sm:text-lg" aria-hidden>
                📍
              </span>
              <span className="text-xs sm:text-sm md:text-base text-gray-700 lg:text-green-700">
                Find Nearby Units
              </span>
            </div>

            <div
              className="flex items-center gap-2 sm:gap-2.5 bg-white lg:bg-yellow-50 border border-gray-200 lg:border-yellow-200 rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5
                      transition hover:shadow-sm"
            >
              <span className="text-base sm:text-lg" aria-hidden>
                ✅
              </span>
              <span className="text-xs sm:text-sm md:text-base text-gray-700 lg:text-yellow-700">
                Empanelled Facilities
              </span>
            </div>

            <div
              className="flex items-center gap-2 sm:gap-2.5 bg-white lg:bg-blue-50 border border-gray-200 lg:border-blue-200 rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5
                      transition hover:shadow-sm"
            >
              <span className="text-base sm:text-lg" aria-hidden>
                🧭
              </span>
              <span className="text-xs sm:text-sm md:text-base text-gray-700 lg:text-blue-700">
                Get Directions
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-96 mx-auto mb-6">
        <div className="flex border border-gray-200 rounded-full shadow-sm overflow-hidden bg-white text-sm md:text-base font-medium">
          {/* View by City */}
          <button
            onClick={() => setViewMode("city")}
            className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 transition-all duration-200 ${
              viewMode === "city"
                ? "bg-indigo-600 text-white shadow-inner"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaTreeCity
              className={`text-lg transition-transform ${
                viewMode === "city" ? "scale-110" : "scale-100"
              }`}
            />
            <span>City</span>
          </button>

          {/* Find Nearby */}
          <button
            onClick={() => setViewMode("nearby")}
            className={`flex-1 px-4 py-2 flex items-center justify-center gap-2 transition-all duration-200 ${
              viewMode === "nearby"
                ? "bg-indigo-600 text-white shadow-inner"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <IoMdWifi
              className={`text-lg transition-transform ${
                viewMode === "nearby" ? "scale-110" : "scale-100"
              }`}
            />
            <span>Nearby</span>
          </button>
        </div>

        {/* Small hint below on mobile for clarity */}
        <p className="mt-2 text-center text-xs text-gray-500 md:hidden">
          Switch between searching by city or finding nearby centres
        </p>
      </div>

      {viewMode === "city" && (
        <>
          {/* Filter Controls Container */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* City Selector */}
            <CitySelect
              cityOptions={cityOptions}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              viewMode={viewMode}
            />

            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              {/* Accessible label (hidden for screen readers) */}
              <label htmlFor="search-input" className="sr-only">
                Search by name, specialty, or locality
              </label>

              <input
                id="search-input"
                type="text"
                placeholder="🔍 Search name, specialty, or locality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full 
               text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
               pr-10 transition duration-200 ease-in-out
               shadow-sm hover:shadow-md"
              />

              {/* Clear button */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 
                 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear search"
                  aria-label="Clear search"
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
            totalCount={filteredUnits.length}
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
                    key={`page-${idx}`}
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

      <PageFeedback pageSlug="/cghs-units" />

      <div className="bg-indigo-50 rounded-lg p-6 my-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="text-center md:text-left">
          <h3 className="text-base md:text-xl font-semibold text-indigo-700">
            Looking for CGHS Rates?
          </h3>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Find CGHS rates for Tests/ Procedure and Implants city-wise.
          </p>
        </div>

        <Link
          to="/pages/public/cghs-rates"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-full transition"
        >
          Explore Latest CGHS Rates
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
