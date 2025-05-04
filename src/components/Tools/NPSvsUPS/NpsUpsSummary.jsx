// // components/Tools/NPSvsUPS/NpsUpsSummary.jsx

import PropTypes from "prop-types";
import { format } from "date-fns";
import { useState } from "react";

const NpsUpsSummary = ({ data, joiningDate }) => {
  const [annuityPercent, setAnnuityPercent] = useState(40);
  const [drIncreaseRate, setDrIncreaseRate] = useState(2);
  const [annuityRate, setAnnuityRate] = useState(6);
  //   const [guaranteedPeriod, setGuaranteedPeriod] = useState(0); // in years
  const [lifeExpectancy, setLifeExpectancy] = useState(80); // Default: 80 years
  const [discountRate, setDiscountRate] = useState(6); // Annual discount rate

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
  // const assuredPension = Math.round(basic * 0.5);
  // const reducedAssuredPension = Math.round(assuredPension * 0.4);

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

  const qualifyingYears = Math.floor(months / 12);

  // Calculate average basic from last 12 entries
  const last12Basics = data.slice(-12).map((d) => d.basic);
  const averageBasicLastYear =
    last12Basics.reduce((sum, b) => sum + b, 0) / last12Basics.length;

  // Assured payout based on rules
  let assuredPension =
    averageBasicLastYear * 0.5 * (Math.min(qualifyingYears, 25) / 25);

  // Minimum guaranteed ₹10,000 rule
  if (qualifyingYears >= 10 && assuredPension < 10000) {
    assuredPension = 10000;
  }

  // Add Dearness Relief (DR) — using last DA %
  const daPercent = Math.round((da / basic) * 100);
  const drAmount = Math.round((daPercent / 100) * assuredPension);
  const totalPensionWithDR = assuredPension + drAmount;

  const retirementAge = 60;
  const pensionEndAge = lifeExpectancy;
  const monthsOfPension = (pensionEndAge - retirementAge) * 12;
  const monthlyDiscountRate = discountRate / 100 / 12;

  let presentValue = 0;
  for (let n = 1; n <= monthsOfPension; n++) {
    presentValue += monthlyPension / Math.pow(1 + monthlyDiscountRate, n);
  }

  const returnOfPurchasePricePV =
    effectiveAnnuityCorpus / Math.pow(1 + monthlyDiscountRate, monthsOfPension);
  presentValue += returnOfPurchasePricePV;
  const pvPensionOnly = presentValue - returnOfPurchasePricePV;

  const totalPvNps = Math.round(
    pvPensionOnly + returnOfPurchasePricePV + adjustedLumpsum
  );

  // UPS Present Value Calculation
  const initialDrRate = lastEntry.da / basic; // From simulation data (DA %)
  const basePensionRaw =
    months >= 300
      ? 0.5 * basic
      : months >= 120
      ? 0.5 * basic * (months / 300)
      : 0;
  const basePension = Math.max(10000, Math.round(basePensionRaw));

  let presentValueUps = 0;
  const monthsOfUpsPension = (lifeExpectancy - retirementAge) * 12;
  let currentDr = initialDrRate;

  for (let month = 1; month <= monthsOfUpsPension; month++) {
    if (month > 1 && month % 6 === 1) {
      currentDr += drIncreaseRate / 100; // DR increases every 6 months
    }

    const monthlyPayout = basePension * (1 + currentDr);
    const discountFactor = Math.pow(1 + discountRate / 100 / 12, month);
    presentValueUps += monthlyPayout / discountFactor;
  }

  presentValueUps = Math.round(presentValueUps);
  const reducedBasePension = basePension * 0.4;

  let pvReducedPension = 0;
  let drRateReduced = initialDrRate;
  const monthlyDiscRate = discountRate / 100 / 12;

  for (let i = 0; i < lifeExpectancy * 12; i++) {
    if (i > 0 && i % 6 === 0) {
      drRateReduced += drIncreaseRate / 100;
    }

    const monthlyPayout = reducedBasePension * (1 + drRateReduced);
    const discountFactor = 1 / Math.pow(1 + monthlyDiscRate, i);
    pvReducedPension += monthlyPayout * discountFactor;
  }

  const presentValueUpsReduced = Math.round(pvReducedPension);
  const upsCorpusLumpsum = Math.round(corpusUps * 0.6); // 60% corpus withdrawal
  const totalPvUpsReduced =
    presentValueUpsReduced + upsCorpusLumpsum + upsLumpsum;

  return (
    <div className="bg-gray-50 p-2 sm:p-6 rounded shadow text-sm sm:text-base space-y-6">
      <h2 className="text-center text-lg sm:text-xl font-bold text-amber-700">
        Summary of Estimates
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
        <div className="bg-gradient-to-r from-[#fde68a]  to-[#f59e0b] p-4 rounded">
          <p>
            <strong>Date of Retirement:</strong>{" "}
            {format(retirementDate, "MMMM yyyy")}
          </p>
          <p>
            <strong>Last Pay (Basic + DA):</strong> ₹{lastPay.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <div className="space-y-2 mt-2 text-sm sm:text-base">
          {/* NPS Summary */}

          <div className="bg-blue-50 border border-blue-200 py-4 px-2 rounded shadow-sm">
            <h3 className="text-blue-700 font-semibold mb-2">🔷 NPS Summary</h3>
            <p className="py-2">
              <strong>Total Corpus:</strong> ₹{corpusNps.toLocaleString()}
            </p>

            <label className="block p-4 bg-white rounded">
              <span className="font-medium text-gray-700">
                Select Annuity Ratio % (40–100):
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
                Select Expected Rate of Annuity (%):{" "}
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
          <h3 className="text-green-700 font-semibold mb-2">🟩 UPS Summary</h3>
          <p>
            <strong>Total Corpus:</strong> ₹{corpusUps.toLocaleString()}
          </p>
          <ul className="list-disc list-inside ml-2">
            <li className="mt-2">
              <strong>Qualifying Service:</strong> {qualifyingYears} years
            </li>
            <li className="mt-2">
              <strong>Average Basic (Last 12 months):</strong> ₹
              {averageBasicLastYear.toLocaleString()}
            </li>
            <li className="mt-2">
              <strong>Assured Payout:</strong> ₹
              {assuredPension.toLocaleString()}
              /mo
            </li>
            <li className="mt-2">
              <strong>+ Dearness Relief ({daPercent}%):</strong> ₹
              {drAmount.toLocaleString()}/mo
            </li>
            <li className="mt-2 font-semibold">
              <strong>Total Payout with DR:</strong> ₹
              {totalPensionWithDR.toLocaleString()}/mo
            </li>
            <li className="mt-2">
              <strong>Lumpsum at Retirement (1/10th × 6m blocks):</strong> ₹
              {upsLumpsum.toLocaleString()}
            </li>
            <div className="bg-white m-1 p-1 rounded">
              <li className="mt-2">
                <strong>
                  Reduced Assured Payout with DR (if 60% Lumpsum taken):
                </strong>{" "}
                ₹{Math.round(totalPensionWithDR * 0.4).toLocaleString()}/mo
              </li>
              <li className="mt-2">
                <strong>60% Lumpsum (optional):</strong> ₹
                {Math.round(corpusUps * 0.6).toLocaleString()}
              </li>
            </div>
          </ul>
        </div>

        <p className="text-lg sm:text-xl bg-blue-100 text-blue-800 mt-6 text-center font-bold rounded shadow-md py-2">
          Present Value Analysis
        </p>
        {/* PV shared Items */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 sm:p-6 ">
          <h3 className="text-base sm:text-sm font-semibold text-blue-800 mb-4">
            🧮 Assumptions
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <label className="block">
              <span className="text-gray-700 font-medium">
                Life Expectancy (years) :
              </span>{" "}
              <span className="text-blue-700 font-semibold  text-center mt-1">
                {lifeExpectancy} years
              </span>
              <input
                type="range"
                min={62}
                max={110}
                step={1}
                value={lifeExpectancy}
                onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                className="w-full"
              />
            </label>

            <label className="block">
              <span className="text-gray-700 font-medium">
                Discount Rate (% annual) :
              </span>{" "}
              <span className="text-blue-700 font-semibold  text-center mt-1">
                {discountRate}%
              </span>
              <input
                type="range"
                min={1}
                max={10}
                step={0.1}
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </div>

        {/* NPS Present Value Analysis */}
        <div className="bg-yellow-50 border border-yellow-300 py-4 px-2 rounded shadow-sm mt-6">
          <h3 className="text-yellow-700 font-semibold mb-2">
            📊 NPS Present Value Analysis
          </h3>

          <div className="mt-4 text-gray-800 text-sm sm:text-base">
            <p>
              <strong>Monthly Pension:</strong> ₹
              {monthlyPension.toLocaleString()}
            </p>
            <p>
              <strong>Estimated Duration:</strong> {monthsOfPension} months
            </p>
            {/* <p>
              <strong>Present Value of Future NPS Payouts:</strong>{" "}
              <span className="text-green-700 font-bold">
                ₹{presentValueRounded.toLocaleString()}
              </span>
            </p> */}
            <p>
              <strong>Present Value of Monthly Pension:</strong> ₹
              {Math.round(pvPensionOnly).toLocaleString()}
            </p>
            <p>
              <strong>Present Value of Returned Corpus:</strong> ₹
              {Math.round(returnOfPurchasePricePV).toLocaleString()}
            </p>
            <p>
              <strong>Present Value of Lumpsum:</strong> ₹
              {adjustedLumpsum.toLocaleString()}
            </p>
            <p>
              <strong>Total Present Value (NPS):</strong>{" "}
              <span className="text-green-700 font-bold">
                ₹{totalPvNps.toLocaleString()}
              </span>
            </p>
          </div>
        </div>

        {/* UPS Present Value Block */}

        <div className="bg-cyan-50 border border-cyan-300 py-4 px-2 rounded shadow-sm mt-6">
          <h3 className="text-cyan-800 font-semibold mb-2">
            📊 UPS Present Value Analysis
          </h3>

          <p>
            <strong>Initial Dearness Relief:</strong>{" "}
            {(initialDrRate * 100).toFixed(2)}%
          </p>
          <label className="block mb-2">
            <span className="font-bold text-gray-700">
              DR Increase Rate (% every 6 months): {drIncreaseRate}%
            </span>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={drIncreaseRate}
              onChange={(e) => setDrIncreaseRate(parseFloat(e.target.value))}
              className="w-10/12 mt-1"
            />
          </label>
          <p>
            <strong>Life Expectancy:</strong> {lifeExpectancy} years
          </p>
          <p>
            <strong>Discount Rate:</strong> {discountRate.toFixed(2)}%
          </p>

          <div className="mt-4 space-y-4 text-sm sm:text-base text-gray-800">
            {/* Scenario 1: Full Pension */}
            <div className="bg-green-100 border border-green-300 p-3 rounded">
              <h4 className="font-semibold text-green-800 mb-1">
                Scenario 1: Full Pension (No Lumpsum)
              </h4>
              <p>
                <strong>Assured Payout:</strong> ₹{basePension.toLocaleString()}{" "}
                /mo
              </p>
              <p>
                <strong>Total Present Value:</strong>{" "}
                <span className="font-bold text-green-800">
                  ₹{presentValueUps.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Scenario 2: Reduced Pension + Lumpsum */}
            <div className="bg-blue-100 border border-blue-300 p-3 rounded">
              <h4 className="font-semibold text-blue-800 mb-1">
                Scenario 2: Reduced Assured Payout (40%) + Lumpsum
              </h4>
              <p>
                <strong>Reduced Assured Payout:</strong> ₹
                {Math.round(basePension * 0.4).toLocaleString()} /mo
              </p>
              <p>
                <strong>Lumpsum from UPS Corpus (60%):</strong> ₹
                {upsCorpusLumpsum.toLocaleString()}
              </p>

              <p>
                <strong>Lumpsum at Retirement:</strong> ₹
                {upsLumpsum.toLocaleString()}
              </p>
              <p>
                <strong>Present Value of Reduced Payout:</strong> ₹
                {presentValueUpsReduced.toLocaleString()}
              </p>
              <p>
                <strong>Total Present Value:</strong>{" "}
                <span className="font-bold text-blue-800">
                  ₹{totalPvUpsReduced.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Conclusion */}
      <div className="bg-purple-50 border border-purple-300 py-4 px-2 rounded shadow-sm mt-6 text-sm md:text-sm">
        <h3 className="text-purple-800 font-semibold mb-2">📌 Conclusion</h3>
        <p>
          <strong>Based on the assumptions provided:</strong>
        </p>

        <ul className="list-disc list-inside ml-4 mt-2 text-gray-800">
          <li>
            <strong>NPS Total Present Value:</strong> ₹
            {totalPvNps.toLocaleString()}
          </li>
          <li>
            <strong>UPS (Full Assured Payout) Total Present Value:</strong> ₹
            {presentValueUps.toLocaleString()}
          </li>
          <li>
            <strong>
              UPS (Reduced Assured Payout + Lumpsum) Total Present Value:
            </strong>{" "}
            ₹{totalPvUpsReduced.toLocaleString()}
          </li>
        </ul>

        <p className="mt-3 text-purple-900 font-semibold">
          {totalPvNps > totalPvUpsReduced && totalPvNps > presentValueUps
            ? "NPS offers higher total present value under current assumptions."
            : totalPvUpsReduced > totalPvNps &&
              totalPvUpsReduced > presentValueUps
            ? "UPS with reduced pension and lumpsum appears more beneficial under these assumptions."
            : "UPS with full pension seems to provide the highest total value presently."}
        </p>
      </div>
    </div>
  );
};

NpsUpsSummary.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  joiningDate: PropTypes.string.isRequired,
};

export default NpsUpsSummary;
