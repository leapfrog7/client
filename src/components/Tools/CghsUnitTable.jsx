import PropTypes from "prop-types";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const CghsUnitTable = ({ units, onMoreOptions, showDistance = false }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpand = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3 w-1/3">Unit</th>
            <th className="text-left p-3">Empanelled For</th>
            {showDistance && <th className="text-left p-3">Distance</th>}
            <th className="text-left p-3 text-center">Map</th>
            <th className="text-left p-3 text-center">More</th>
          </tr>
        </thead>
        <tbody>
          {units.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No units found for the selected city.
              </td>
            </tr>
          ) : (
            units.map((unit) => {
              const isExpanded = expandedRow === unit._id;
              const empanelledText = unit.empanelledFor?.join(", ") || "";
              const fullAddress = [
                unit.address?.line1,
                unit.address?.line2,
                unit.address?.pincode,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <tr key={unit._id} className="border-t hover:bg-gray-50">
                  {/* 📍 Combined Name + Address */}
                  <td className="p-3 max-w-xs text-gray-800">
                    <p className="font-semibold text-blue-700">{unit.name}</p>
                    <p className="text-sm text-gray-600">{fullAddress}</p>
                  </td>

                  {/* 🩺 Empanelled For */}
                  <td className="p-3 max-w-xs text-gray-700">
                    <div
                      className={`text-sm ${isExpanded ? "" : "line-clamp-4"}`}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: isExpanded ? "none" : 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {empanelledText}
                    </div>
                    {empanelledText.length > 100 && (
                      <button
                        onClick={() => toggleExpand(unit._id)}
                        className="text-blue-500 text-xs mt-1 hover:underline"
                      >
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </td>

                  {showDistance && (
                    <td className="p-3 text-sm text-gray-600">
                      {(unit.distance / 1000).toFixed(2)} km
                    </td>
                  )}

                  {/* 🗺️ Map Icon */}
                  <td className="p-3 text-center">
                    {unit.googleMapsUrl ? (
                      <a
                        href={unit.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="Get Directions"
                      >
                        <FaMapMarkerAlt className="inline text-xl" />
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* 🔍 View */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onMoreOptions(unit)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

CghsUnitTable.propTypes = {
  units: PropTypes.array.isRequired,
  onMoreOptions: PropTypes.func.isRequired,
  showDistance: PropTypes.bool,
};

export default CghsUnitTable;
