// src/pages/public/CghsRatePublic.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import PageFeedback from "../../components/PageFeedback";
import Loading from "../../components/Loading"; // adjust path if needed
import CGHSEstimatorModal from "../../components/Tools/CGHSEstimatorModal";

const CghsRatePublic = () => {
  const [rates, setRates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showEstimator, setShowEstimator] = useState(false);

  const ratesPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  //   const BASE_URL = "http://localhost:5000/api/v1/public"; // Replace with your live URL
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/public";

  const cityOptions = [
    { value: "Delhi", label: "Delhi-NCR" },
    // { value: "Mumbai", label: "Mumbai" },
    // { value: "Chennai", label: "Chennai" },
    // { value: "Kolkata", label: "Kolkata" },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${BASE_URL}/cghsRates`);
        setRates(response.data);
      } catch (error) {
        console.error("Error fetching CGHS Rates:", error);
      } finally {
        setLoading(false);
      } // Done loading
    };

    fetchRates();
  }, []);

  const filteredRates = rates.filter((rate) => {
    const search = searchTerm.toLowerCase();
    return (
      rate.name.toLowerCase().includes(search) ||
      rate.category.toLowerCase().includes(search) ||
      (rate.cghsCode &&
        rate.cghsCode.toString().toLowerCase().includes(search)) ||
      (rate.rates &&
        rate.rates[selectedCity]?.nabhRate?.toString().includes(search)) ||
      (rate.rates &&
        rate.rates[selectedCity]?.nonNabhRate?.toString().includes(search))
    );
  });

  // const generatePageNumbers = () => {
  //   const pages = [];

  //   if (totalPages <= 6) {
  //     // Show all pages if total is 6 or less
  //     for (let i = 1; i <= totalPages; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     if (currentPage <= 6) {
  //       // If current page is in first 6 pages, show 1 to 6 and last page
  //       for (let i = 1; i <= 6; i++) {
  //         pages.push(i);
  //       }
  //       pages.push(totalPages);
  //     } else {
  //       // After 7th page, show 1, ..., currentPage, ..., lastPage
  //       pages.push(1);
  //       pages.push("...");
  //       pages.push(currentPage);
  //       pages.push("...");
  //       pages.push(totalPages);
  //     }
  //   }

  //   return pages;
  // };

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

  const indexOfLastRate = currentPage * ratesPerPage;
  const indexOfFirstRate = indexOfLastRate - ratesPerPage;
  const currentRates = filteredRates.slice(indexOfFirstRate, indexOfLastRate);
  const totalPages = Math.ceil(filteredRates.length / ratesPerPage);

  // Inside src/pages/public/CghsRatePublic.jsx, find this function and replace it

  if (loading) return <Loading />;

  return (
    <div className="p-2 max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-2 mt-4">
        Find CGHS Rates 📋
      </h1>

      <p className="text-center text-gray-600 text-sm md:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
        Discover CGHS-approved rates for lab tests, medical procedures, and
        implants — neatly organized by city (Delhi NCR for now) and prepare
        estimates before lab visits.
      </p>

      <div className="flex flex-col items-center gap-6 mb-8 px-4">
        {/* Top Row: Selector + Stats */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4">
          {/* City Selector */}
          <Select
            value={cityOptions.find((option) => option.value === selectedCity)}
            onChange={(option) => {
              setSelectedCity(option.value);
              setCurrentPage(1);
            }}
            options={cityOptions}
            placeholder="Select a City"
            className="w-full md:w-2/3 lg:w-1/3 text-sm md:text-base shadow-sm"
            isSearchable={true}
          />

          {/* Stats Box */}
          <div className="bg-white border border-gray-200 rounded-md px-6 py-2 shadow-sm flex items-center gap-2">
            <span className="text-gray-600 text-sm md:text-base">
              🧮 Total Entries:
            </span>
            <span className="text-blue-700 font-bold text-base">
              {filteredRates.length}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-2/3 lg:w-1/2  ring-2">
          <input
            type="text"
            placeholder="Search .... by name, category, code, or rate 🔍︎ "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full  border-gray-300 rounded-md px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
              title="Clear search"
            >
              <MdCancel size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-auto text-sm rounded-md overflow-hidden">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left text-sm md:text-base w-[65%]">
                Tests / Procedure
              </th>
              <th className="px-3 py-2 text-center text-sm md:text-base w-[17.5%] ">
                Non-NABH (₹)
              </th>
              <th className="px-3 py-2 text-center text-sm md:text-base w-[17.5%] whitespace-nowrap">
                NABH (₹)
              </th>
            </tr>
          </thead>

          <tbody>
            {currentRates.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No rates found for the selected city.
                </td>
              </tr>
            ) : (
              currentRates.map((rate) => (
                <tr
                  key={rate._id}
                  className="bg-white hover:bg-gray-50 border-b border-gray-200 transition-colors"
                >
                  {/* Name, CGHS Code, Note, Reference */}
                  <td className="p-4 align-top break-words">
                    <div className="space-y-1">
                      <p className="text-blue-800 font-semibold flex items-center gap-1 text-sm md:text-base">
                        🧪 {rate.name}
                      </p>

                      {rate.cghsCode && (
                        <p className="text-blue-600 text-xs flex items-center gap-1">
                          #️⃣ CGHS Code: {rate.cghsCode}
                        </p>
                      )}
                      {rate.note && (
                        <p
                          className="text-amber-700 text-xs break-words"
                          title={rate.note}
                        >
                          🏷️ {rate.note}
                        </p>
                      )}
                      {rate.reference && (
                        <p
                          className="text-gray-400 text-[10px] break-words"
                          title={rate.reference}
                        >
                          📄 {rate.reference}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Non-NABH */}
                  <td className="p-4 text-center align-top text-sm md:text-base text-gray-700 font-medium whitespace-nowrap">
                    {rate.rates?.[selectedCity]?.nonNabhRate !== undefined
                      ? `₹${rate.rates[selectedCity].nonNabhRate.toLocaleString(
                          "en-IN"
                        )}`
                      : rate.rates?.Delhi?.nonNabhRate !== undefined
                      ? `₹${rate.rates.Delhi.nonNabhRate.toLocaleString(
                          "en-IN"
                        )}`
                      : "N/A"}
                  </td>

                  {/* NABH */}
                  <td className="p-4 text-center align-top text-sm md:text-base text-gray-700 font-medium whitespace-nowrap">
                    {rate.rates?.[selectedCity]?.nabhRate !== undefined
                      ? `₹${rate.rates[selectedCity].nabhRate.toLocaleString(
                          "en-IN"
                        )}`
                      : rate.rates?.Delhi?.nabhRate !== undefined
                      ? `₹${rate.rates.Delhi.nabhRate.toLocaleString("en-IN")}`
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 md:p-6 text-center shadow-sm mt-8">
        <p className="text-gray-700 text-sm md:text-base mb-3">
          🧾 <strong>Be informed.</strong> Get an estimate before your next lab
          test or procedure — no surprises, no confusion. Know exactly what
          you’ll pay as per CGHS.
        </p>
        <button
          onClick={() => setShowEstimator(true)}
          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-sm md:text-base font-semibold px-6 py-3 rounded-full transition shadow-md"
        >
          💡 Prepare CGHS Estimate Instantly
        </button>
      </div>

      {showEstimator && (
        <CGHSEstimatorModal
          onClose={() => setShowEstimator(false)}
          rates={rates}
          selectedCity={selectedCity}
        />
      )}

      <PageFeedback pageSlug="/cghs-rates" />

      <div className="bg-indigo-50 rounded-lg p-6 my-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl font-semibold text-indigo-700">
            Looking for CGHS Hospitals and Labs?
          </h3>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Find empanelled hospitals, diagnostic centers, and labs city-wise.
          </p>
        </div>

        <Link
          to="/pages/public/cghs-units"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full transition"
        >
          Explore CGHS Units
        </Link>
      </div>

      <p className="text-xs text-gray-400 my-12 text-center px-4">
        <strong>Disclaimer:</strong> While every effort has been made to ensure
        the accuracy of the information presented, users are advised that CGHS
        rates are subject to change. We shall not be held liable for any
        inadvertent errors or outdated information.
      </p>
    </div>
  );
};

export default CghsRatePublic;
