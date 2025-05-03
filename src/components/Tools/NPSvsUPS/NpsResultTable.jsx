// NpsResultTable.jsx

import PropTypes from "prop-types";

const NpsResultTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Month & Year</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">Basic Pay (₹)</th>
            <th className="p-2 border">DA (₹)</th>
            <th className="p-2 border">NPS Contribution (₹)</th>
            <th className="p-2 border">NPS Corpus (₹)</th>
            <th className="p-2 border">UPS Contribution (₹)</th>
            <th className="p-2 border">UPS Corpus (₹)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const highlightClass = row.isPayCommissionMonth
              ? "bg-yellow-100"
              : row.isIncrementMonth
              ? "bg-blue-100"
              : "";

            return (
              <tr key={idx} className={highlightClass}>
                <td className="p-2 border">
                  {row.month} {row.year}{" "}
                  {row.isPayCommissionMonth && (
                    <span
                      title="Pay Commission Revision"
                      className="text-xs ml-1 text-orange-600 font-semibold"
                    >
                      🔼
                    </span>
                  )}
                </td>
                <td className="p-2 border">{row.age}</td>
                <td className="p-2 border">₹{row.basic.toLocaleString()}</td>
                <td className="p-2 border">₹{row.da.toLocaleString()}</td>
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
    </div>
  );
};

NpsResultTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      basic: PropTypes.number.isRequired,
      da: PropTypes.number.isRequired,
      totalContributionNps: PropTypes.number.isRequired,
      corpusNps: PropTypes.number.isRequired,
      totalContributionUps: PropTypes.number.isRequired,
      corpusUps: PropTypes.number.isRequired,
      isIncrementMonth: PropTypes.bool,
      isPayCommissionMonth: PropTypes.bool,
    })
  ).isRequired,
};

export default NpsResultTable;
