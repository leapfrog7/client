import { useState } from "react";
import payMatrixData from "../../data/payMatrixData"; //Contains the pay matrix
import Helmet from "react-helmet-async";

const PayMatrix = () => {
  const payLevels = Object.keys(payMatrixData).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);

    if (numA === numB) {
      return a.length - b.length; // '13' before '13A'
    }
    return numA - numB;
  });

  const maxRows = Math.max(
    ...payLevels.map((level) => payMatrixData[level].length)
  );

  const [tooltip, setTooltip] = useState(null);

  const handleCellClick = (level, cellIndex, event) => {
    setTooltip({
      level,
      cell: cellIndex,
      x: event.clientX,
      y: event.clientY,
    });

    setTimeout(() => setTooltip(null), 4000); // Auto-dismiss after 2 seconds
  };

  const getHeaderColor = (level) => {
    const numericLevel = parseInt(level);

    if (numericLevel >= 1 && numericLevel <= 7) {
      return "bg-blue-900 text-white"; // light blue background, dark blue text
    } else if (numericLevel >= 8 && numericLevel <= 11) {
      return "bg-green-300 text-green-900"; // light green background, dark green text
    } else if (numericLevel >= 12 && numericLevel <= 13) {
      return "bg-amber-300 text-amber-900"; // amber for 12 and 13
    } else if (level === "13A") {
      return "bg-amber-200 text-amber-900"; // special case for 13A
    } else if (numericLevel >= 14) {
      return "bg-red-800 text-white"; // maroonish (rose color)
    } else {
      return "bg-gray-200"; // fallback
    }
  };

  return (
    <div className="p-4 md:p-8 md:w-11/12 mx-auto animate-fade-in">
      <Helmet>
        <title>
          7th CPC Pay Matrix Viewer | Central Govt Pay Scales | UnderSigned
        </title>
        <meta
          name="description"
          content="Explore pay levels and increments under the 7th Central Pay Commission (CPC) using an interactive pay matrix designed for Central Government employees."
        />
        <link
          rel="canonical"
          href="https://undersigned.in/pages/public/7thCPC-paymatrix"
        />
      </Helmet>

      <div className="py-3">
        <h1 className="text-xl md:text-2xl font-extrabold text-center mb-4 text-blue-900">
          7th CPC Pay Matrix — Made Easy for Mobile and Desktop
        </h1>
        <p className="text-center text-gray-600 text-sm mb-2 md:text-base">
          Quickly scroll, tap, and find your Pay Level and Cell — designed for
          effortless navigation across devices.
        </p>
      </div>

      <div className="overflow-auto max-h-[80vh] rounded-lg shadow-lg mb-8">
        <table className="min-w-max border-collapse relative text-sm">
          <thead>
            <tr>
              {/* Empty Top Left Cell */}
              <th className="sticky top-0 left-0 bg-orange-300  z-30 px-2">
                Index
              </th>
              {/* Pay Levels */}
              {payLevels.map((level) => (
                <th
                  key={level}
                  className={`sticky top-0 text-center p-2 text-xs md:text-sm lg:text-base z-20 ${getHeaderColor(
                    level
                  )}`}
                >
                  Level {level}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[...Array(maxRows)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {/* Sticky Cell Index */}
                <th className="sticky left-0 border  bg-orange-100 text-gray-700 text-center px-2 py-3  font-medium z-10 text-xs md:text-sm lg:text-base">
                  {rowIndex + 1}
                </th>

                {/* Pay Matrix Values */}
                {payLevels.map((level) => (
                  <td
                    key={`${level}-${rowIndex}`}
                    className="text-center border bg-white cursor-pointer hover:bg-amber-100 text-xs md:text-sm lg:text-base"
                    onClick={(e) => handleCellClick(level, rowIndex + 1, e)} // <<< ADD THIS
                  >
                    {payMatrixData[level][rowIndex] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tooltip && (
        <div
          className="fixed bg-gray-600 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 pointer-events-none"
          style={{
            top: tooltip.y - 30,
            left: tooltip.x - 40,
            transform: "translate(-50%, -50%)", // center it a bit
          }}
        >
          Level: {tooltip.level} <br />
          Cell: {tooltip.cell}
        </div>
      )}
    </div>
  );
};

export default PayMatrix;
