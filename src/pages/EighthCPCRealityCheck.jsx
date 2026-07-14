import { useMemo, useState } from "react";
import PropTypes from "prop-types";

const SOURCES = {
  eighthGazette: "https://egazette.gov.in/WriteReadData/2025/267353.pdf",
  eighthWebsite: "https://8cpc.gov.in/",
  eighthTor: "https://8cpc.gov.in/terms-of-reference/",
  seventhReport:
    "https://doe.gov.in/files/cenetral-pay_document/7cpc_report_eng.pdf",
  seventhDecision:
    "https://doe.gov.in/files/cenetral-pay_document/Cabinet_decisions_7thCPC_29062016.pdf",
  sixthImplementation:
    "https://doe.gov.in/files/cenetral-pay_document/6cpcmemo.pdf",
  daOrder: "https://doe.gov.in/files/circulars_document/DAorder7cpc.pdf",
  budgetGlance: "https://www.indiabudget.gov.in/doc/budget_at_glance/bag1.pdf",
  budgetSalary: "https://www.indiabudget.gov.in/doc/eb/stat22.pdf",
  budgetHighlights: "https://www.indiabudget.gov.in/doc/bh1.pdf",
  defencePension: "https://www.indiabudget.gov.in/doc/eb/sbe22.pdf",
  speculativeEt:
    "https://m.economictimes.com/wealth/save/8th-pay-commission-latest-news-today-how-salary-hike-hra-can-increase-for-level-1-10-employees-at-2-0-2-1-2-28-2-57-fitment-factors/articleshow/132307585.cms",
  speculativeToi:
    "https://timesofindia.indiatimes.com/business/india-business/8th-pay-commission-how-much-will-your-salary-pension-increase-check-for-fitment-factor-of-2-15-2-57-or-2-86/articleshow/126787040.cms",
  speculativeBajaj:
    "https://www.bajajfinserv.in/fitment-factor-8th-pay-commission",
};

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

function SourceLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition hover:text-teal-900"
    >
      {children}
    </a>
  );
}

SourceLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    teal: "border-teal-200 bg-teal-50 text-teal-800",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    rose: "border-rose-200 bg-rose-50 text-rose-800",
  };
  Badge.propTypes = {
    children: PropTypes.node.isRequired,
    tone: PropTypes.oneOf(["slate", "teal", "amber", "rose"]),
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Accordion({
  id,
  numberLabel,
  title,
  summary,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={`${id}-content`}
        className="flex w-full items-start gap-3 p-4 text-left sm:p-6"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
          {numberLabel}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-black tracking-tight text-slate-950 sm:text-xl">
            {title}
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            {summary}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`mt-1 text-xl text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ⌄
        </span>
      </button>

      {open && (
        <div
          id={`${id}-content`}
          className="border-t border-slate-100 px-4 pb-5 pt-5 sm:px-6 sm:pb-7"
        >
          {children}
        </div>
      )}
    </section>
  );
}
Accordion.propTypes = {
  id: PropTypes.string.isRequired,
  numberLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.node.isRequired,
  summary: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  defaultOpen: PropTypes.bool,
};

function Callout({ title, children, tone = "teal" }) {
  const tones = {
    teal: "border-teal-200 bg-teal-50/70 text-teal-950",
    amber: "border-amber-200 bg-amber-50/80 text-amber-950",
    rose: "border-rose-200 bg-rose-50/70 text-rose-950",
    slate: "border-slate-200 bg-slate-50 text-slate-900",
  };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${tones[tone]}`}>
      <p className="font-black">{title}</p>
      <div className="mt-2 text-sm leading-6">{children}</div>
    </div>
  );
}
Callout.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(["teal", "amber", "rose", "slate"]),
};

