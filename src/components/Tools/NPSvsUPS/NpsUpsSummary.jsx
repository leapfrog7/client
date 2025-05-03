// // components/Tools/NPSvsUPS/NpsUpsSummary.jsx

import PropTypes from "prop-types";
import { format } from "date-fns";
import { useState } from "react";

const NpsUpsSummary = ({ data, joiningDate }) => {
  const [annuityPercent, setAnnuityPercent] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);
  //   const [guaranteedPeriod, setGuaranteedPeriod] = useState(0); // in years

  if (!data || data.length === 0) return null;

  const lastEntry = data[data.length - 1];
  const { basic, da, corpusNps, corpusUps } = lastEntry;

  let retirementDate;
  try {
    const parsedMonth = new Date(`${lastEntry.month} 1, ${lastEntry.year}`);
    if (isNaN(parsedMonth)) throw new Error("Invalid month format");
    retirementDate = new Date(lastEntry.year, parsedMonth.getMonth());
  } catch (err) {
    return (
      <p className="text-red-600 text-sm">
        Error: Could not parse retirement date. Ensure simulation data includes
        a valid month and year.
      </p>
    );
  }

  const lastPay = basic + da;
  const assuredPension = Math.round(basic * 0.5);
  const reducedAssuredPension = Math.round(assuredPension * 0.4);

  const effectiveAnnuityCorpus = Math.round((annuityPercent / 100) * corpusNps);
  const monthlyPension = Math.round(
    (effectiveAnnuityCorpus * (annuityRate / 100)) / 12
  );
  const adjustedLumpsum = Math.round(corpusNps - effectiveAnnuityCorpus);
  //   const guaranteedMonths = guaranteedPeriod * 12;
  //   const totalGuaranteedPayout =
  //     guaranteedPeriod > 0 ? monthlyPension * guaranteedMonths : null;

  let join = new Date(joiningDate);
  if (!joiningDate || isNaN(join)) {
    return (
      <p className="text-red-600 text-sm">
        Error: Joining date is missing or invalid. Please provide it to compute
        UPS lump sum.
      </p>
    );
  }

  const months =
    (retirementDate.getFullYear() - join.getFullYear()) * 12 +
    (retirementDate.getMonth() - join.getMonth());
  const completedBlocks = Math.floor(months / 6);
  const upsLumpsum = Math.round(completedBlocks * (lastPay / 10));

  //   const npsLumpsum = Math.round(corpusNps * 0.6);
  //   const npsAnnuityCorpus = Math.round(corpusNps * 0.4);

  return (
    <div className="bg-gray-50 p-2 sm:p-6 rounded shadow text-sm sm:text-base space-y-6">
      <h2 className="text-center text-lg sm:text-xl font-bold text-blue-800">
        Retirement Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
        <div>
          <p>
            <strong>Date of Retirement:</strong>{" "}
            {format(retirementDate, "MMMM yyyy")}
          </p>
          <p>
            <strong>Last Pay (Basic + DA):</strong> ₹{lastPay.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* NPS Summary */}

        <div className="bg-blue-50 border border-blue-200 py-4 px-2 rounded shadow-sm">
          <h3 className="text-blue-700 font-semibold mb-2">🔷 NPS Summary</h3>
          <p>
            <strong>Total Corpus:</strong> ₹{corpusNps.toLocaleString()}
          </p>

          <div className="space-y-2 mt-2 text-sm sm:text-base">
            <label className="block p-4 bg-white rounded">
              <span className="font-medium text-gray-700">
                Select Annuity % (40–100):
              </span>
              <input
                type="range"
                min={40}
                max={100}
                step={1}
                value={annuityPercent}
                onChange={(e) => setAnnuityPercent(Number(e.target.value))}
                className="w-full"
              />
              <span className="block text-center mt-1 text-blue-800 font-semibold">
                Annuity: {annuityPercent}% | Lumpsum: {100 - annuityPercent}%
              </span>
            </label>

            <label className="block p-4 bg-white rounded">
              <span className="font-medium text-gray-700">
                Annuity Interest Rate (%):{" "}
                <span className=" text-center mt-1 text-blue-800 font-semibold">
                  {annuityRate}%
                </span>
              </span>
              <input
                type="range"
                min={1}
                max={15}
                step="0.1"
                value={annuityRate}
                onChange={(e) => setAnnuityRate(Number(e.target.value))}
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>

            {/* <label className="block p-4 bg-white rounded">
              <span className="font-medium text-gray-700">
                Guaranteed Period (Years):
              </span>
              <select
                value={guaranteedPeriod}
                onChange={(e) => setGuaranteedPeriod(parseInt(e.target.value))}
                className="w-full mt-1 border rounded px-2 py-1"
              >
                {[0, 5, 10, 15, 20].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr === 0 ? "Lifetime only" : `${yr} years`}
                  </option>
                ))}
              </select>
            </label> */}

            <ul className="list-disc list-inside ml-2 mt-2 text-sm sm:text-base">
              <li>
                <strong>Monthly Pension (approx):</strong> ₹
                {monthlyPension.toLocaleString()}
              </li>
              <li>
                <strong>Adjusted Annuity Corpus:</strong> ₹
                {effectiveAnnuityCorpus.toLocaleString()}
              </li>
              <li>
                <strong>Lumpsum at Retirement:</strong> ₹
                {adjustedLumpsum.toLocaleString()}
              </li>
              {/* {guaranteedPeriod > 0 && (
                <li>
                  <strong>Guaranteed Payout ({guaranteedPeriod} yrs):</strong> ₹
                  {totalGuaranteedPayout.toLocaleString()}
                </li>
              )} */}
            </ul>
          </div>
        </div>
        {/* UPS Summary */}
        <div className="bg-green-50 border border-green-200 py-4 px-2 rounded shadow-sm">
          <h3 className="text-green-700 font-semibold mb-2">🟢 UPS Summary</h3>
          <p>
            <strong>Total Corpus:</strong> ₹{corpusUps.toLocaleString()}
          </p>
          <ul className="list-disc list-inside ml-2">
            <li className="mt-2">
              <strong>Assured Pension (50% of Basic):</strong> ₹
              {assuredPension.toLocaleString()}/mo
            </li>
            <li className="mt-2">
              <strong>Reduced Pension (if 60% Lumpsum taken):</strong> ₹
              {reducedAssuredPension.toLocaleString()}/mo
            </li>
            <li className="mt-2">
              <strong>60% Lumpsum (optional):</strong> ₹
              {Math.round(corpusUps * 0.6).toLocaleString()}
            </li>
            <li className="mt-2">
              <strong>Lumpsum at Retirement (1/10th × 6m blocks):</strong> ₹
              {upsLumpsum.toLocaleString()}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

NpsUpsSummary.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  joiningDate: PropTypes.string.isRequired,
};

export default NpsUpsSummary;
