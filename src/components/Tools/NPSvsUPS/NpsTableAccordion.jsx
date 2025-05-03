import { useState } from "react";
import PropTypes from "prop-types";

const NpsTableAccordion = ({ data }) => {
  const [expandedYear, setExpandedYear] = useState(null);

  const groupedData = data.reduce((acc, row) => {
    if (!acc[row.year]) acc[row.year] = [];
    acc[row.year].push(row);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.keys(groupedData).map((year) => (
        <div key={year} className="border rounded shadow">
          <button
            className="w-full text-left px-4 py-3 bg-gray-100 font-semibold text-base hover:bg-gray-200 transition text-gray-600"
            onClick={() => setExpandedYear(expandedYear === year ? null : year)}
          >
            {year} {expandedYear === year ? "↓" : "➝"}
          </button>

          {expandedYear === year && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-2 border">Month</th>
                    <th className="p-2 border">Age</th>
                    <th className="p-2 border">Basic Pay</th>
                    <th className="p-2 border">DA</th>
                    <th className="p-2 border">NPS Contribution</th>
                    <th className="p-2 border">NPS Corpus</th>
                    <th className="p-2 border">UPS Contribution</th>
                    <th className="p-2 border">UPS Corpus</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedData[year].map((row, idx) => {
                    const highlightClass = row.isPayCommissionMonth
                      ? "bg-yellow-100"
                      : row.isIncrementMonth
                      ? "bg-teal-50"
                      : "";

                    return (
                      <tr
                        key={idx}
                        className={`${highlightClass} hover:bg-gray-50`}
                      >
                        <td className="p-2 border">
                          {row.month} {row.isPayCommissionMonth ? "🟡" : ""}
                          {row.isIncrementMonth ? " 🟢" : ""}
                        </td>
                        <td className="p-2 border">{row.age}</td>
                        <td className="p-2 border">
                          ₹{row.basic.toLocaleString()}
                        </td>
                        <td className="p-2 border">
                          ₹{row.da.toLocaleString()}
                        </td>
                        <td className="p-2 border">
                          ₹{row.totalContributionNps.toLocaleString()}
                        </td>
                        <td className="p-2 border">
                          ₹{row.corpusNps.toLocaleString()}
                        </td>
                        <td className="p-2 border">
                          ₹{row.totalContributionUps.toLocaleString()}
                        </td>
                        <td className="p-2 border">
                          ₹{row.corpusUps.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="text-xs text-gray-600 px-4 py-2">
                <span className="mr-4">🟡 Pay Commission Month</span>
                <span>🟢 Increment Month</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

NpsTableAccordion.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default NpsTableAccordion;