function FitmentExplainer() {
  const [basic, setBasic] = useState(44900);
  const [da, setDa] = useState(61);
  const [factor, setFactor] = useState(1.83);

  const result = useMemo(() => {
    const presentDa = basic * (da / 100);
    const presentComparable = basic + presentDa;
    const revisedBasic = basic * factor;
    const cashDifference = revisedBasic - presentComparable;
    const realIncrease = presentComparable
      ? (cashDifference / presentComparable) * 100
      : 0;

    return {
      presentDa,
      presentComparable,
      revisedBasic,
      cashDifference,
      realIncrease,
    };
  }, [basic, da, factor]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-base font-black text-slate-950">
            Fitment factor reality calculator
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Compare revised basic pay with the economically relevant baseline:
            existing basic plus DA.
          </p>
        </div>
        <Badge tone="amber">Illustration, not forecast</Badge>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-600">
            Current basic pay
          </span>
          <input
            type="number"
            min="0"
            step="100"
            value={basic}
            onChange={(event) => setBasic(Number(event.target.value) || 0)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-600">
            DA at transition
          </span>
          <div className="mt-2 flex items-center rounded-2xl border border-slate-300 bg-white px-4">
            <input
              type="number"
              min="0"
              max="200"
              step="1"
              value={da}
              onChange={(event) => setDa(Number(event.target.value) || 0)}
              className="w-full py-3 font-bold text-slate-950 outline-none"
            />
            <span className="font-bold text-slate-500">%</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-wide text-slate-600">
            Assumed fitment factor
          </span>
          <input
            type="number"
            min="1"
            max="4"
            step="0.01"
            value={factor}
            onChange={(event) => setFactor(Number(event.target.value) || 0)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultCard
          label="Existing DA"
          value={money.format(result.presentDa)}
        />
        <ResultCard
          label="Basic + DA baseline"
          value={money.format(result.presentComparable)}
        />
        <ResultCard
          label="Illustrative revised basic"
          value={money.format(result.revisedBasic)}
        />
        <ResultCard
          label="Real change over baseline"
          value={`${result.cashDifference >= 0 ? "+" : ""}${number.format(
            result.realIncrease,
          )}%`}
          emphasis
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        This deliberately excludes revised HRA, transport allowance, pension,
        NPS/UPS contributions and tax. Those components must be evaluated
        separately.
      </p>
    </div>
  );
}

function ResultCard({ label, value, emphasis = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        emphasis
          ? "border-teal-300 bg-teal-950 text-white"
          : "border-slate-200 bg-white text-slate-950"
      }`}
    >
      <p
        className={`text-[11px] font-black uppercase tracking-wide ${
          emphasis ? "text-teal-100" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}
ResultCard.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  emphasis: PropTypes.bool,
};

function ScenarioTable() {
  const [da, setDa] = useState(61);
  const factors = [1.75, 1.83, 1.92, 2, 2.28, 2.57, 2.86, 3];

  const rows = factors.map((factor) => ({
    factor,
    absorbed: 1 + da / 100,
    real: (factor / (1 + da / 100) - 1) * 100,
  }));

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-slate-950">What each factor implies</p>
          <p className="mt-1 text-sm text-slate-600">
            The result changes with DA at the transition date.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
          DA assumption
          <input
            type="number"
            min="0"
            max="200"
            value={da}
            onChange={(event) => setDa(Number(event.target.value) || 0)}
            className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-teal-600"
          />
          %
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Factor</th>
              <th className="px-4 py-3">DA absorption baseline</th>
              <th className="px-4 py-3">Implied real increase</th>
              <th className="px-4 py-3">Reading</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row) => {
              const reading =
                row.real < 10
                  ? "Low"
                  : row.real < 20
                    ? "Moderate"
                    : row.real < 35
                      ? "High"
                      : "Exceptional";
              return (
                <tr key={row.factor}>
                  <td className="px-4 py-3 font-black text-slate-950">
                    {row.factor.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {row.absorbed.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {row.real >= 0 ? "+" : ""}
                    {row.real.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      tone={
                        reading === "Exceptional"
                          ? "rose"
                          : reading === "High"
                            ? "amber"
                            : reading === "Moderate"
                              ? "teal"
                              : "slate"
                      }
                    >
                      {reading}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProcessStep({ numberLabel, title, children }) {
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-black text-white">
        {numberLabel}
      </span>
      <div className="pt-0.5">
        <p className="font-black text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{children}</p>
      </div>
    </li>
  );
}
ProcessStep.propTypes = {
  numberLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

function FactorCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{children}</p>
    </div>
  );
}
FactorCard.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

function EighthCPCRealityCheck() {
  const [allOpenHint, setAllOpenHint] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <article className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-5 py-8 text-white sm:px-8 sm:py-12">
            <div className="flex flex-wrap gap-2">
              <Badge tone="teal">8th CPC</Badge>
              <Badge tone="slate">
                Publicly available documents based explainer
              </Badge>
            </div>
            <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              8th Pay Commission: What can reasonably be expected - and what
              cannot
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
              A reality check on fitment-factor claims, minimum pay, allowances,
              pensions and the fiscal constraints behind a nationwide pay
              revision.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-8">
            <ResultCard label="Official fitment factor" value="Not decided" />
            <ResultCard label="Official minimum pay" value="Not decided" />
            <ResultCard
              label="Commission timeline"
              value="18 months"
              emphasis
            />
          </div>
        </header>

        <nav className="sticky top-3 z-20 mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
          <div className="flex min-w-max gap-1">
            {[
              ["opening", "Why speculation misleads"],
              ["official", "Official position"],
              ["fitment", "Fitment explained"],
              ["history", "6th to 7th CPC"],
              ["process", "Decision chain"],
              ["factors", "Key factors"],
              ["old-factors", "Old factors"],
              ["employee", "Your actual impact"],
              ["expectation", "Expectation range"],
              ["references", "References"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-xl px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Reading note:</strong> Sections are collapsed by default on
          smaller screens. Open only the part you need. Calculators in this
          article demonstrate the mathematics; they do not predict the
          Commission’s recommendations.
          <button
            type="button"
            className="ml-2 font-black underline underline-offset-4"
            onClick={() => setAllOpenHint((value) => !value)}
          >
            {allOpenHint ? "Hide note" : "Why this matters"}
          </button>
          {allOpenHint && (
            <p className="mt-2">
              CPC discussions mix official facts, employee demands, analyst
              assumptions and media projections. Treating all four as equivalent
              is the principal source of misinformation.
            </p>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <Accordion
            id="opening"
            numberLabel="1"
            title="Why 8th CPC speculation is misleading"
            summary="Public interest is legitimate; unsupported certainty is not."
            defaultOpen
          >
            <div className="space-y-5 text-[15px] leading-7 text-slate-700">
              <p>
                A Central Pay Commission directly affects the pay or pension of
                millions of households. It is therefore natural that employees
                search for an early indication of the likely increase. The
                problem begins when a scenario is presented as a likely decision
                without rational analysis.
              </p>

              <p>
                Recent articles have circulated calculations using factors such
                as 2.15, 2.28, 2.57 and 2.86, and some pages describe a broad
                “expected” range extending up to 2.86. Examples include reports
                by{" "}
                <SourceLink href={SOURCES.speculativeToi}>
                  Times of India
                </SourceLink>
                ,{" "}
                <SourceLink href={SOURCES.speculativeEt}>
                  The Economic Times
                </SourceLink>{" "}
                and{" "}
                <SourceLink href={SOURCES.speculativeBajaj}>
                  Bajaj Finserv
                </SourceLink>
                . These may be useful as hypothetical calculators, but none is
                an official determination of the 8th CPC.
              </p>

              <Callout title="The credibility test" tone="rose">
                A number is not reliable merely because it appears repeatedly.
                Ask whether the article identifies the official source,
                separates DA absorption from real increase, and explains how
                minimum pay was derived.
              </Callout>

              <p>
                This article does not attempt to create another sensational
                forecast. Its purpose is narrower: to explain the decision
                framework, show what the earlier transition actually involved,
                and keep expectations anchored to evidence.
              </p>
            </div>
          </Accordion>

          <Accordion
            id="official"
            numberLabel="2"
            title="What is known officially about the 8th CPC"
            summary="The Commission exists and has a broad mandate; the pay outcome remains open."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Callout title="Verified facts" tone="teal">
                <ul className="space-y-2">
                  <li>
                    The Commission was constituted through a Gazette Resolution
                    dated 3 November 2025.
                  </li>
                  <li>
                    It is chaired by Justice Ranjana Prakash Desai, with Prof.
                    Pulak Ghosh as part-time Member and Shri Pankaj Jain as
                    Member-Secretary.
                  </li>
                  <li>
                    It is to make recommendations within 18 months from its
                    constitution and may submit interim reports.
                  </li>
                </ul>
              </Callout>

              <Callout title="Not officially decided" tone="amber">
                <ul className="space-y-2">
                  <li>Minimum pay under the revised structure</li>
                  <li>Fitment factor</li>
                  <li>Revised pay matrix or level-wise entry pay</li>
                  <li>Rates of HRA and other allowances</li>
                  <li>
                    Final pension revision and implementation arrangements
                  </li>
                </ul>
              </Callout>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 p-4">
              <p className="font-black text-slate-950">Scope of examination</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The Terms of Reference cover pay, allowances, facilities,
                attraction and retention of talent, productivity, gratuity,
                pensions, economic conditions, fiscal prudence, developmental
                expenditure, State finances and comparison with CPSE and private
                sector compensation.
              </p>
              <p className="mt-3 text-sm">
                Official sources:{" "}
                <SourceLink href={SOURCES.eighthGazette}>
                  Gazette Resolution
                </SourceLink>{" "}
                ·{" "}
                <SourceLink href={SOURCES.eighthWebsite}>
                  8th CPC website
                </SourceLink>{" "}
                ·{" "}
                <SourceLink href={SOURCES.eighthTor}>
                  Terms of Reference
                </SourceLink>
              </p>
            </div>
          </Accordion>

          <Accordion
            id="fitment"
            numberLabel="3"
            title="The central misconception: fitment factor is not salary increase"
            summary="The multiplier absorbs accumulated DA before it produces any real increase."
          >
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <FactorCard title="Existing basic pay">
                  The pre-revised basic amount on which DA and several
                  allowances are calculated.
                </FactorCard>
                <FactorCard title="DA neutralisation">
                  Accumulated DA is folded into the revised pay structure. This
                  portion is not a fresh real gain.
                </FactorCard>
                <FactorCard title="Revised basic pay">
                  The new basic amount after applying the approved fixation
                  method and placement in the pay structure.
                </FactorCard>
              </div>

              <Callout
                title="Why 2.57 did not mean a 157% real increase"
                tone="slate"
              >
                The 7th CPC explained that 2.25 of the 2.57 factor represented
                neutralisation at a 125% DA assumption, while the remaining
                increase corresponded broadly to a 14.29% fitment benefit. The
                economically meaningful comparison was therefore revised basic
                pay versus existing basic plus DA—not revised basic versus basic
                alone.
              </Callout>

              <FitmentExplainer />

              <p className="text-sm leading-6 text-slate-600">
                Source: Chapter 4 of the{" "}
                <SourceLink href={SOURCES.seventhReport}>
                  7th CPC Report
                </SourceLink>
                .
              </p>
            </div>
          </Accordion>

          <Accordion
            id="history"
            numberLabel="4"
            title="What happened from the 6th CPC to the 7th CPC"
            summary="The previous transition is useful only when its components are separated correctly."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FactorCard title="6th CPC baseline">
                The implemented minimum basic pay was ₹7,000. The 6th CPC system
                used pay bands and grade pay, and DA subsequently accumulated
                under that structure.
              </FactorCard>
              <FactorCard title="DA before transition">
                The 7th CPC worked with an assumed DA neutralisation of 125% for
                fitment purposes.
              </FactorCard>
              <FactorCard title="Minimum-pay methodology">
                The Commission examined a need-based minimum wage using a
                normative consumption basket and additional provisions for
                housing, education, medical needs and other household expenses.
              </FactorCard>
              <FactorCard title="Resulting minimum pay">
                The recommended minimum pay became ₹18,000. Dividing ₹18,000 by
                ₹7,000 yielded approximately 2.57.
              </FactorCard>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-2 bg-slate-950 text-white">
                <div className="p-4 text-xs font-black uppercase tracking-wide">
                  Component
                </div>
                <div className="p-4 text-xs font-black uppercase tracking-wide">
                  Approximate effect
                </div>
              </div>
              {[
                ["DA neutralisation", "2.25 of the multiplier"],
                ["Additional fitment benefit", "About 14.29% over basic + DA"],
                ["Final common factor", "2.57"],
                ["Minimum pay", "₹18,000"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-2 border-t border-slate-100 bg-white"
                >
                  <div className="p-4 text-sm text-slate-600">{label}</div>
                  <div className="p-4 text-sm font-black text-slate-950">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Sources:{" "}
              <SourceLink href={SOURCES.sixthImplementation}>
                6th CPC implementation material
              </SourceLink>
              ,{" "}
              <SourceLink href={SOURCES.seventhReport}>
                7th CPC Report
              </SourceLink>{" "}
              and{" "}
              <SourceLink href={SOURCES.seventhDecision}>
                Cabinet decision on the 7th CPC
              </SourceLink>
              .
            </p>
          </Accordion>

          <Accordion
            id="process"
            numberLabel="5"
            title="How the 8th CPC is likely to determine revised pay"
            summary="The fitment factor is better understood as an output of the exercise, not its starting point."
          >
            <ol>
              <ProcessStep
                numberLabel="1"
                title="Determine minimum living requirements"
              >
                Select household norms, consumption units, prices and the extent
                to which essential expenditure is reflected in basic pay.
              </ProcessStep>
              <ProcessStep
                numberLabel="2"
                title="Calculate revised minimum pay"
              >
                Translate the chosen methodology into a defensible entry-level
                minimum.
              </ProcessStep>
              <ProcessStep numberLabel="3" title="Neutralise existing DA">
                Absorb the inflation compensation already payable under the 7th
                CPC structure.
              </ProcessStep>
              <ProcessStep
                numberLabel="4"
                title="Decide the additional real increase"
              >
                Determine what increase is justified beyond DA neutralisation.
              </ProcessStep>
              <ProcessStep
                numberLabel="5"
                title="Construct or revise the pay matrix"
              >
                Set level-wise entry pay, vertical progression, rationalisation
                indices and fixation rules.
              </ProcessStep>
              <ProcessStep
                numberLabel="6"
                title="Examine allowances and pensions"
              >
                Review HRA, transport, hardship allowances, gratuity, pension
                and service-specific requirements.
              </ProcessStep>
              <ProcessStep numberLabel="7" title="Assess fiscal impact">
                Test affordability against revenue receipts, committed
                expenditure, debt and the impact on State Governments.
              </ProcessStep>
            </ol>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard
                label="2026–27 salary provision"
                value="₹1.66 lakh cr"
              />
              <ResultCard label="Allowances provision" value="₹1.93 lakh cr" />
              <ResultCard label="Revenue receipts" value="₹35.33 lakh cr" />
              <ResultCard label="Debt / GDP" value="55.6%" emphasis />
            </div>

            <div className="mt-4 text-sm leading-6 text-slate-600">
              <p>
                The Union Budget 2026–27 provides approximately ₹1,65,635 crore
                for pay and ₹1,92,889 crore for allowances in the establishment
                statement. Together, these equal roughly 10.1% of estimated
                revenue receipts before adding pension expenditure. Defence
                pensions alone are budgeted at over ₹1.57 lakh crore. These are
                not arguments against revision; they show why affordability is a
                central part of the Commission’s mandate.
              </p>
              <br />
              <p>
                The fiscal assessment will also have to account for wider
                economic and structural pressures. Sustained currency
                depreciation can raise the domestic cost of imported energy,
                technology, defence equipment and other essential inputs, while
                global trade disruptions and geopolitical uncertainty may
                increase inflationary and budgetary risks. At the same time, the
                growing use of artificial intelligence and automation may alter
                employment patterns, skill requirements and wage expectations
                across both the public and private sectors. These factors may
                create competing pressures on the Government: to exercise fiscal
                restraint on the one hand, and to maintain purchasing power,
                attract skilled personnel and support aggregate demand on the
                other. The eventual approach may therefore need to balance
                affordability with a measured and accommodative revision of
                compensation.
              </p>

              <p className="mt-3">
                Sources:{" "}
                <SourceLink href={SOURCES.budgetSalary}>
                  Expenditure Profile, Statement 22
                </SourceLink>
                ,{" "}
                <SourceLink href={SOURCES.budgetGlance}>
                  Budget at a Glance 2026–27
                </SourceLink>
                ,{" "}
                <SourceLink href={SOURCES.budgetHighlights}>
                  Budget Highlights
                </SourceLink>{" "}
                and{" "}
                <SourceLink href={SOURCES.defencePension}>
                  Defence Pensions demand
                </SourceLink>
                .
              </p>
            </div>
          </Accordion>

          <Accordion
            id="factors"
            numberLabel="6"
            title="Factors that may influence the final recommendations"
            summary="A pay commission is simultaneously a wage, allowance, pension, personnel and fiscal exercise."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FactorCard title="Inflation and DA at transition">
                The higher the DA absorbed into the new structure, the higher
                the numerical multiplier may look even without a correspondingly
                large real gain.
              </FactorCard>
              <FactorCard title="Minimum-wage methodology">
                Household size, consumption units, nutrition norms, prices and
                the percentage added for non-food essentials can materially
                alter the minimum-pay outcome.
              </FactorCard>
              <FactorCard title="Housing, education, health and transport">
                These do not operate only through basic pay. The CPC also
                reviews HRA, transport and numerous other allowances, so the
                package must be assessed as a whole.
              </FactorCard>
              <FactorCard title="Existing anomalies">
                Bunching, level spacing, cadre parity, direct recruit–promotee
                differences, MACP and promotional fixation may require targeted
                correction.
              </FactorCard>
              <FactorCard title="Pension and gratuity liabilities">
                Revision affects current pensioners, future pension, family
                pension, gratuity and government contributions under applicable
                retirement systems.
              </FactorCard>
              <FactorCard title="Government revenue and fiscal capacity">
                The award must coexist with interest payments, capital
                expenditure, welfare commitments and the stated
                debt-consolidation path.
              </FactorCard>
              <FactorCard title="Impact on State Governments">
                States frequently adopt Central CPC structures with
                modifications. Their fiscal position is therefore expressly
                relevant to the Commission’s recommendations.
              </FactorCard>
            </div>
          </Accordion>

          <Accordion
            id="old-factors"
            numberLabel="7"
            title="Why old fitment factors cannot simply be repeated"
            summary="The same multiplier can imply a very different real increase at a different DA level."
          >
            <div className="space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
              <p>
                A fitment factor cannot be assessed in isolation. It performs at
                least two functions: first, it absorbs the Dearness Allowance
                already being paid under the existing pay structure; second, it
                provides an additional increase over and above that
                neutralisation. The higher the DA at the time of transition, the
                larger the factor required merely to preserve the employee’s
                existing basic pay plus DA.
              </p>

              <p>
                This is why the 7th CPC factor of 2.57 cannot be treated as a
                benchmark that must either be repeated or exceeded. At the time
                of the 7th CPC transition, the relevant DA component was much
                higher than the present illustrative baseline used below. A
                substantial part of 2.57 therefore represented absorption of
                accumulated DA, not a fresh increase in real pay.
              </p>

              <p>
                The correct comparison is not between the old and proposed
                multipliers. It is between the employee’s existing basic pay
                plus DA and the revised basic pay after fitment. Only the
                difference between these two figures indicates the immediate
                real increase arising from the pay revision.
              </p>
            </div>
            <br />
            <ScenarioTable />
            <br />
            <Callout title="How to read the table" tone="slate">
              The figures below assume a 60% DA baseline only for illustration.
              A factor of 1.60 would merely absorb existing DA and produce no
              additional increase over basic plus DA. Any amount above 1.60
              represents the real fitment benefit, subject to pay-matrix
              placement, rounding and subsequent changes in allowances.
            </Callout>
            <br />

            <Callout title="Interpretation" tone="amber">
              At a 60% DA baseline, a factor of 1.83 implies roughly a 14.4%
              increase over existing basic plus DA. A factor of 2.00 implies a
              25% increase. A factor of 2.57 would imply an increase of about
              60.6%, while 2.86 would imply nearly 78.8%. These are not minor
              variations in methodology; they represent fundamentally different
              levels of fiscal and real-pay enhancement.
            </Callout>
            <br />

            <Callout title="Why viral comparisons are misleading" tone="rose">
              Claims such as “the 7th CPC used 2.57, therefore the 8th CPC may
              use 2.86” usually omit the DA level, the minimum-pay calculation
              and the implied real increase. Without those three elements, the
              comparison has little analytical value. Repetition of a figure
              across multiple websites does not convert it into an official
              estimate or a historically grounded projection.
            </Callout>
            <br />

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <h4 className="font-bold text-slate-900">
                The more useful question
              </h4>
              <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
                Instead of asking whether the fitment factor will be 2.57, 2.86
                or 3.00, the more useful question is: what minimum pay will the
                Commission determine, how much DA will require neutralisation,
                and what additional real increase will be considered affordable
                and justified?
              </p>
            </div>
          </Accordion>

          {/* <Accordion
            id="employee"
            numberLabel="8"
            title="What an employee should actually examine"
            summary="Individual benefit will depend on fixation and deductions, not one multiplier alone."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Current basic pay", "The starting point for fixation."],
                [
                  "Revised pay level",
                  "Whether the corresponding level itself changes.",
                ],
                [
                  "Matrix placement",
                  "Equal or next-higher-cell treatment can alter the outcome.",
                ],
                [
                  "Rounding and bunching",
                  "Employees with different pre-revised pay may converge at one cell.",
                ],
                [
                  "HRA and allowances",
                  "Rates may be reset even as revised basic rises.",
                ],
                [
                  "NPS or UPS deductions",
                  "Higher basic pay can increase employee and employer contributions.",
                ],
                [
                  "Income tax",
                  "Gross increase is not the same as take-home increase.",
                ],
                [
                  "Promotion and increment date",
                  "Option and timing may affect fixation.",
                ],
                [
                  "Pension status",
                  "Serving employees and pensioners are not affected identically.",
                ],
              ].map(([title, text]) => (
                <FactorCard key={title} title={title}>
                  {text}
                </FactorCard>
              ))}
            </div>

            <Callout
              title="Do not multiply gross salary by a fitment factor"
              tone="rose"
            >
              A fitment factor ordinarily operates on the prescribed pay base,
              followed by matrix placement and separate treatment of allowances.
              Applying it to gross salary double-counts several components and
              creates a misleading result.
            </Callout>
          </Accordion> */}

          <Accordion
            id="expectation"
            numberLabel="8"
            title="Reasonable expectation range—not a prediction"
            summary="Use scenarios to understand scale, not to manufacture certainty."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Callout title="Conservative scenario" tone="slate">
                A modest real increase after full DA neutralisation, with
                greater emphasis on anomaly correction and selected allowances.
              </Callout>
              <Callout title="Broadly comparable with the 7th CPC" tone="teal">
                A real increase in the broad vicinity of the 7th CPC’s 14.29%,
                subject to a new minimum-pay calculation.
              </Callout>
              <Callout title="Moderately higher scenario" tone="amber">
                A stronger real increase justified by revised consumption norms,
                recruitment concerns or correction of pay compression.
              </Callout>
              <Callout title="Exceptional scenario" tone="rose">
                A very high multiplier would require either much higher DA at
                transition or an unusually large real award, with
                correspondingly significant fiscal consequences.
              </Callout>
            </div>

            <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white sm:p-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-300">
                The correct distinction
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="font-black">Mathematical illustration</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Shows what an assumed factor would imply.
                  </p>
                </div>
                <div>
                  <p className="font-black">Analytical range</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Frames plausible outcomes subject to stated assumptions.
                  </p>
                </div>
                <div>
                  <p className="font-black">Official forecast</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    None exists until the competent authority formally decides.
                  </p>
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion
            id="conclusion"
            numberLabel="9"
            title="Conclusion"
            summary="The credible answer today is conditional, not sensational."
          >
            <div className="space-y-4 text-[15px] leading-7 text-slate-700">
              <p>
                The 8th CPC will not merely choose an attractive multiplier and
                apply it uniformly to existing salaries. It will have to
                construct a coherent framework covering minimum pay, pay levels,
                annual progression, allowances, pension, gratuity and
                service-specific requirements. That exercise must also account
                for internal pay relativities, existing anomalies, recruitment
                and retention needs, the financial position of the Union
                Government and the likely impact on State Governments.
              </p>

              <p>
                The experience of the 6th and 7th CPCs shows that the headline
                fitment factor is only one part of the transition. A substantial
                portion of that factor may merely absorb the Dearness Allowance
                already being paid under the existing structure. The meaningful
                comparison is therefore between the employee&apos;s present
                basic pay plus DA and the revised basic pay after fitment—not
                between the old basic pay and a speculative multiplier.
              </p>

              <p>
                Even after a common fitment factor is announced, the actual
                financial benefit will not be identical for every employee. It
                will depend on the revised pay level, placement in the matrix,
                rounding to the next cell, treatment of bunching, HRA and other
                allowances, promotion or increment position, pension status, NPS
                or UPS deductions and income-tax liability. A single headline
                figure cannot accurately capture these differences.
              </p>

              <p>
                It is therefore reasonable to discuss possible scenarios,
                provided they are clearly identified as illustrations and are
                based on transparent assumptions about DA, minimum pay and the
                proposed real increase. It is not reasonable to present a
                fitment factor, minimum salary or employee-wise revised pay as
                settled merely because the same number has been repeated across
                multiple websites or social-media posts.
              </p>

              <Callout title="What can responsibly be said today" tone="slate">
                The 8th CPC is expected to examine the full compensation
                framework and recommend a revision based on evidence,
                affordability and policy considerations. The final outcome will
                emerge only after the Commission submits its recommendations and
                the Government examines and accepts, modifies or rejects them.
              </Callout>

              <Callout title="Bottom line" tone="teal">
                Until that process is complete, precise claims about minimum
                pay, fitment factor, revised pay matrix or employee-wise salary
                should be treated as scenarios—not official outcomes. The more
                credible approach is to examine the assumptions behind each
                estimate and ask how much of the proposed increase represents DA
                neutralisation and how much represents a genuine improvement in
                pay.
              </Callout>
            </div>
          </Accordion>

          <Accordion
            id="references"
            numberLabel="R"
            title="References and source documents"
            summary="Primary Government documents are used for the substantive analysis."
          >
            <ol className="space-y-4 text-sm leading-6 text-slate-700">
              {[
                [
                  "Gazette Resolution constituting the Eighth Central Pay Commission, 3 November 2025",
                  SOURCES.eighthGazette,
                ],
                [
                  "Official website of the Eighth Central Pay Commission",
                  SOURCES.eighthWebsite,
                ],
                [
                  "Terms of Reference of the Eighth Central Pay Commission",
                  SOURCES.eighthTor,
                ],
                [
                  "Report of the Seventh Central Pay Commission",
                  SOURCES.seventhReport,
                ],
                [
                  "Cabinet decisions on implementation of the Seventh CPC",
                  SOURCES.seventhDecision,
                ],
                [
                  "Implementation material relating to the Sixth CPC",
                  SOURCES.sixthImplementation,
                ],
                ["DA order effective from 1 January 2026", SOURCES.daOrder],
                [
                  "Union Budget 2026–27: Budget at a Glance",
                  SOURCES.budgetGlance,
                ],
                [
                  "Union Budget 2026–27: Establishment strength and salary provisions",
                  SOURCES.budgetSalary,
                ],
                [
                  "Union Budget 2026–27: Key Features",
                  SOURCES.budgetHighlights,
                ],
                [
                  "Union Budget 2026–27: Defence Pensions",
                  SOURCES.defencePension,
                ],
              ].map(([label, href], index) => (
                <li key={href} className="flex gap-3">
                  <span className="font-black text-slate-400">
                    {index + 1}.
                  </span>
                  <SourceLink href={href}>{label}</SourceLink>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
              Media links in the opening section are cited only as examples of
              circulating projections. They are not relied upon as authority for
              the substantive conclusions in this article.
            </div>
          </Accordion>
        </div>

        <footer className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm sm:p-6">
          <p className="font-black text-slate-950">Editorial disclosure</p>
          <p className="mt-2">
            This is an independent explanatory analysis based on publicly
            available official documents. It does not represent the views of the
            Government of India or the Eighth Central Pay Commission. Figures
            shown through interactive tools are illustrative and should not be
            treated as a salary or pension entitlement.
          </p>
        </footer>
      </article>
    </main>
  );
}

export default EighthCPCRealityCheck;
