// components/Tools/NPSvsUPS/VrsSummary.jsx
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { differenceInMonths, addMonths, format } from "date-fns";
import SafeSlider from "./SafeSlider";
import PVComparisonChart from "./PVComparisonChart";

// --- helpers ---
const inrShort = (v) => {
  if (v == null || isNaN(v)) return "–";
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2)} Lac`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
};
const isValidDate = (d) => d instanceof Date && !Number.isNaN(d.getTime());
const monthRow = (row) => new Date(`${row.month} 1, ${row.year}`);

const VrsSummary = ({ data, joiningDate, dob }) => {
  // ------------------------------ top-level state (unconditional) ------------------------------
  const [discountRate, setDiscountRate] = useState(6); // % annual
  const [lifeExpectancy, setLifeExpectancy] = useState(80); // years
  const [drIncreaseRate, setDrIncreaseRate] = useState(2); // % every 6 months (UPS DR)
  const [annuityRate, setAnnuityRate] = useState(6); // % annual (NPS annuity)
  const [vrsServiceYears, setVrsServiceYears] = useState(25); // slider (UPS VRS needs 25y; NPS min is 20y)

  // ------------------------------ inputs & validity ------------------------------
  const hasData = Array.isArray(data) && data.length > 0;

  const join = useMemo(() => new Date(joiningDate), [joiningDate]);
  const birth = useMemo(() => new Date(dob), [dob]);
  const dobValid = isValidDate(birth);

  const firstRowDate = useMemo(
    () => (hasData ? monthRow(data[0]) : new Date("invalid")),
    [hasData, data]
  );
  const lastRowDate = useMemo(
    () => (hasData ? monthRow(data[data.length - 1]) : new Date("invalid")),
    [hasData, data]
  );

  const datesValid =
    hasData &&
    isValidDate(join) &&
    isValidDate(firstRowDate) &&
    isValidDate(lastRowDate);

  // ------------------------------ slider bounds ------------------------------
  // Max service is limited by your simulation window (join -> superannuation row)
  const totalMonthsSim = useMemo(
    () => (datesValid ? differenceInMonths(lastRowDate, join) + 1 : 0),
    [datesValid, lastRowDate, join]
  );
  const maxServiceYears = Math.max(25, Math.floor(totalMonthsSim / 12)); // at least 25y available
  const clampedServiceYears = Math.min(
    Math.max(vrsServiceYears, 25),
    maxServiceYears
  );

  // Selected VRS date
  const vrsDate = useMemo(
    () =>
      datesValid
        ? addMonths(join, clampedServiceYears * 12)
        : new Date("invalid"),
    [datesValid, join, clampedServiceYears]
  );

  // Superannuation (age-60) date is your simulation's last row (assumes sim ends at 60)
  // Also compute age-60 from DOB to derive horizons; both should coincide in a well-formed sim
  const age60Date = useMemo(
    () => (dobValid ? addMonths(birth, 60 * 12) : lastRowDate),
    [dobValid, birth, lastRowDate]
  );

  // Pick active row at VRS (or latest before it; else fallback to last)
  const activeRow = useMemo(() => {
    if (!datesValid) return null;
    // exact match?
    const tY = vrsDate.getFullYear();
    const tM = vrsDate.getMonth();
    const exact =
      data.find((r) => {
        const d = monthRow(r);
        return isValidDate(d) && d.getFullYear() === tY && d.getMonth() === tM;
      }) || null;
    if (exact) return exact;
    // nearest earlier
    let pick = null;
    for (let i = data.length - 1; i >= 0; i--) {
      const d = monthRow(data[i]);
      if (isValidDate(d) && d <= vrsDate) {
        pick = data[i];
        break;
      }
    }
    return pick ?? data[data.length - 1];
  }, [datesValid, data, vrsDate]);

  // Row at age 60 (for initial DR at 60)
  const rowAt60 = useMemo(() => {
    if (!datesValid) return null;
    // assume last row is 60; still try to match exactly
    const tY = age60Date?.getFullYear?.() ?? 0;
    const tM = age60Date?.getMonth?.() ?? 0;
    const exact =
      data.find((r) => {
        const d = monthRow(r);
        return isValidDate(d) && d.getFullYear() === tY && d.getMonth() === tM;
      }) || null;
    return exact ?? data[data.length - 1];
  }, [datesValid, data, age60Date]);

  // Fallback-safe core reads
  const basicAtVRS = activeRow?.basic ?? 0;
  const daAtVRS = activeRow?.da ?? 0;
  const corpusNpsAtVRS = activeRow?.corpusNps ?? 0;
  const corpusUpsAtVRS = activeRow?.corpusUps ?? 0;

  const basicAt60 = rowAt60?.basic ?? 0;
  const daAt60 = rowAt60?.da ?? 0;
  const daPctAt60 = basicAt60 ? daAt60 / basicAt60 : 0; // initial DR at 60

  // Average basic over last 12 months up to VRS (UPS base)
  const avgBasic12BeforeVRS = useMemo(() => {
    if (!datesValid || !isValidDate(vrsDate)) return 0;
    const rows = [];
    for (let i = data.length - 1; i >= 0 && rows.length < 12; i--) {
      const d = monthRow(data[i]);
      if (isValidDate(d) && d <= vrsDate) rows.push(data[i]);
    }
    if (rows.length === 0) return 0;
    const sum = rows.reduce((s, r) => s + (r.basic || 0), 0);
    return sum / rows.length;
  }, [datesValid, data, vrsDate]);

  // Service at VRS (UPS)
  const vrsMonthsService = useMemo(
    () =>
      datesValid && isValidDate(vrsDate)
        ? differenceInMonths(vrsDate, join) + 1
        : 0,
    [datesValid, vrsDate, join]
  );
  const vrsYearsService = Math.floor(vrsMonthsService / 12);

  // Assured pension (pre-DR) at 60 (UPS), with 10k minimum if >=10y
  const assuredPensionUPS = useMemo(() => {
    const raw =
      0.5 * avgBasic12BeforeVRS * (Math.min(vrsYearsService, 25) / 25);
    if (vrsYearsService >= 10 && raw < 10000) return 10000;
    return Math.round(raw);
  }, [avgBasic12BeforeVRS, vrsYearsService]);

  // Discounting setup (PV vantage = VRS date)
  const monthlyDisc = discountRate / 100 / 12;
  const monthsDelay = useMemo(() => {
    if (!isValidDate(vrsDate) || !isValidDate(age60Date)) return 0;
    return Math.max(0, differenceInMonths(age60Date, vrsDate));
  }, [vrsDate, age60Date]);

  // UPS pension months: from 60 to life expectancy
  const monthsOfPayoutUPS = useMemo(() => {
    if (!isValidDate(age60Date) || !dobValid) return 0;
    const end = addMonths(birth, lifeExpectancy * 12);
    return Math.max(0, differenceInMonths(end, age60Date) + 1);
  }, [dobValid, age60Date, birth, lifeExpectancy]);

  // PV of UPS pension (starts at 60) + six-month block gratuity (also at 60) discounted back to VRS
  const pvUpsVrs = useMemo(() => {
    // pension stream
    let pvStream = 0;
    let dr = daPctAt60; // DR at 60 as the starting DR
    for (let m = 1; m <= monthsOfPayoutUPS; m++) {
      if (m > 1 && m % 6 === 1) dr += drIncreaseRate / 100; // step every 6 months AFTER 60
      const monthlyPay = assuredPensionUPS * (1 + dr);
      // discount to VRS: wait (monthsDelay) + month index
      pvStream += monthlyPay / Math.pow(1 + monthlyDisc, monthsDelay + m);
    }
    // six-month block gratuity (1/10 × last pay per 6m block of service), paid at 60
    const blocks = Math.floor(vrsMonthsService / 6);
    const lastPayAtVRS = basicAtVRS + daAtVRS;
    const upsGratuityAt60 = blocks * (lastPayAtVRS / 10);
    const upsGratuityPVtoVRS =
      upsGratuityAt60 / Math.pow(1 + monthlyDisc, monthsDelay);
    return {
      pv: Math.round(pvStream + upsGratuityPVtoVRS),
      gratuityAt60: Math.round(upsGratuityAt60),
    };
  }, [
    daPctAt60,
    monthsOfPayoutUPS,
    drIncreaseRate,
    assuredPensionUPS,
    monthlyDisc,
    monthsDelay,
    vrsMonthsService,
    basicAtVRS,
    daAtVRS,
  ]);

  // NPS premature exit (at VRS)
  const prematureSmallCorpus = corpusNpsAtVRS <= 250000;
  const annuityShare = prematureSmallCorpus ? 0 : 0.8;
  const lumpsumShare = prematureSmallCorpus ? 1.0 : 0.2;

  const monthsAnnuityNPS = useMemo(() => {
    if (!dobValid || !isValidDate(vrsDate)) return 0;
    const end = addMonths(birth, lifeExpectancy * 12);
    return Math.max(0, differenceInMonths(end, vrsDate) + 1);
  }, [dobValid, vrsDate, birth, lifeExpectancy]);

  const npsPV = useMemo(() => {
    const annCorpus = corpusNpsAtVRS * annuityShare;
    const monthlyAnnuity = (annCorpus * (annuityRate / 100)) / 12;
    let pvPension = 0;
    for (let m = 1; m <= monthsAnnuityNPS; m++) {
      pvPension += monthlyAnnuity / Math.pow(1 + monthlyDisc, m); // discounted to VRS
    }
    const rppPV = annCorpus / Math.pow(1 + monthlyDisc, monthsAnnuityNPS);
    const lumpNow = corpusNpsAtVRS * lumpsumShare; // at VRS
    return {
      annCorpus: Math.round(annCorpus),
      monthlyAnnuity: Math.round(monthlyAnnuity),
      lumpNow: Math.round(lumpNow),
      pv: Math.round(pvPension + rppPV + lumpNow),
      pvPension: Math.round(pvPension),
      rppPV: Math.round(rppPV),
    };
  }, [
    corpusNpsAtVRS,
    annuityShare,
    lumpsumShare,
    annuityRate,
    monthsAnnuityNPS,
    monthlyDisc,
  ]);

  // Ready flag (no early returns to keep hooks order stable)
  const ready = datesValid && !!activeRow && !!rowAt60;

  // ------------------------------ render ------------------------------
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded p-3 sm:p-5 space-y-4">
      {!ready ? (
        <div className="text-sm text-red-600">
          Unable to render VRS summary. Please check Joining Date, DOB, and
          simulation data.
        </div>
      ) : (
        <>
          <h2 className="text-indigo-800 font-bold text-lg sm:text-xl">
            PV Analysis for VRS
          </h2>

          {/* info box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-1 text-sm leading-relaxed">
            <h4 className="font-semibold text-yellow-800 mb-2">
              ℹ️ Understanding VRS under UPS vs NPS
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>
                Minimum service for VRS: <strong>25 years under UPS</strong>;{" "}
                <strong>20 years under NPS</strong>.
              </li>
              <li>
                Under <strong>UPS</strong>, both pension and Dearness Relief
                start only at <strong>age 60</strong>.
              </li>
              <li>
                The <strong>One time lumpsum benefit</strong> under UPS is also
                paid at <strong>age 60</strong> (discounted back to VRS in PV).
              </li>
              <li>
                Under <strong>NPS</strong>, at VRS the split is:
                {` `}
                <em>if corpus ≤ ₹2.5L → 100% lumpsum</em>;{` `}
                <em>else 80% annuity / 20% lumpsum</em>. Annuity starts from the
                VRS date.
              </li>
              <li>
                All amounts shown are{" "}
                <strong>present values at the VRS date</strong>—money received
                later (e.g., UPS at 60) is worth less today.
              </li>
            </ul>
          </div>

          {/* context */}
          <div className="grid sm:grid-cols-3 gap-3 text-sm sm:text-base">
            <div className="bg-white p-3 rounded shadow">
              <div className="font-medium text-gray-600">Date of Joining</div>
              <div className="font-semibold">{format(join, "MMM yyyy")}</div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="font-medium text-gray-600">Chosen VRS Date</div>
              <div className="font-semibold">{format(vrsDate, "MMM yyyy")}</div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="font-medium text-gray-600">
                Normal Retirement (60)
              </div>
              <div className="font-semibold">
                {format(age60Date, "MMM yyyy")}
              </div>
            </div>
          </div>

          {/* VRS slider (min 25y for UPS; note NPS=20y) */}
          <label className="block bg-white p-3 rounded shadow">
            <div className="text-gray-800 font-medium">
              VRS Years of Service:{" "}
              <span className="text-indigo-700 font-semibold">
                {clampedServiceYears} yrs
              </span>
              <span className="ml-2 text-xs text-gray-500">
                (Min for UPS: 25y • Min for NPS: 20y • Max: {maxServiceYears}y)
              </span>
            </div>
            <SafeSlider
              name="vrsServiceYears"
              min={25}
              max={maxServiceYears}
              step={1}
              value={clampedServiceYears}
              onChange={(v) => setVrsServiceYears(Number(v))}
              className="w-full mt-2"
            />
            <div className="mt-1 text-xs text-gray-600">
              Delay to 60: {monthsDelay} months
            </div>
          </label>

          {/* shared assumptions */}
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="block bg-white p-3 rounded shadow">
              <div className="font-medium text-gray-700">
                Discount Rate (annual)
              </div>
              <p className="text-xs text-gray-500">
                {" "}
                It is the percentage that reduces the value of money received in
                the future to its equivalent worth today.
              </p>
              <div className="text-indigo-700 font-semibold">
                {discountRate}%
              </div>
              <SafeSlider
                name="discountRate"
                min={1}
                max={10}
                step={0.1}
                value={discountRate}
                onChange={(v) => setDiscountRate(Number(v))}
                className="mt-2"
              />
            </label>
            <label className="block bg-white p-3 rounded shadow">
              <div className="font-medium text-gray-700">Life Expectancy</div>
              <div className="text-indigo-700 font-semibold">
                {lifeExpectancy} yrs
              </div>
              <SafeSlider
                name="lifeExpectancy"
                min={62}
                max={110}
                step={1}
                value={lifeExpectancy}
                onChange={(v) => setLifeExpectancy(Number(v))}
                className="mt-2"
              />
            </label>
            <label className="block bg-white p-3 rounded shadow">
              <div className="font-medium text-gray-700">
                UPS DR increase (per 6 months)
              </div>
              <div className="text-indigo-700 font-semibold">
                {drIncreaseRate}%
              </div>
              <SafeSlider
                name="drIncreaseRate"
                min={0}
                max={10}
                step={0.1}
                value={drIncreaseRate}
                onChange={(v) => setDrIncreaseRate(Number(v))}
                className="mt-2"
              />
            </label>
          </div>

          {/* NPS premature exit */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded">
            <h3 className="text-blue-800 font-semibold mb-2">
              VRS under NPS (Premature Exit)
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm sm:text-base">
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Corpus at VRS</div>
                <div className="font-semibold">{inrShort(corpusNpsAtVRS)}</div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Rule applied</div>
                <div className="font-semibold">
                  {prematureSmallCorpus
                    ? "≤ ₹2.5L → 100% Lumpsum"
                    : "80% Annuity / 20% Lumpsum"}
                </div>
              </div>
              <label className="bg-white p-3 rounded shadow block">
                <div className="text-gray-600">Annuity Rate</div>
                <div className="text-blue-800 font-semibold">
                  {annuityRate}%
                </div>
                <SafeSlider
                  name="annuityRate"
                  min={1}
                  max={15}
                  step={0.1}
                  value={annuityRate}
                  onChange={(v) => setAnnuityRate(Number(v))}
                  className="mt-2"
                />
              </label>
            </div>
            <div className="grid sm:grid-cols-4 gap-3 mt-3 text-sm sm:text-base">
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Annuity Corpus</div>
                <div className="font-semibold">{inrShort(npsPV.annCorpus)}</div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Monthly Annuity</div>
                <div className="font-semibold">
                  {inrShort(npsPV.monthlyAnnuity)}
                </div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Lumpsum (at VRS)</div>
                <div className="font-semibold">{inrShort(npsPV.lumpNow)}</div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Total PV (at VRS)</div>
                <div className="font-bold text-blue-800">
                  {inrShort(npsPV.pv)}
                </div>
              </div>
            </div>
          </div>

          {/* UPS under VRS */}
          <div className="bg-green-50 border border-green-200 p-3 rounded">
            <h3 className="text-green-800 font-semibold mb-2">
              VRS under UPS (Assured Payout paid at 60)
            </h3>
            <div className="grid sm:grid-cols-4 gap-3 text-sm sm:text-base">
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">
                  Avg. Basic (last 12 mo pre‑VRS)
                </div>
                <div className="font-semibold">
                  {inrShort(avgBasic12BeforeVRS)}
                </div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Assured Payout (pre‑DR)</div>
                <div className="font-semibold">
                  {inrShort(assuredPensionUPS)} /mo
                </div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Initial DR at 60</div>
                <div className="font-semibold">
                  {(daPctAt60 * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">UPS Corpus (context)</div>
                <div className="font-semibold">{inrShort(corpusUpsAtVRS)}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-3 text-sm sm:text-base">
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">
                  One time lumpsum (paid at 60)
                </div>
                <div className="font-semibold">
                  {inrShort(pvUpsVrs.gratuityAt60)}
                </div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Delay to start (VRS → 60)</div>
                <div className="font-semibold">{monthsDelay} months</div>
              </div>
              <div className="bg-white p-3 rounded shadow">
                <div className="text-gray-600">Total PV at VRS</div>
                <div className="font-bold text-green-800">
                  {inrShort(pvUpsVrs.pv)}
                </div>
              </div>
            </div>
          </div>

          {/* comparison */}
          <PVComparisonChart
            nps={npsPV.pv}
            upsFull={pvUpsVrs.pv}
            upsReduced={null}
          />
        </>
      )}
    </div>
  );
};

VrsSummary.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired, // rows with {month, year, basic, da, corpusNps, corpusUps}
  joiningDate: PropTypes.string.isRequired, // e.g., "2005-07-01"
  dob: PropTypes.string.isRequired, // e.g., "1970-06-15"
};

export default VrsSummary;
