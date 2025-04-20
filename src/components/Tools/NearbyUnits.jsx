// import { useState, useEffect } from "react";
// import axios from "axios";
// import PropTypes from "prop-types";
// import CghsUnitTable from "./CghsUnitTable";
// import { RiMapPinRangeLine } from "react-icons/ri";

// const BASE_URL = "https://server-v4dy.onrender.com/api/v1/public/cghsUnits";

// const NearbyUnits = ({ userLocation, error, onMoreOptions }) => {
//   const [radiusKm, setRadiusKm] = useState(5000);
//   const [nearbyUnits, setNearbyUnits] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!userLocation) return;

//     const fetchNearbyUnits = async () => {
//       try {
//         setLoading(true);
//         const { lat, lng } = userLocation;
//         const response = await axios.get(
//           `${BASE_URL}/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`
//         );
//         setNearbyUnits(Array.isArray(response.data) ? response.data : []);
//       } catch (err) {
//         console.error("Error fetching nearby units:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNearbyUnits();
//   }, [userLocation, radiusKm]);

//   return (
//     <div className="bg-white p-0 rounded mb-8">
//       <div className="mb-4">
//         {error ? (
//           <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
//             {error}
//           </p>
//         ) : userLocation ? (
//           <>
//             <div className="mb-2">
//               <div className="inline-flex items-center gap-3 bg-indigo-600  rounded-lg px-4 py-2 shadow-sm w-full justify-center">
//                 <label
//                   htmlFor="radius"
//                   className="text-sm text-white font-medium whitespace-nowrap"
//                 >
//                   <span className="flex gap-2 items-center text-sm md:text-base">
//                     Set Search Radius <RiMapPinRangeLine />
//                   </span>
//                 </label>
//                 <select
//                   id="radius"
//                   value={radiusKm}
//                   onChange={(e) => setRadiusKm(Number(e.target.value))}
//                   className="bg-white border border-gray-300 text-gray-700 text-sm rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                 >
//                   <option value="2000">2 km</option>
//                   <option value="5000">5 km</option>
//                   <option value="10000">10 km</option>
//                   {/* <option value="20000">20 km</option> */}
//                 </select>
//               </div>
//             </div>
//             <p className="text-sm text-blue-600 bg-white px-4 py-1 rounded text-center">
//               Showing CGHS units within <strong>{radiusKm / 1000} km</strong> of
//               your location.
//             </p>
//           </>
//         ) : (
//           <p className="text-sm text-gray-500 italic">
//             Detecting your location...
//           </p>
//         )}
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center mt-6 text-blue-600">
//           <svg
//             className="animate-spin h-6 w-6 mr-2 text-blue-600"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//             ></path>
//           </svg>
//           <span className="text-sm">Loading nearby units...</span>
//         </div>
//       ) : (
//         nearbyUnits.length > 0 && (
//           <div className="mt-6">
//             {/* <h4 className="text-lg font-semibold mb-2 pl-2">
//               Nearby CGHS Units:
//             </h4> */}
//             <CghsUnitTable
//               units={nearbyUnits}
//               onMoreOptions={onMoreOptions}
//               showDistance={true}
//             />
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// NearbyUnits.propTypes = {
//   onMoreOptions: PropTypes.func.isRequired,
//   userLocation: PropTypes.object,
//   error: PropTypes.string,
// };

// export default NearbyUnits;

import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import CghsUnitTable from "./CghsUnitTable";
import { RiMapPinRangeLine } from "react-icons/ri";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1/public/cghsUnits";

const NearbyUnits = ({ userLocation, error, onMoreOptions }) => {
  const [radiusKm, setRadiusKm] = useState(5000);
  const [nearbyUnits, setNearbyUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!userLocation) return;

    const fetchNearbyUnits = async () => {
      try {
        setLoading(true);
        const { lat, lng } = userLocation;
        const response = await axios.get(
          `${BASE_URL}/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`
        );
        setNearbyUnits(Array.isArray(response.data) ? response.data : []);
        setCurrentPage(1); // reset page on new fetch
      } catch (err) {
        console.error("Error fetching nearby units:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyUnits();
  }, [userLocation, radiusKm]);

  // Pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUnits = nearbyUnits.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(nearbyUnits.length / itemsPerPage);

  return (
    <div className="bg-white p-0 rounded mb-8">
      <div className="mb-4">
        {error ? (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
            {error}
          </p>
        ) : userLocation ? (
          <>
            <div className="mb-2">
              <div className="inline-flex items-center gap-3 bg-indigo-600 rounded-lg px-4 py-2 shadow-sm w-full justify-center">
                <label
                  htmlFor="radius"
                  className="text-sm text-white font-medium whitespace-nowrap"
                >
                  <span className="flex gap-2 items-center text-sm md:text-base">
                    Set Search Radius <RiMapPinRangeLine />
                  </span>
                </label>
                <select
                  id="radius"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="2000">2 km</option>
                  <option value="5000">5 km</option>
                  <option value="10000">10 km</option>
                </select>
              </div>
            </div>
            <p className="text-sm text-blue-600 bg-white px-4 py-1 rounded text-center">
              Showing CGHS units within <strong>{radiusKm / 1000} km</strong> of
              your location.
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Detecting your location...
          </p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-6 text-blue-600">
          <svg
            className="animate-spin h-6 w-6 mr-2 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <span className="text-sm">Loading nearby units...</span>
        </div>
      ) : (
        currentUnits.length > 0 && (
          <div className="mt-6">
            <CghsUnitTable
              units={currentUnits}
              onMoreOptions={onMoreOptions}
              showDistance={true}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap text-sm">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous"
                >
                  <MdNavigateBefore size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={`nearby-page-${page}`}
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

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next"
                >
                  <MdNavigateNext size={20} />
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

NearbyUnits.propTypes = {
  onMoreOptions: PropTypes.func.isRequired,
  userLocation: PropTypes.object,
  error: PropTypes.string,
};

export default NearbyUnits;
