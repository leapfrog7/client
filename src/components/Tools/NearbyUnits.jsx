// import { useState, useEffect } from "react";
// import axios from "axios";
// import CghsUnitTable from "./CghsUnitTable";
// import PropTypes from "prop-types";

// const NearbyUnits = ({ userLocation, error, onMoreOptions }) => {
//   const [radiusKm, setRadiusKm] = useState(5000);
//   const [nearbyUnits, setNearbyUnits] = useState([]);
//   const [locationError, setLocationError] = useState("");
//   const [showNearby, setShowNearby] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // const BASE_URL = "http://localhost:5000/api/v1/public/cghsUnits"; // Replace with your live URL
//   const BASE_URL = "https://server-v4dy.onrender.com/api/v1/public/cghsUnits";
//   //   const handleFindNearby = () => {
//   //     setLocationError("");
//   //     setShowNearby(false);
//   //     setNearbyUnits([]);

//   //     if (!navigator.geolocation) {
//   //       setLocationError("Geolocation is not supported by your browser.");
//   //       return;
//   //     }

//   //     navigator.geolocation.getCurrentPosition(
//   //       async (position) => {
//   //         const { latitude, longitude } = position.coords;

//   //         try {
//   //           const res = await axios.get(
//   //             `/api/v1/public/cghsUnits/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`
//   //           );
//   //           setNearbyUnits(Array.isArray(res.data) ? res.data : []);
//   //           setShowNearby(true);
//   //         } catch (err) {
//   //           console.error("Failed to fetch nearby units:", err);
//   //           setLocationError(
//   //             "Something went wrong while fetching nearby hospitals."
//   //           );
//   //         }
//   //       },
//   //       (error) => {
//   //         console.error("Location error:", error);
//   //         setLocationError("Permission denied or failed to get your location.");
//   //       }
//   //     );
//   //   };

//   const handleFindNearby = () => {
//     setLocationError("");
//     setShowNearby(false);
//     setNearbyUnits([]);

//     if (!navigator.geolocation) {
//       setLocationError("❌ Geolocation is not supported by your browser.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           const res = await axios.get(
//             `${BASE_URL}/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`
//           );
//           setNearbyUnits(Array.isArray(res.data) ? res.data : []);
//           setShowNearby(true);
//         } catch (err) {
//           console.error("❌ Failed to fetch nearby units:", err);
//           setLocationError(
//             "⚠️ Something went wrong while fetching nearby hospitals."
//           );
//         }
//       },
//       (error) => {
//         console.error("🚫 Location error:", error);
//         if (error.code === error.PERMISSION_DENIED) {
//           setLocationError(
//             "⚠️ Location permission denied. Please allow access and try again."
//           );
//         } else {
//           setLocationError(
//             "⚠️ Unable to access location. Please try again later."
//           );
//         }
//       }
//     );
//   };

//   useEffect(() => {
//     if (!userLocation) return; // Don’t run until we have the location

//     const fetchNearbyUnits = async () => {
//       try {
//         setLoading(true);
//         const { lat, lng } = userLocation;
//         const response = await axios.get(`${BASE_URL}?lat=${lat}&lng=${lng}&radius=5`);
//         setNearbyUnits(response.data || []);
//       } catch (err) {
//         console.error("Error fetching nearby units:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNearbyUnits();

//   }, [userLocation]);

//   return (
//     <div className="bg-blue-50 p-4 rounded mb-8">
//       <div className="mb-4">
//         {error ? (
//           <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
//             {error}
//           </p>
//         ) : userLocation ? (
//           <p className="text-sm text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded">
//             📍 Showing CGHS units within <strong>5 km</strong> of your location.
//           </p>
//         ) : (
//           <p className="text-sm text-gray-500 italic">
//             Detecting your location...
//           </p>
//         )}
//       </div>

//       <h3 className="text-lg font-bold text-blue-800 mb-2">
//         📍 Find Nearby CGHS Units
//       </h3>

//       <div className="flex flex-wrap gap-4 items-center">
//         <select
//           value={radiusKm}
//           onChange={(e) => setRadiusKm(e.target.value)}
//           className="border p-2 rounded"
//         >
//           <option value="2000">2 km</option>
//           <option value="5000">5 km</option>
//           <option value="10000">10 km</option>
//           <option value="20000">20 km</option>
//         </select>

//         <button
//           onClick={handleFindNearby}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           🔍 Find Nearby
//         </button>
//         {locationError && (
//           <p className="text-red-600 mt-2 text-sm">{locationError}</p>
//         )}
//       </div>

//       {locationError && (
//         <p className="text-red-600 mt-2 text-sm">{locationError}</p>
//       )}

//       {showNearby && (
//         <div className="mt-6">
//           <h4 className="text-lg font-semibold mb-2">Nearby CGHS Units:</h4>
//           <CghsUnitTable
//             units={nearbyUnits}
//             onMoreOptions={onMoreOptions}
//             showDistance={true}
//           />
//         </div>
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

const BASE_URL = "https://server-v4dy.onrender.com/api/v1/public/cghsUnits";

const NearbyUnits = ({ userLocation, error, onMoreOptions }) => {
  const [radiusKm, setRadiusKm] = useState(5000);
  const [nearbyUnits, setNearbyUnits] = useState([]);
  const [loading, setLoading] = useState(false);

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
      } catch (err) {
        console.error("Error fetching nearby units:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyUnits();
  }, [userLocation, radiusKm]);

  return (
    <div className="bg-blue-50 p-4 rounded mb-8">
      <div className="mb-4">
        {error ? (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
            {error}
          </p>
        ) : userLocation ? (
          <p className="text-sm text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded">
            📍 Showing CGHS units within <strong>{radiusKm / 1000} km</strong>{" "}
            of your location.
          </p>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Detecting your location...
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label htmlFor="radius" className="text-sm font-medium">
          Radius:
        </label>
        <select
          id="radius"
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="2000">2 km</option>
          <option value="5000">5 km</option>
          <option value="10000">10 km</option>
          <option value="20000">20 km</option>
        </select>
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
        nearbyUnits.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Nearby CGHS Units:</h4>
            <CghsUnitTable
              units={nearbyUnits}
              onMoreOptions={onMoreOptions}
              showDistance={true}
            />
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
