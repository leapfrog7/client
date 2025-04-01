import { useState } from "react";
import axios from "axios";
import CghsUnitTable from "./CghsUnitTable";
import PropTypes from "prop-types";

const NearbyUnits = ({ onMoreOptions }) => {
  const [radiusKm, setRadiusKm] = useState(5000);
  const [nearbyUnits, setNearbyUnits] = useState([]);
  const [locationError, setLocationError] = useState("");
  const [showNearby, setShowNearby] = useState(false);

  // const BASE_URL = "http://localhost:5000/api/v1/public/cghsUnits"; // Replace with your live URL
  const BASE_URL = "https://server-v4dy.onrender.com/api/v1/public/cghsUnits";
  //   const handleFindNearby = () => {
  //     setLocationError("");
  //     setShowNearby(false);
  //     setNearbyUnits([]);

  //     if (!navigator.geolocation) {
  //       setLocationError("Geolocation is not supported by your browser.");
  //       return;
  //     }

  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;

  //         try {
  //           const res = await axios.get(
  //             `/api/v1/public/cghsUnits/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`
  //           );
  //           setNearbyUnits(Array.isArray(res.data) ? res.data : []);
  //           setShowNearby(true);
  //         } catch (err) {
  //           console.error("Failed to fetch nearby units:", err);
  //           setLocationError(
  //             "Something went wrong while fetching nearby hospitals."
  //           );
  //         }
  //       },
  //       (error) => {
  //         console.error("Location error:", error);
  //         setLocationError("Permission denied or failed to get your location.");
  //       }
  //     );
  //   };

  const handleFindNearby = async () => {
    setLocationError("");
    setShowNearby(false);
    setNearbyUnits([]);

    // 👇 Simulated location (Gyan Khand 1, Indirapuram)
    const latitude = 28.6389;
    const longitude = 77.3732;

    try {
      const res = await axios.get(
        `${BASE_URL}/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`
      );
      setNearbyUnits(Array.isArray(res.data) ? res.data : []);
      setShowNearby(true);
    } catch (err) {
      console.error("Failed to fetch nearby units:", err);
      setLocationError("Something went wrong while fetching nearby hospitals.");
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded mb-8">
      <h3 className="text-lg font-bold text-blue-800 mb-2">
        📍 Find Nearby CGHS Units
      </h3>

      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={radiusKm}
          onChange={(e) => setRadiusKm(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="2000">2 km</option>
          <option value="5000">5 km</option>
          <option value="10000">10 km</option>
          <option value="20000">20 km</option>
        </select>

        <button
          onClick={handleFindNearby}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔍 Find Nearby
        </button>
      </div>

      {locationError && (
        <p className="text-red-600 mt-2 text-sm">{locationError}</p>
      )}

      {showNearby && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Nearby CGHS Units:</h4>
          <CghsUnitTable
            units={nearbyUnits}
            onMoreOptions={onMoreOptions}
            showDistance={true}
          />
        </div>
      )}
    </div>
  );
};

NearbyUnits.propTypes = {
  onMoreOptions: PropTypes.func.isRequired,
};
export default NearbyUnits;
