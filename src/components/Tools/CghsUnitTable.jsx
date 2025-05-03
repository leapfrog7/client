import PropTypes from "prop-types";
import { useState } from "react";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

const CghsUnitTable = ({
  units,
  totalCount,
  onMoreOptions,
  showDistance = false,
}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  // const empanelledRef = useRef(null);
  // const [isOverflowing, setIsOverflowing] = useState(false);

  const toggleExpand = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-center text-gray-600 p-3 w-3/4">
              Empanelled Units{" "}
              <span className="ml-2 text-xs text-gray-400 font-normal">
                ({totalCount} total)
              </span>
            </th>
            {/* <th className="text-left p-3">Empanelled For</th>
            {showDistance && <th className="text-left p-3">Radial Distance</th>}
            <th className="text-center p-3">Map</th>
            <th className="text-center p-3">More</th> */}
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
                <tr key={unit._id} className=" hover:bg-gray-50">
                  {/* 📍 Combined Name + Address */}
                  <td className="px-0 py-2 md:px-4 text-gray-800 align-top">
                    <div className=" rounded-lg shadow-md p-3 bg-slate-50 hover:shadow-md transition duration-200">
                      {/* Name and Accreditation */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <p className="font-semibold text-blue-700 text-sm md:text-base">
                          {unit.name}
                        </p>
                        {unit.accreditation === "NABH" && (
                          <img
                            src="/nabh.png"
                            alt="NABH"
                            className="h-4 md:h-5 inline-block"
                            title="NABH Accredited"
                          />
                        )}
                        {unit.accreditation === "NABL" && (
                          <img
                            src="/nabl.png"
                            alt="NABL"
                            className="h-4 md:h-5 inline-block"
                            title="NABL Accredited"
                          />
                        )}
                      </div>

                      {/* Address */}
                      <div className="bg-yellow-50 p-2 rounded mb-2 flex items-center">
                        {/* <p className="text-xs text-gray-500 font-medium mb-1">
                           Address:
                        </p> */}
                        📍
                        <p className="italic text-xs md:text-sm text-gray-600">
                          {fullAddress}
                        </p>
                      </div>

                      {/* Empanelled For */}
                      <div className="bg-blue-50 p-2 rounded mb-2">
                        <div
                          className={`text-xs md:text-sm text-gray-700 ${
                            isExpanded ? "" : "line-clamp-3"
                          }`}
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: isExpanded ? "none" : 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          🩺 {empanelledText}
                        </div>

                        {empanelledText.length > 140 && (
                          <button
                            onClick={() => toggleExpand(unit._id)}
                            className="text-blue-500 text-xs mt-1 hover:underline"
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </div>

                      {/* Distance */}
                      {showDistance && unit.distance && (
                        <p className="text-xs text-gray-500 mt-1">
                          📏 {(unit.distance / 1000).toFixed(2)} km away
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        {unit.googleMapsUrl ? (
                          <a
                            href={unit.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-700 hover:text-indigo-800 hover:bg-indigo-200 flex items-center gap-1 bg-indigo-100 rounded-lg py-2 px-3 shadow-sm"
                            title="Get Directions"
                          >
                            <FaMapMarkerAlt className="text-sm md:text-base " />{" "}
                            <span className="text-xs md:text-sm">
                              See on Map
                            </span>
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}

                        <button
                          onClick={() => onMoreOptions(unit)}
                          className="bg-indigo-100 text-indigo-700 flex items-center gap-1 px-3 py-2 rounded hover:bg-indigo-200 transition text-xs md:text-sm shadow-sm"
                        >
                          More Details
                          <FaArrowRight className="text-xs md:text-sm " />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* 🩺 Empanelled For */}
                  {/* <td className="px-1 py-2 md:px-2 max-w-xs text-gray-700">
                    <div
                      className={`text-xs md:text-sm lg:text-base ${
                        isExpanded ? "" : "line-clamp-3"
                      }`}
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
                  </td> */}

                  {/* {showDistance && (
                    <td className="p-1 md:p-2 text-sm text-gray-600">
                      {(unit.distance / 1000).toFixed(2)} km
                    </td>
                  )} */}

                  {/* 🗺️ Map Icon */}
                  {/* <td className="p-0 md:p-2 text-center"> */}
                  {/* {unit.googleMapsUrl ? (
                      <a
                        href={unit.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="Get Directions"
                      >
                        <FaMapMarkerAlt className="inline text-base lg:text-xl" />
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )} */}
                  {/* </td> */}

                  {/* 🔍 View */}
                  {/* <td className="p-0 text-center">
                    <button
                      onClick={() => onMoreOptions(unit)}
                      className="bg-indigo-600 text-white px-2 lg:px-3 py-2 rounded hover:bg-indigo-700 text-xs md:text-sm lg:text-base"
                    >
                      Details
                    </button>
                  </td> */}
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
