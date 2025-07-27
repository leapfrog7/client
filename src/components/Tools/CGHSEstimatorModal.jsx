import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { MdClose, MdDelete, MdEdit } from "react-icons/md";
//import { useReactToPrint } from "react-to-print";

const CGHSEstimatorModal = ({ onClose, rates, selectedCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estimateItems, setEstimateItems] = useState([]);
  const [editMenuOpenId, setEditMenuOpenId] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showNabh, setShowNabh] = useState(true);
  const [showNonNabh, setShowNonNabh] = useState(true);

  //   const estimateRef = useRef();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //   const [showExportMenu, setShowExportMenu] = useState(false);

  const handleAddItem = (item) => {
    const cityRates = item.rates?.[selectedCity] || item.rates?.Delhi || {};
    const baseNabh = cityRates.nabhRate || 0;
    const baseNonNabh = cityRates.nonNabhRate || 0;

    setEstimateItems((prev) => [
      ...prev,
      {
        _id: item._id + "-" + Date.now(),
        name: item.name,
        baseNabh,
        baseNonNabh,
        nabhRate: baseNabh,
        nonNabhRate: baseNonNabh,
        originalCategory: "Semi-Private",
        itemCategory: item.category,
      },
    ]);
    setSearchTerm("");
  };

  const handleRemoveItem = (id) => {
    setEstimateItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleRateAdjustment = (id, newCategory) => {
    const multiplier =
      newCategory === "General" ? 0.9 : newCategory === "Private" ? 1.15 : 1;
    setEstimateItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              originalCategory: newCategory,
              nabhRate: Math.round(item.baseNabh * multiplier),
              nonNabhRate: Math.round(item.baseNonNabh * multiplier),
            }
          : item
      )
    );
    setEditMenuOpenId(null);
  };

  const filteredRates = useMemo(() => {
    return rates.filter((rate) =>
      rate.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, rates]);

  const totalNabh = useMemo(
    () => estimateItems.reduce((sum, i) => sum + i.nabhRate, 0),
    [estimateItems]
  );
  const totalNonNabh = useMemo(
    () => estimateItems.reduce((sum, i) => sum + i.nonNabhRate, 0),
    [estimateItems]
  );

  //   const handlePrint = useReactToPrint({
  //     content: () => estimateRef.current,
  //     documentTitle: "CGHS_Estimate",
  //   });

  const shareViaWhatsApp = () => {
    const message =
      "🧾 *CGHS Estimate*\n" +
      estimateItems
        .map((item, idx) => {
          const rate = showNabh
            ? item.nabhRate
            : showNonNabh
            ? item.nonNabhRate
            : 0;
          return `${idx + 1}. ${item.name} – ₹${rate}`;
        })
        .join("\n") +
      `\n\n💰 *Total*: ₹${
        showNabh ? totalNabh : showNonNabh ? totalNonNabh : 0
      }`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".floating-menu")) {
        setEditMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          aria-label="Close Estimate Modal"
        >
          <MdClose size={24} />
        </button>

        <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-4">
          🧾 Prepare Your own CGHS Estimate
        </h2>

        {/* Search Box */}
        <input
          type="text"
          placeholder="🔍 Search a test or procedure..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              setHighlightedIndex((prev) =>
                Math.min(prev + 1, filteredRates.length - 1)
              );
            } else if (e.key === "ArrowUp") {
              setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter" && filteredRates[highlightedIndex]) {
              handleAddItem(filteredRates[highlightedIndex]);
            } else if (e.key === "Escape") {
              setHighlightedIndex(-1);
            }
          }}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm mb-4 shadow-sm"
        />

        {searchTerm && (
          <div className="mb-4 max-h-48 overflow-y-auto border rounded shadow-sm bg-white text-sm">
            {filteredRates.length === 0 ? (
              <p className="p-3 text-gray-500 italic">No match found</p>
            ) : (
              filteredRates.slice(0, 10).map((item, index) => (
                <div
                  key={item._id}
                  className={`px-4 py-2 border-b cursor-pointer ${
                    index === highlightedIndex
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-blue-50"
                  }`}
                  onClick={() => handleAddItem(item)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {item.name}
                </div>
              ))
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-center justify-start mb-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showNonNabh}
              onChange={() => setShowNonNabh(!showNonNabh)}
            />
            Show Non-NABH Rates
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showNabh}
              onChange={() => setShowNabh(!showNabh)}
            />
            Show NABH Rates
          </label>
        </div>

        {/* Table */}

        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-sm border mb-16">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-3 py-2 w-[40%]">
                  Test / Procedure
                </th>
                {showNonNabh && (
                  <th className="text-center px-3 py-2">Non-NABH (₹)</th>
                )}
                {showNabh && (
                  <th className="text-center px-3 py-2">NABH (₹)</th>
                )}
                <th className="text-center px-3 py-2">Edit</th>
              </tr>
            </thead>
            <tbody>
              {estimateItems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No items added yet.
                  </td>
                </tr>
              ) : (
                estimateItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50 relative"
                  >
                    {/* Name + Delete */}
                    <td className="px-3 py-2">
                      <div className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                          title="Remove"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>

                    {/* Non-NABH Rate */}
                    {showNonNabh && (
                      <td className="text-center px-3 py-2 text-gray-800">
                        ₹{item.nonNabhRate.toLocaleString("en-IN")}
                      </td>
                    )}

                    {/* NABH Rate */}
                    {showNabh && (
                      <td className="text-center px-3 py-2 text-gray-800">
                        ₹{item.nabhRate.toLocaleString("en-IN")}
                      </td>
                    )}

                    {/* Edit Column */}
                    <td className="text-center px-3 py-2 relative">
                      <button
                        onClick={() =>
                          setEditMenuOpenId((prevId) =>
                            prevId === item._id ? null : item._id
                          )
                        }
                        className="text-gray-500 hover:text-blue-600"
                        title="Edit Beneficiary Category"
                      >
                        <MdEdit size={18} />
                      </button>
                      {editMenuOpenId === item._id && (
                        <div className="absolute right-0 mt-1 w-44 bg-white border rounded shadow-lg text-xs z-50 floating-menu">
                          {["General", "Semi-Private", "Private"].map((cat) => (
                            <div
                              key={cat}
                              onClick={() =>
                                handleRateAdjustment(item._id, cat)
                              }
                              className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
                                item.originalCategory === cat
                                  ? "font-medium text-blue-700"
                                  : ""
                              }`}
                            >
                              {cat}{" "}
                              {cat === "General"
                                ? "(90%)"
                                : cat === "Private"
                                ? "(115%)"
                                : "(Default)"}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Totals */}
            {estimateItems.length > 0 && (
              <tfoot className="bg-blue-50 font-semibold">
                <tr>
                  <td className="text-right px-3 py-2">Total</td>
                  {showNonNabh && (
                    <td className="text-center px-3 py-2 text-green-700">
                      ₹{totalNonNabh.toLocaleString("en-IN")}
                    </td>
                  )}
                  {showNabh && (
                    <td className="text-center px-3 py-2 text-green-700">
                      ₹{totalNabh.toLocaleString("en-IN")}
                    </td>
                  )}
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 mb-2">
          <button
            onClick={() => {
              localStorage.setItem(
                "cghsEstimate",
                JSON.stringify({
                  items: estimateItems,
                  selectedCity,
                  timestamp: new Date().toISOString(),
                })
              );
              window.open("/print-estimate", "_blank"); // 👈 opens in new tab
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm text-sm"
          >
            🖨️ Print Estimate
          </button>

          {isMobile && (
            <button
              onClick={shareViaWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm text-sm"
            >
              💬 Share via WhatsApp
            </button>
          )}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-4 text-sm text-gray-800 shadow-sm mt-8">
          <p className="font-semibold mb-1">ℹ️ How to Use This Estimator:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Start typing the name of a test or procedure in the search box
              above.
            </li>
            <li>
              Select an item from the dropdown to add it to your estimate.
            </li>
            <li>
              By default, rates are shown for the <strong>Semi-Private</strong>{" "}
              category, which is applicable to most users.
            </li>
            <li>
              You can adjust rates for <strong>General</strong> (90%) or{" "}
              <strong>Private</strong> (115%) category using the ✏️ icon.
            </li>
            <li>
              Use the checkboxes to toggle between <strong>NABH</strong> and{" "}
              <strong>Non-NABH</strong> rates.
            </li>
            <li>
              Once done, click <strong>Print Estimate</strong> to download or
              print a detailed view. It will open in a new tab.
            </li>
            <li>
              Mobile users can also choose to share the estimate via{" "}
              <strong>WhatsApp</strong>.
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            ⚠️ <strong>Note:</strong> Diagnostic tests and investigations follow
            a fixed rate under the Semi-Private category as per CGHS norms.
            Adjustment is generally applied to procedures or surgeries.
          </p>
        </div>
      </div>
    </div>
  );
};

CGHSEstimatorModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  rates: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedCity: PropTypes.string.isRequired,
};

export default CGHSEstimatorModal;
