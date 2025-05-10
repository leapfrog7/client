// // components/Tools/NPSvsUPS/NpsUpsSummary.jsx

import PropTypes from "prop-types";
import { format } from "date-fns";
import { useState } from "react";
import SafeSlider from "./SafeSlider";
import PVComparisonChart from "./PVComparisonChart";

const NpsUpsSummary = ({ data, joiningDate }) => {
  const [annuityPercent, setAnnuityPercent] = useState(40);
  const [drIncreaseRate, setDrIncreaseRate] = useState(2);
  const [annuityRate, setAnnuityRate] = useState(6);
  //   const [guaranteedPeriod, setGuaranteedPeriod] = useState(0); // in years
  const [lifeExpectancy, setLifeExpectancy] = useState(80); // Default: 80 years
  const [discountRate, setDiscountRate] = useState(6); // Annual discount rate
  const [upsPensionPercent, setUpsPensionPercent] = useState(100); // default 100%

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

  const upsLumpsumWithdraw = Math.round(
    corpusUps * ((100 - upsPensionPercent) / 100)
  );
  const reducedPensionWithDR = Math.round(
    totalPensionWithDR * (upsPensionPercent / 100)
  );

  // Utility function (place it outside your component or in a utils file)
  const formatIndianCurrencyShort = (value) => {
    if (value >= 1e7) return `₹${(value / 1e7).toFixed(2)} Cr`;
    if (value >= 1e5) return `₹${(value / 1e5).toFixed(2)} Lac`;
    return `₹${value.toLocaleString("en-IN")}`;
  };

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
            <p className="py-2 font-semibold">
              <span>Total Corpus: </span>
              {formatIndianCurrencyShort(corpusNps)}
            </p>

            <label className="block p-4 bg-white rounded">
              <span className="font-medium text-gray-700">
                Select Annuity Ratio % (40–100):
              </span>
              <SafeSlider
                name="annuityPercent"
                min={40}
                max={100}
                step={1}
                value={annuityPercent}
                onChange={(val) => setAnnuityPercent(Number(val))}
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
              <SafeSlider
                name="annuityRate"
                min={1}
                max={15}
                step="0.1"
                value={annuityRate}
                onChange={(val) => setAnnuityRate(Number(val))}
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

            <table className="w-full text-sm sm:text-base mt-2">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-700 flex items-center gap-2">
                    Monthly Pension
                    <span className="relative group cursor-pointer text-blue-600">
                      ℹ️
                      <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                        This is the approximate monthly pension based on annuity
                        rate and corpus used.
                      </div>
                    </span>
                  </td>
                  <td className="py-2 text-right font-semibold">
                    {formatIndianCurrencyShort(monthlyPension)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-700 flex items-center gap-2">
                    Corpus for Annuity
                    <span className="relative group cursor-pointer text-blue-600">
                      ℹ️
                      <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                        Portion of NPS corpus allocated for monthly pension
                        purchase.
                      </div>
                    </span>
                  </td>
                  <td className="py-2 text-right font-semibold">
                    {formatIndianCurrencyShort(effectiveAnnuityCorpus)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-700 flex items-center gap-2">
                    Lumpsum at Retirement
                    <span className="relative group cursor-pointer text-blue-600">
                      ℹ️
                      <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                        Amount you receive immediately at retirement from
                        remaining NPS corpus.
                      </div>
                    </span>
                  </td>
                  <td className="py-2 text-right font-semibold">
                    {formatIndianCurrencyShort(adjustedLumpsum)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* UPS Summary */}
        <div className="bg-green-50 border border-green-200 py-4 px-2 rounded shadow-sm">
          <h3 className="text-green-700 font-semibold mb-2">🟩 UPS Summary</h3>
          <p>
            <strong>Total Corpus: </strong>
            {formatIndianCurrencyShort(corpusUps)}
          </p>
          <table className="w-full text-sm sm:text-base mt-2">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Qualifying Service
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      The number of years you’ve worked in government service —
                      this determines how much pension your’e entitled to. Full
                      payout is given for service of 25 years or more.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {qualifyingYears} years
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Avg. Basic Pay (Last 12 mo)
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-[-2] z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      The average of your basic salary over the final year
                      before retirement. Used to calculate pension.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(averageBasicLastYear)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Assured Payout
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      This is your monthly assured payout before any dearness
                      relief is added, based on qualifying service.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(assuredPension)} /mo
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  + Dearness Relief ({daPercent}%)
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      Dearness Relief to be given on top of your assured payout
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(drAmount)} /mo
                </td>
              </tr>
              <tr className="border-b font-semibold text-green-800">
                <td className="py-2">
                  Total Payout with DR
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      This is your final monthly payout including the dearness
                      relief.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(totalPensionWithDR)} /mo
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-gray-700">
                  Lumpsum (1/10 × 6m blocks)
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-[3] z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      Under UPS, for every 6 months of service, 1/10th of Basic
                      + DA is paid as retirement benefit.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(upsLumpsum)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* <div className="bg-white m-1 p-1 rounded">
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
            </div> */}
          <div className="bg-white m-1 px-2 py-2 rounded mt-4 border">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Reduced UPS Payout % (40–100):
            </label>
            <SafeSlider
              name="upsPensionPercent"
              min={40}
              max={100}
              step={1}
              value={upsPensionPercent}
              onChange={(val) => setUpsPensionPercent(Number(val))}
              className="w-full"
            />
            <span className="text-center block text-blue-700 font-semibold mt-1">
              Assured Payout : {upsPensionPercent}% | Lumpsum:{" "}
              {100 - upsPensionPercent}%
            </span>

            <table className="w-full text-sm sm:text-base mt-3">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium text-gray-700">
                    Reduced Payout with DR
                    <span className="relative group cursor-pointer text-blue-600 ml-1">
                      ℹ️
                      <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                        If you opt to take part of the corpus as lumpsum (up to
                        60%), your assured payout reduces accordingly. This is
                        the adjusted pension including the DR as well.
                      </div>
                    </span>
                  </td>
                  <td className="py-2 text-right  font-semibold">
                    {formatIndianCurrencyShort(reducedPensionWithDR)} /mo
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-gray-700">
                    Lumpsum Withdrawn
                    <span className="relative group cursor-pointer text-blue-600 ml-1">
                      ℹ️
                      <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                        Amount withdrawn upfront from your retirement corpus if
                        you opt for partial withdrawal.
                      </div>
                    </span>
                  </td>
                  <td className="py-2 text-right font-semibold">
                    {formatIndianCurrencyShort(upsLumpsumWithdraw)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
              <SafeSlider
                name="lifeExpectancy"
                min={62}
                max={110}
                step={1}
                value={lifeExpectancy}
                onChange={(val) => setLifeExpectancy(Number(val))}
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
              <SafeSlider
                name="discountRate"
                min={1}
                max={10}
                step={0.1}
                value={discountRate}
                onChange={(val) => setDiscountRate(Number(val))}
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

          <table className="w-full text-sm sm:text-base mt-4 text-gray-800">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">
                  Monthly NPS Payout
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      Payout generated from your annuity purchase (e.g., 40% of
                      NPS corpus) for a given rate of annuity.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(monthlyPension)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">
                  Life Expectancy after 60
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      Total number of months the pension will be received after
                      retirement (e.g., 240 months = 20 years).
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {monthsOfPension} months
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">
                  PV of Monthly Pension
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      The current value of all monthly payments you will receive
                      after retirement under NPS.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(Math.round(pvPensionOnly))}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">
                  PV of Returned Corpus
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      The present value of the annuity purchase amount that is
                      returned to your nominee upon death.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(
                    Math.round(returnOfPurchasePricePV)
                  )}
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">
                  PV of Lumpsum
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48">
                      The present value of the portion of your NPS corpus
                      withdrawn as lumpsum.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(adjustedLumpsum)}
                </td>
              </tr>
              <tr className="font-bold text-green-800">
                <td className="py-2">
                  Total PV (NPS)
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48 font-normal">
                      Combined present value of pension, lumpsum, and return of
                      purchase corpus — represents the total monetary worth of
                      NPS benefits at retirement.
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold">
                  {formatIndianCurrencyShort(totalPvNps)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* UPS Present Value Block */}

        <div className="bg-cyan-50 border border-cyan-300 py-4 px-2 rounded shadow-sm mt-6">
          <h3 className="text-cyan-800 font-semibold mb-4">
            📊 UPS Present Value Analysis
          </h3>

          <table className="w-full text-sm sm:text-base text-gray-800 mb-4">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium">
                  Initial Dearness Relief
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48 font-normal">
                      DA % at retirement (used as starting DR).
                    </div>
                  </span>
                </td>
                <td className="py-2 text-right font-semibold w-1/5">
                  {(initialDrRate * 100).toFixed(2)}%
                </td>
              </tr>
              <tr className="">
                <td className="pt-2 font-medium ">
                  DR Increase Rate (every 6m)
                  <span className="relative group cursor-pointer text-blue-600 ml-1">
                    ℹ️
                    <div className="absolute bottom-full mb-1 left-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48 font-normal">
                      The assumed growth in DR, applied every 6 months.
                    </div>
                  </span>
                </td>

                <td className="pt-2 text-right font-semibold">
                  {drIncreaseRate}%
                </td>
              </tr>

              <div className="ml-0 w-4/5">
                <label className="block mb-2 text-center mt-2 p-2 mx-auto rounded-lg">
                  <span className="font-bold text-gray-700 text-xs">
                    Adjust DR Increase Rate (% every 6 months){" "}
                  </span>
                  <SafeSlider
                    name="drIncreaseRate"
                    min={0}
                    max={10}
                    step={0.1}
                    value={drIncreaseRate}
                    onChange={(val) => setDrIncreaseRate(parseFloat(val))}
                    className="w-full mt-2"
                  />
                </label>
              </div>
              <tr className="border-b border-t">
                <td className="py-2 font-medium">Life Expectancy</td>
                <td className="py-2 text-right font-semibold">
                  {monthsOfPension} months
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Discount Rate</td>
                <td className="py-2 text-right font-semibold">
                  {discountRate.toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>

          <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base mt-6">
            {/* Scenario 1: Full Pension */}
            <div className="bg-green-100 border border-green-300 p-3 rounded">
              <h4 className="font-semibold text-green-800 mb-2">
                Scenario 1: Full Assured Payout (No Lumpsum)
                <span className="relative group cursor-pointer text-blue-600 ml-1">
                  ℹ️
                  <div className="absolute bottom-full mb-1 right-0 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48 font-normal">
                    Case where you take full monthly pension and no corpus
                    withdrawal.
                  </div>
                </span>
              </h4>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-medium">Assured Payout</td>
                    <td className="py-2 text-right font-semibold">
                      {formatIndianCurrencyShort(basePension)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Total Present Value</td>
                    <td className="py-2 text-right text-green-800 font-bold">
                      {formatIndianCurrencyShort(presentValueUps)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scenario 2: Reduced Pension + Lumpsum */}
            <div className="bg-blue-100 border border-blue-300 p-3 rounded">
              <h4 className="font-semibold text-blue-800 mb-2">
                Scenario 2: Reduced Payout (40%) + Lumpsum
                <span className="relative group cursor-pointer text-blue-600 ml-1">
                  ℹ️
                  <div className="absolute bottom-full mb-1 right-1 z-10 hidden group-hover:block bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md w-40 md:w-48 font-normal">
                    Case where you take 60% of UPS corpus as lumpsum and receive
                    only 40% of monthly pension.
                  </div>
                </span>
              </h4>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-b-gray-100">
                    <td className="py-2 font-medium">Reduced Payout</td>
                    <td className="py-2 text-right font-semibold">
                      {formatIndianCurrencyShort(Math.round(basePension * 0.4))}
                    </td>
                  </tr>
                  <tr className="border-b border-b-gray-100">
                    <td className="py-2 font-medium">60% UPS Corpus Lumpsum</td>
                    <td className="py-2 text-right font-semibold">
                      {formatIndianCurrencyShort(upsCorpusLumpsum)}
                    </td>
                  </tr>
                  <tr className="border-b border-b-gray-100">
                    <td className="py-2 font-medium">6m Block Lumpsum</td>
                    <td className="py-2 text-right font-semibold">
                      {formatIndianCurrencyShort(upsLumpsum)}
                    </td>
                  </tr>
                  <tr className="border-b border-b-gray-100">
                    <td className="py-2 font-medium">PV of Reduced Payout</td>
                    <td className="py-2 text-right font-semibold">
                      {formatIndianCurrencyShort(presentValueUpsReduced)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Total Present Value</td>
                    <td className="py-2 text-right text-blue-800 font-bold">
                      {formatIndianCurrencyShort(totalPvUpsReduced)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="mt-6">
        <h4 className="font-semibold text-purple-800 mb-2">
          Comparative Present Value Chart
        </h4>
        <div className="bg-white p-3 rounded shadow-sm">
          <Bar data={comparisonData} options={comparisonOptions} />
        </div>
      </div> */}

      <PVComparisonChart
        nps={totalPvNps}
        upsFull={presentValueUps}
        upsReduced={totalPvUpsReduced}
      />

      {/* Comparative Conclusion */}
      <div className="bg-purple-50 border border-purple-300 py-4 px-2 rounded shadow-sm mt-6 text-sm md:text-sm">
        <h3 className="text-purple-800 font-semibold mb-3">📌 Conclusion</h3>
        <p className="text-gray-800 font-medium mb-3">
          Based on the assumptions provided:
        </p>

        <table className="w-full text-gray-800 mb-3">
          <tbody>
            <tr className="border-b ">
              <td className="py-2 font-medium w-2/3 md:w-full">
                NPS Total Present Value <br></br>{" "}
                <span className="text-xs">(as per assumptions)</span>
              </td>
              <td className="py-2 text-right font-semibold">
                {formatIndianCurrencyShort(totalPvNps)}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">
                UPS (Full Assured Payout) Present Value <br />
                <span className="text-xs">(Scenario 1)</span>
              </td>
              <td className="py-2 text-right font-semibold">
                {formatIndianCurrencyShort(presentValueUps)}
              </td>
            </tr>
            <tr>
              <td className="py-2 font-medium">
                UPS (Reduced Payout + Lumpsum) Present Value <br />
                <span className="text-xs">(Scenario 2)</span>
              </td>
              <td className="py-2 text-right font-semibold">
                {formatIndianCurrencyShort(totalPvUpsReduced)}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="mt-3 text-purple-900 font-semibold text-sm sm:text-base">
          {totalPvNps > totalPvUpsReduced && totalPvNps > presentValueUps
            ? "✅ NPS offers higher total present value under current assumptions."
            : totalPvUpsReduced > totalPvNps &&
              totalPvUpsReduced > presentValueUps
            ? "✅ UPS with reduced pension and lumpsum appears more beneficial under these assumptions."
            : "✅ UPS with full pension seems to provide the highest total value presently."}
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
