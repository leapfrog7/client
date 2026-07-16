import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { FaArrowAltCircleDown } from "react-icons/fa";
import PageFeedback from "../components/PageFeedback";
import {
  FaArrowRight,
  FaChartLine,
  FaCoins,
  FaFileInvoiceDollar,
  FaHouse,
  FaLayerGroup,
  FaMoneyBillTransfer,
  FaPersonArrowUpFromLine,
  FaScaleBalanced,
  FaSackDollar,
  // FaShieldHalved,
  FaTableCellsLarge,
  FaUserClock,
  FaWallet,
  // FaBuilding,
  FaChartColumn,
  FaCity,
  FaGraduationCap,
  FaLandmark,
  FaMoneyBillTrendUp,
  FaPersonCircleQuestion,
  FaShieldHalved,
  FaSitemap,
  FaUsers,
  FaCalculator,
  FaCalendarDays,
  FaCircleCheck,
  FaIndianRupeeSign,
  FaUserGroup,
  FaArrowDown,
  FaBuildingColumns,
  FaPeopleGroup,
  FaGlobe,
} from "react-icons/fa6";

const ARTICLE_URL = "https://undersigned.in/pages/public/8th-CPC-reality-check";

const ARTICLE_TITLE =
  "8th CPC Salary Increase Explained: Fitment Factor and Realistic Expectations";

const ARTICLE_DESCRIPTION =
  "A fact-based analysis of the 8th Central Pay Commission covering fitment factor, DA neutralisation, minimum pay, pay matrix, allowances, pensions and fiscal constraints.";

function EighthCPCSeo() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ARTICLE_TITLE,
    description: ARTICLE_DESCRIPTION,
    url: ARTICLE_URL,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": ARTICLE_URL,
    },
    author: {
      "@type": "Organization",
      name: "Undersigned",
      url: "https://undersigned.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Undersigned",
      url: "https://undersigned.in",
    },
    inLanguage: "en-IN",
    articleSection: "Central Government Pay and Service Matters",
  };

  return (
    <Helmet>
      <title>{ARTICLE_TITLE}</title>

      <meta name="description" content={ARTICLE_DESCRIPTION} />

      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1"
      />

      <link rel="canonical" href={ARTICLE_URL} />

      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Undersigned" />
      <meta property="og:title" content={ARTICLE_TITLE} />
      <meta property="og:description" content={ARTICLE_DESCRIPTION} />
      <meta property="og:url" content={ARTICLE_URL} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={ARTICLE_TITLE} />
      <meta name="twitter:description" content={ARTICLE_DESCRIPTION} />

      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
    </Helmet>
  );
}

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
          <span className="block text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
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
          <FaArrowAltCircleDown />
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

function ProcessStep({ numberLabel, title, icon: Icon, children }) {
  return (
    <li className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
          {numberLabel}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon
                className="shrink-0 text-sm text-teal-700"
                aria-hidden="true"
              />
            )}
            <h4 className="font-extrabold text-slate-950">{title}</h4>
          </div>

          <div className="mt-2 text-sm leading-6 text-slate-600">
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}
ProcessStep.propTypes = {
  numberLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  title: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
};

function FactorCard({ title, icon: Icon, children, badge }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <Icon className="text-base" aria-hidden="true" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-bold leading-6 text-slate-900">{title}</h4>

            {badge && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                {badge}
              </span>
            )}
          </div>

          <div className="mt-1.5 text-sm leading-6 text-slate-600">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
FactorCard.propTypes = {
  title: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  badge: PropTypes.string,
};

function EighthCPCRealityCheck() {
  const [allOpenHint, setAllOpenHint] = useState(false);

  return (
    <>
      <EighthCPCSeo />
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <article className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <header className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-5 py-8 text-white sm:px-8 sm:py-12">
              <div className="flex flex-wrap gap-2">
                <Badge tone="teal">8th CPC</Badge>
                {/* <Badge tone="slate">
                Publicly available documents based explainer
              </Badge> */}
              </div>
              <h1 className=" mt-5 max-w-5xl text-2xl font-bold leading-tight tracking-tight sm:text-5xl">
                8th Pay Commission: What can reasonably be expected - and what
                cannot
              </h1>
              <p className="mt-5 max-w-5xl text-base leading-7 text-slate-200 sm:text-lg">
                A reality check on fitment-factor claims, minimum pay,
                allowances, pensions and the fiscal constraints behind a
                nationwide pay revision.
              </p>
            </div>

            {/* <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-8">
            <ResultCard label="Official fitment factor" value="Not decided" />
            <ResultCard label="Official minimum pay" value="Not decided" />
            <ResultCard
              label="Commission timeline"
              value="18 months"
              emphasis
            />
          </div> */}
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
                assumptions and media projections. Treating all four as
                equivalent is the principal source of misinformation.
              </p>
            )}
          </div>
          <br />
          <section
            aria-labelledby="introduction-heading"
            className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">
                Introduction
              </p>

              <h2
                id="introduction-heading"
                className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
              >
                Looking beyond the headline fitment factor
              </h2>
            </div>

            <div className="space-y-4 px-5 py-5 text-[15px] leading-7 text-slate-700 sm:px-6 sm:py-6 sm:text-base sm:leading-8">
              <p>
                The 8th Central Pay Commission has generated intense interest,
                but much of the public discussion has already moved ahead of the
                facts. Fitment factors, minimum pay and revised salaries are
                being projected with confidence even though the Commission must
                first examine a much wider set of questions concerning
                inflation, minimum living requirements, allowances, pensions,
                pay structure and fiscal affordability.
              </p>

              <p>
                This editorial examines what the transition from the 6th CPC to
                the 7th CPC actually tells us, why a fitment factor should not
                be confused with a salary increase, and which economic,
                administrative and fiscal considerations are likely to shape the
                8th CPC.
              </p>

              <div className="rounded-2xl border border-teal-100 bg-teal-50/70 px-4 py-3">
                <p className="font-semibold leading-7 text-slate-800">
                  The objective is not to predict an attractive number, but to
                  provide a reasoned framework for separating credible analysis
                  from speculation.
                </p>
              </div>
            </div>
          </section>

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
                  A Central Pay Commission directly affects the pay or pension
                  of millions of households. It is therefore natural that
                  employees search for an early indication of the likely
                  increase. The problem begins when a scenario is presented as a
                  likely decision without rational analysis.
                </p>

                <p>
                  Recent articles have circulated calculations using factors
                  such as 2.15, 2.28, 2.57 and 2.86, and some pages describe a
                  broad “expected” range extending up to 2.86. Examples include
                  reports by{" "}
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
                      The Commission was constituted through a Gazette
                      Resolution dated 3 November 2025.
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
                <p className="font-black text-slate-950">
                  Scope of examination
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The Terms of Reference cover pay, allowances, facilities,
                  attraction and retention of talent, productivity, gratuity,
                  pensions, economic conditions, fiscal prudence, developmental
                  expenditure, State finances and comparison with CPSE and
                  private sector compensation.
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
                    Accumulated DA is folded into the revised pay structure.
                    This portion is not a fresh real gain.
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
                  pay versus existing basic plus DA—not revised basic versus
                  basic alone.
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
              summary="The previous transition is useful only when minimum pay, DA absorption, real increase and structural reform are examined separately."
            >
              <div className="space-y-7">
                <div className="space-y-3 text-[15px] leading-7 text-slate-700">
                  <p>
                    The transition from the 6th CPC to the 7th CPC is the most
                    useful historical reference for understanding the possible
                    8th CPC exercise. However, it should not be reduced to the
                    statement that the earlier fitment factor was 2.57.
                  </p>

                  <p>
                    The 7th CPC simultaneously revised minimum pay, absorbed
                    accumulated Dearness Allowance, provided an additional real
                    increase and replaced the pay-band and grade-pay system with
                    a new pay matrix. Each component must be understood
                    separately.
                  </p>
                </div>

                {/* Transition flow */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">
                      The transition in four steps
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      How ₹7,000 became ₹18,000
                    </h3>
                  </div>

                  <div className="grid gap-3 md:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <FaIndianRupeeSign aria-hidden="true" />
                        </div>
                        <span className="text-xs font-black text-slate-400">
                          01
                        </span>
                      </div>

                      <h4 className="mt-4 font-extrabold text-slate-950">
                        Existing minimum pay
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        The minimum basic pay implemented under the 6th CPC was
                        ₹7,000 per month.
                      </p>
                    </div>

                    <div className="flex items-center justify-center md:hidden">
                      <FaArrowRight
                        className="rotate-90 text-slate-400"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                          <FaChartLine aria-hidden="true" />
                        </div>
                        <span className="text-xs font-black text-slate-400">
                          02
                        </span>
                      </div>

                      <h4 className="mt-4 font-extrabold text-slate-950">
                        DA accumulated
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Dearness Allowance accumulated under the 6th CPC
                        structure and had to be absorbed when revised basic pay
                        was determined.
                      </p>
                    </div>

                    <div className="flex items-center justify-center md:hidden">
                      <FaArrowRight
                        className="rotate-90 text-slate-400"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                          <FaCalculator aria-hidden="true" />
                        </div>
                        <span className="text-xs font-black text-slate-400">
                          03
                        </span>
                      </div>

                      <h4 className="mt-4 font-extrabold text-slate-950">
                        Minimum pay recalculated
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        The Commission applied a need-based methodology using a
                        normative consumption basket and additional provisions
                        for essential household expenditure.
                      </p>
                    </div>

                    <div className="flex items-center justify-center md:hidden">
                      <FaArrowRight
                        className="rotate-90 text-slate-400"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700">
                          <FaCoins aria-hidden="true" />
                        </div>
                        <span className="text-xs font-black text-teal-600">
                          04
                        </span>
                      </div>

                      <h4 className="mt-4 font-extrabold text-slate-950">
                        Revised minimum pay
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        The resulting minimum pay was fixed at ₹18,000. Dividing
                        ₹18,000 by ₹7,000 produced the common factor of
                        approximately 2.57.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 hidden items-center justify-center gap-4 text-slate-400 md:flex">
                    <span className="text-xs font-bold">₹7,000 minimum</span>
                    <FaArrowRight aria-hidden="true" />
                    <span className="text-xs font-bold">DA absorption</span>
                    <FaArrowRight aria-hidden="true" />
                    <span className="text-xs font-bold">
                      Minimum-wage assessment
                    </span>
                    <FaArrowRight aria-hidden="true" />
                    <span className="text-xs font-bold">₹18,000 minimum</span>
                  </div>
                </section>

                {/* Core components */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700">
                      What the factor actually contained
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      The 2.57 multiplier was not a 157% real increase
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FactorCard
                      title="6th CPC baseline"
                      icon={FaIndianRupeeSign}
                      badge="Starting point"
                    >
                      <div className="space-y-2">
                        <p>
                          The implemented minimum basic pay was ₹7,000. The
                          broader structure consisted of pay bands and grade pay
                          rather than the present level-based matrix.
                        </p>
                        <p>
                          DA was paid separately and increased periodically as
                          prices rose.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="DA neutralisation"
                      icon={FaChartLine}
                      badge="Absorption"
                    >
                      <div className="space-y-2">
                        <p>
                          For fitment purposes, the 7th CPC worked with an
                          assumed DA neutralisation of 125%, represented by a
                          factor of 2.25.
                        </p>
                        <p>
                          This portion largely preserved the employee&apos;s
                          existing basic pay plus accumulated DA. It was not an
                          entirely fresh increase.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Minimum-pay methodology"
                      icon={FaUserGroup}
                      badge="Need based"
                    >
                      <div className="space-y-2">
                        <p>
                          The Commission examined food and nutrition
                          requirements along with clothing, housing, fuel,
                          education, medical expenditure, recreation and other
                          household needs.
                        </p>
                        <p>
                          These assumptions led to a recommended minimum pay of
                          ₹18,000.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Additional real increase"
                      icon={FaCoins}
                      badge="Fresh benefit"
                    >
                      <div className="space-y-2">
                        <p>
                          After accounting for DA neutralisation, the additional
                          fitment benefit was approximately 14.29% over existing
                          basic pay plus DA.
                        </p>
                        <p>
                          This is the historically relevant comparison when
                          evaluating possible 8th CPC scenarios.
                        </p>
                      </div>
                    </FactorCard>
                  </div>
                </section>

                {/* Mobile-friendly composition table */}
                <section>
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-[1.25fr_1fr] bg-slate-950 text-white">
                      <div className="p-3 text-xs font-black uppercase tracking-wide sm:p-4">
                        Component
                      </div>
                      <div className="p-3 text-xs font-black uppercase tracking-wide sm:p-4">
                        Approximate result
                      </div>
                    </div>

                    {[
                      ["Implemented 6th CPC minimum pay", "₹7,000"],
                      ["DA neutralisation assumed", "125%"],
                      ["DA absorption component", "2.25"],
                      ["Additional fitment benefit", "About 14.29%"],
                      ["Final common fitment factor", "2.57"],
                      ["Recommended 7th CPC minimum pay", "₹18,000"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="grid grid-cols-[1.25fr_1fr] border-t border-slate-100 bg-white"
                      >
                        <div className="p-3 text-sm leading-6 text-slate-600 sm:p-4">
                          {label}
                        </div>
                        <div className="p-3 text-sm font-black leading-6 text-slate-950 sm:p-4">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <Callout title="The correct historical lesson" tone="amber">
                  The 7th CPC did not begin by selecting 2.57 because it
                  appeared generous. The factor emerged from the relationship
                  between the existing minimum pay of ₹7,000 and the revised
                  minimum pay of ₹18,000. Any meaningful 8th CPC estimate must
                  therefore begin with minimum-pay methodology, accumulated DA
                  and the intended real increase—not with an arbitrary
                  multiplier.
                </Callout>

                {/* Salient features */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700">
                      Salient features of the 7th CPC
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      The reform went far beyond minimum pay
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Several structural changes introduced by the 7th CPC
                      remain relevant when considering what the 8th CPC may
                      retain, revise or replace.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FactorCard
                      title="Introduction of the pay matrix"
                      icon={FaTableCellsLarge}
                      badge="Major reform"
                    >
                      Pay bands and grade pay were replaced by a single matrix
                      showing levels vertically and pay progression
                      horizontally. This made an employee&apos;s level, career
                      progression and current cell easier to identify.
                    </FactorCard>

                    <FactorCard
                      title="Merger of pay band and grade pay"
                      icon={FaLayerGroup}
                      badge="Simplification"
                    >
                      The revised basic pay became a single figure within the
                      relevant level. This removed the need to separately
                      combine pay in the pay band and grade pay for routine
                      fixation.
                    </FactorCard>

                    <FactorCard
                      title="Common fitment factor"
                      icon={FaCalculator}
                      badge="Transition"
                    >
                      A common factor of 2.57 was broadly applied to existing
                      basic pay, followed by placement at the equal or next
                      higher cell in the corresponding level.
                    </FactorCard>

                    <FactorCard
                      title="Level-specific rationalisation"
                      icon={FaScaleBalanced}
                      badge="Hierarchy"
                    >
                      Although 2.57 was the common fitment factor, higher
                      rationalisation indices were used at selected senior
                      levels to preserve hierarchy and reflect greater
                      responsibility.
                    </FactorCard>

                    <FactorCard
                      title="Approximately 3% annual progression"
                      icon={FaChartLine}
                      badge="Increment"
                    >
                      Successive cells within a level generally represented
                      approximately 3% progression. The annual increment
                      therefore operated through movement to the next cell in
                      the same level.
                    </FactorCard>

                    <FactorCard
                      title="Two increment dates"
                      icon={FaCalendarDays}
                      badge="Service rule"
                    >
                      The revised framework provided for increment dates on 1
                      January and 1 July, with eligibility depending on the
                      applicable period of service and fixation rules.
                    </FactorCard>

                    <FactorCard
                      title="Separate review of allowances"
                      icon={FaCoins}
                      badge="Compensation"
                    >
                      Basic pay was only one part of the exercise. HRA,
                      transport allowance, risk and hardship benefits and
                      numerous other allowances were reviewed separately.
                    </FactorCard>

                    <FactorCard
                      title="Bunching protection"
                      icon={FaUserGroup}
                      badge="Pay protection"
                    >
                      Additional increments could be granted in specified cases
                      where employees drawing different pre-revised pay were
                      placed at the same revised cell.
                    </FactorCard>

                    <FactorCard
                      title="Pension revision"
                      icon={FaCircleCheck}
                      badge="Retirement"
                    >
                      The recommendations also covered pension fixation, family
                      pension, gratuity and retirement benefits. The financial
                      impact therefore extended well beyond serving employees.
                    </FactorCard>
                  </div>
                </section>

                <Callout
                  title="Why these features matter for the 8th CPC"
                  tone="teal"
                >
                  The 8th CPC may retain the existing matrix, rebuild it with
                  revised cells and level spacing, or introduce targeted
                  structural changes. Employees should therefore watch not only
                  the minimum pay and fitment factor, but also the treatment of
                  levels, annual increments, promotion, bunching, allowances and
                  pension.
                </Callout>

                <p className="text-sm leading-6 text-slate-600">
                  Sources:{" "}
                  <SourceLink href={SOURCES.sixthImplementation}>
                    6th CPC implementation material
                  </SourceLink>
                  ,{" "}
                  <SourceLink href={SOURCES.seventhReport}>
                    7th CPC Report
                  </SourceLink>
                  ,{" "}
                  <SourceLink href={SOURCES.seventhDecision}>
                    Government decision on the 7th CPC
                  </SourceLink>{" "}
                  and the applicable 7th CPC pay-fixation rules and allowance
                  orders.
                </p>
              </div>
            </Accordion>

            <Accordion
              id="process"
              numberLabel="5"
              title="How the 8th CPC is likely to determine revised pay"
              summary="The fitment factor is likely to emerge from the minimum-pay, pay-structure and fiscal assessment—not be chosen in advance."
            >
              <div className="space-y-8">
                <div className="space-y-3 text-[15px] leading-7 text-slate-700">
                  <p>
                    A Pay Commission does not ordinarily begin by choosing a
                    fitment factor. It first examines what the minimum pay
                    should be, how accumulated Dearness Allowance should be
                    absorbed, how different pay levels should relate to one
                    another and what additional improvement can be supported.
                  </p>

                  <p>
                    The resulting recommendations must then be tested against
                    their recurring financial impact. This is important because
                    a pay revision affects not only current basic pay, but also
                    allowances, pension, gratuity, Government contributions and,
                    indirectly, the finances of State Governments.
                  </p>
                </div>

                <Callout title="The decision chain" tone="slate">
                  Minimum living requirements influence minimum pay. Minimum pay
                  influences the fitment methodology. The fitment methodology
                  influences the pay matrix, allowances and pension. The entire
                  package must then be tested for affordability and long-term
                  sustainability.
                </Callout>

                {/* Pay determination process */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">
                      Part I — Constructing the revised pay structure
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      From minimum living requirements to revised pay
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Each stage narrows the range of possible outcomes. The
                      fitment factor becomes meaningful only after these
                      underlying choices are made.
                    </p>
                  </div>

                  <ol className="space-y-3">
                    <ProcessStep
                      numberLabel="1"
                      title="Determine minimum living requirements"
                      icon={FaHouse}
                    >
                      The Commission may examine the normative household size,
                      consumption units, nutrition requirements and prevailing
                      prices. It must also decide how expenditure on clothing,
                      housing, fuel, education, healthcare, transport and other
                      essential needs should be recognised.
                    </ProcessStep>

                    <ProcessStep
                      numberLabel="2"
                      title="Calculate a revised minimum pay"
                      icon={FaCalculator}
                    >
                      The selected assumptions are converted into a defensible
                      entry-level minimum. This figure becomes an important
                      anchor for the wider pay structure because every higher
                      level must maintain reasonable differentials above it.
                    </ProcessStep>

                    <ProcessStep
                      numberLabel="3"
                      title="Neutralise accumulated Dearness Allowance"
                      icon={FaMoneyBillTrendUp}
                    >
                      DA already compensates employees for inflation under the
                      existing 7th CPC structure. When revised pay is
                      introduced, this accumulated DA is ordinarily absorbed
                      into basic pay so that employees do not lose their
                      existing level of compensation.
                    </ProcessStep>

                    <ProcessStep
                      numberLabel="4"
                      title="Decide the additional real increase"
                      icon={FaCoins}
                    >
                      After DA neutralisation, the Commission must determine
                      what genuine improvement in pay is justified. This may
                      reflect living costs, recruitment requirements,
                      productivity considerations, internal relativity and the
                      Government&apos;s capacity to sustain the increase.
                    </ProcessStep>

                    <ProcessStep
                      numberLabel="5"
                      title="Construct or revise the pay matrix"
                      icon={FaTableCellsLarge}
                    >
                      The Commission must translate the minimum pay and fitment
                      methodology into level-wise entry pay, cell progression,
                      rationalisation indices, increment rules and fixation
                      provisions. It may also address bunching, level spacing
                      and anomalies between different categories of employees.
                    </ProcessStep>

                    <ProcessStep
                      numberLabel="6"
                      title="Review allowances, pension and service-specific needs"
                      icon={FaWallet}
                    >
                      HRA, transport allowance, risk and hardship benefits,
                      gratuity, pension, family pension and retirement
                      contributions must be examined separately. Certain
                      services or technical posts may require targeted treatment
                      rather than a uniform increase.
                    </ProcessStep>

                    <ProcessStep
                      numberLabel="7"
                      title="Assess the total fiscal impact"
                      icon={FaScaleBalanced}
                    >
                      The full package must be tested against revenue receipts,
                      committed expenditure, interest payments, debt, capital
                      expenditure, welfare obligations and the likely financial
                      impact on State Governments.
                    </ProcessStep>
                  </ol>

                  <div className="mt-5 flex justify-center text-slate-400">
                    <FaArrowDown aria-hidden="true" />
                  </div>

                  <Callout
                    title="The fitment factor appears near the middle of the exercise"
                    tone="teal"
                  >
                    It is not the final measure of employee benefit. The
                    eventual outcome also depends on pay-matrix placement,
                    allowance rates, deductions, pension provisions and the
                    manner in which the Government implements the
                    recommendations.
                  </Callout>
                </section>

                {/* Fiscal context */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-700">
                      Part II — Testing affordability
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      Why the fiscal health of the Union and the States is a
                      major parameter
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      A pay revision becomes a recurring expenditure commitment.
                      Its effect continues through future increments,
                      allowances, pension revisions and retirement benefits.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <ResultCard
                      label="2026–27 salary provision"
                      value="₹1.66 lakh cr"
                    />
                    <ResultCard
                      label="Allowances provision"
                      value="₹1.93 lakh cr"
                    />
                    <ResultCard
                      label="Revenue receipts"
                      value="₹35.33 lakh cr"
                    />
                    <ResultCard
                      label="Central debt / GDP"
                      value="55.6%"
                      emphasis
                    />
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <FactorCard
                      title="The cost is recurring, not one-time"
                      icon={FaIndianRupeeSign}
                      badge="Union finances"
                    >
                      <div className="space-y-2">
                        <p>
                          Once revised pay is implemented, the higher
                          expenditure continues every year and grows further
                          through annual increments, promotions and additional
                          recruitment.
                        </p>
                        <p>
                          The initial arrears may be temporary, but the enhanced
                          salary, allowance and pension base becomes a lasting
                          fiscal commitment.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Pay competes with other public expenditure"
                      icon={FaBuildingColumns}
                      badge="Budget choices"
                    >
                      <div className="space-y-2">
                        <p>
                          Higher establishment expenditure must coexist with
                          defence, infrastructure, healthcare, education,
                          subsidies, welfare schemes and transfers to States.
                        </p>
                        <p>
                          A larger pay award may therefore reduce fiscal space
                          for other priorities unless it is supported by
                          stronger revenue growth or expenditure
                          reprioritisation.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Debt and interest payments reduce flexibility"
                      icon={FaFileInvoiceDollar}
                      badge="Committed cost"
                    >
                      <div className="space-y-2">
                        <p>
                          A significant part of Government expenditure is
                          already committed towards interest payments and other
                          unavoidable obligations.
                        </p>
                        <p>
                          Where debt and interest burdens remain high, even a
                          justified pay revision may need to be moderate, phased
                          or accompanied by limited arrears.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Pension multiplies the financial impact"
                      icon={FaWallet}
                      badge="Long-term liability"
                    >
                      <div className="space-y-2">
                        <p>
                          Revised basic pay can influence pension, family
                          pension, gratuity, leave encashment and Government
                          retirement contributions.
                        </p>
                        <p>
                          The financial impact therefore extends beyond serving
                          employees and may continue for several decades.
                        </p>
                      </div>
                    </FactorCard>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                        <FaLandmark aria-hidden="true" />
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-950">
                          The current Union Government expenditure base
                        </h4>

                        <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
                          <p>
                            The Union Budget 2026–27 provides approximately
                            ₹1,65,635 crore for pay and ₹1,92,889 crore for
                            allowances in the establishment statement. Together,
                            these amount to roughly 10.1% of estimated revenue
                            receipts, even before pension expenditure is added.
                            Defence pensions alone are budgeted at more than
                            ₹1.57 lakh crore.
                          </p>

                          <p>
                            These figures are not an argument against revision.
                            They demonstrate that even a modest percentage
                            increase produces a large recurring expenditure when
                            applied across employees, allowances and pensioners.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* State government impact */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700">
                      The State Government dimension
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      Why State finances matter even though it is a Central Pay
                      Commission
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FactorCard
                      title="States often follow the Central structure"
                      icon={FaCity}
                      badge="Spillover effect"
                    >
                      <div className="space-y-2">
                        <p>
                          The recommendations formally concern Central
                          Government employees. However, many States
                          subsequently adopt similar pay structures, often with
                          modifications.
                        </p>
                        <p>
                          A major increase at the Centre can therefore create an
                          expectation and eventual financial obligation across
                          State Governments.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="States have unequal fiscal capacity"
                      icon={FaChartLine}
                      badge="Affordability"
                    >
                      <div className="space-y-2">
                        <p>
                          States differ substantially in their own-tax revenue,
                          salary and pension burden, debt levels and dependence
                          on Central transfers.
                        </p>
                        <p>
                          A revision that is manageable for the Union Government
                          may be difficult for States with a large employee
                          base, high pension expenditure or limited revenue
                          mobilisation.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Development expenditure may be displaced"
                      icon={FaPeopleGroup}
                      badge="Opportunity cost"
                    >
                      <div className="space-y-2">
                        <p>
                          Where State revenue is limited, higher salary and
                          pension expenditure may reduce the funds available for
                          health, education, roads, local bodies and other
                          development programmes.
                        </p>
                        <p>
                          This is why the wider fiscal impact is expressly
                          relevant to the Commission&apos;s assessment.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Implementation may vary across States"
                      icon={FaCalculator}
                      badge="Different outcomes"
                    >
                      <div className="space-y-2">
                        <p>
                          States may alter the effective date, defer arrears,
                          revise the fitment approach or modify allowances
                          according to their financial position.
                        </p>
                        <p>
                          The Central recommendation should therefore not be
                          treated as an automatic or identical outcome for every
                          State employee.
                        </p>
                      </div>
                    </FactorCard>
                  </div>
                  <br></br>
                  <Callout
                    title="Why the Commission cannot ignore State finances"
                    tone="amber"
                  >
                    The Central award creates a national benchmark. Even where
                    States are not legally bound to adopt it, employee
                    expectations and administrative parity pressures make the
                    recommendations fiscally significant beyond the Union
                    Government alone.
                  </Callout>
                </section>

                {/* Wider economic context */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet-700">
                      Wider economic and global considerations
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      Factors that may pull the Government in opposite
                      directions
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FactorCard
                      title="Currency depreciation and imported inflation"
                      icon={FaGlobe}
                      badge="Cost pressure"
                    >
                      Sustained depreciation can raise the domestic cost of
                      imported energy, technology, defence equipment and other
                      essential inputs. This can increase both household
                      inflation and Government expenditure, strengthening the
                      case for protecting purchasing power while simultaneously
                      reducing fiscal room.
                    </FactorCard>

                    <FactorCard
                      title="AI, automation and changing skill requirements"
                      icon={FaChartLine}
                      badge="Workforce change"
                    >
                      Artificial intelligence may alter job roles, productivity
                      expectations and the demand for specialised skills. The
                      Government may need to remain competitive in recruiting
                      technical and analytical personnel, while also
                      reconsidering workforce size, training and role design.
                    </FactorCard>

                    <FactorCard
                      title="Global uncertainty"
                      icon={FaScaleBalanced}
                      badge="Budget risk"
                    >
                      Trade disruption, geopolitical tensions, commodity-price
                      shocks and slower global growth can affect inflation, tax
                      revenue and public expenditure. These risks may require
                      prudence even where employee compensation needs revision.
                    </FactorCard>

                    <FactorCard
                      title="Purchasing power and domestic demand"
                      icon={FaMoneyBillTrendUp}
                      badge="Accommodative case"
                    >
                      A measured pay revision can support household purchasing
                      power, employee morale and aggregate demand. The
                      Government may therefore seek a balanced outcome that is
                      neither fiscally excessive nor insufficient to maintain
                      the real value of compensation.
                    </FactorCard>
                  </div>
                </section>

                <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 sm:p-5">
                  <h4 className="font-extrabold text-slate-950">
                    How fiscal conditions may affect the final implementation
                  </h4>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        title: "Size of the increase",
                        text: "A stronger fiscal position may permit a higher real increase.",
                      },
                      {
                        title: "Timing",
                        text: "Implementation may be immediate, deferred or phased.",
                      },
                      {
                        title: "Arrears",
                        text: "Arrears may be paid fully, staggered or limited.",
                      },
                      {
                        title: "Allowances",
                        text: "Allowances may be revised separately or from a later date.",
                      },
                    ].map(({ title, text }) => (
                      <div
                        key={title}
                        className="rounded-xl border border-teal-100 bg-white p-4"
                      >
                        <p className="text-sm font-extrabold text-slate-950">
                          {title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Callout
                  title="The fiscal test does not determine whether revision is needed"
                  tone="teal"
                >
                  It helps determine how large the revision can be, how quickly
                  it can be implemented and how the burden should be distributed
                  between basic pay, allowances, pension and arrears.
                  Affordability therefore shapes the form of the award, not
                  merely the headline fitment factor.
                </Callout>

                <p className="text-sm leading-6 text-slate-600">
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
              summary="The Commission must balance employee needs, pay-structure reform, pension obligations and fiscal affordability."
            >
              <div className="space-y-7">
                <div className="space-y-3 text-[15px] leading-7 text-slate-700">
                  <p>
                    A Central Pay Commission does considerably more than
                    recommend a new basic salary. It reviews the complete
                    compensation framework, including minimum pay, pay levels,
                    increments, allowances, pension, gratuity and
                    service-specific requirements.
                  </p>

                  <p>
                    The final recommendation will therefore emerge from several
                    connected assessments. Some factors may support a higher
                    revision, while others may require moderation, restructuring
                    or targeted benefits instead of a large uniform increase.
                  </p>
                </div>

                <Callout
                  title="Why the factors must be considered together"
                  tone="slate"
                >
                  A higher minimum pay may improve the position of lower-paid
                  employees but also affect every level of the pay matrix,
                  allowances linked to basic pay, pension liabilities and State
                  Government finances. The Commission must therefore evaluate
                  the combined financial and administrative impact.
                </Callout>

                {/* Employee cost and purchasing-power factors */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">
                      Employee and household considerations
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      What level of compensation is reasonably required?
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      These factors influence minimum pay, purchasing-power
                      protection and the design of allowances.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FactorCard
                      title="Inflation and DA at transition"
                      icon={FaMoneyBillTrendUp}
                      badge="Pay transition"
                    >
                      <div className="space-y-2">
                        <p>
                          Dearness Allowance compensates employees for inflation
                          under the existing pay structure. When a new CPC is
                          implemented, the accumulated DA is generally absorbed
                          into revised basic pay.
                        </p>
                        <p>
                          A higher DA at the transition date can therefore
                          produce a larger numerical fitment factor even when
                          the additional real increase remains moderate. The DA
                          component and the fresh benefit must be examined
                          separately.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Minimum-pay methodology"
                      icon={FaUsers}
                      badge="Foundation"
                    >
                      <div className="space-y-2">
                        <p>
                          Minimum pay may be influenced by the assumed household
                          size, number of consumption units, nutrition
                          requirements and prices of essential goods and
                          services.
                        </p>
                        <p>
                          The percentage allowed for clothing, housing, fuel,
                          education, healthcare, recreation and other non-food
                          needs can materially change the resulting minimum wage
                          and, consequently, the entire pay structure.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Housing costs"
                      icon={FaHouse}
                      badge="Allowance"
                    >
                      <div className="space-y-2">
                        <p>
                          Housing expenditure varies sharply across cities and
                          regions. A single national minimum pay cannot fully
                          reflect the difference between the cost of
                          accommodation in a metropolitan city and a smaller
                          station.
                        </p>
                        <p>
                          The Commission may therefore address housing costs
                          through a combination of basic pay, HRA rates, city
                          classification and Government accommodation policy.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Education, health and transport"
                      icon={FaGraduationCap}
                      badge="Allowances"
                    >
                      <div className="space-y-2">
                        <p>
                          These expenses do not operate only through basic pay.
                          The CPC also examines Children Education Allowance,
                          transport-related benefits, medical facilities and
                          other reimbursements or allowances.
                        </p>
                        <p>
                          A moderate increase in basic pay may therefore be
                          accompanied by targeted revision of allowances where
                          the underlying expenditure has risen faster than
                          general inflation.
                        </p>
                      </div>
                    </FactorCard>
                  </div>
                </section>

                {/* Pay structure and personnel factors */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-sky-700">
                      Pay structure and personnel management
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      How should pay be distributed across levels and services?
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      The Commission must preserve internal fairness while
                      correcting anomalies and maintaining the Government&apos;s
                      ability to recruit and retain suitable personnel.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FactorCard
                      title="Existing pay anomalies"
                      icon={FaScaleBalanced}
                      badge="Correction"
                    >
                      <div className="space-y-2">
                        <p>
                          The Commission may receive representations concerning
                          bunching, insufficient spacing between levels, cadre
                          parity, direct recruit–promotee differences and
                          inconsistencies in pay fixation.
                        </p>
                        <p>
                          Some anomalies may require level-specific correction
                          rather than a common fitment factor for all employees.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Promotion, MACP and career progression"
                      icon={FaChartLine}
                      badge="Career"
                    >
                      <div className="space-y-2">
                        <p>
                          The financial distinction between promotion, annual
                          increment and MACP must remain meaningful. Weak
                          differentiation can reduce the value of promotion or
                          create pay inversion between senior and junior
                          employees.
                        </p>
                        <p>
                          The Commission may therefore review increment rates,
                          promotional fixation, stagnation and the spacing
                          between successive pay levels.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Recruitment and retention"
                      icon={FaPersonCircleQuestion}
                      badge="Workforce"
                    >
                      <div className="space-y-2">
                        <p>
                          Government compensation must remain sufficient to
                          attract and retain employees in technical, scientific,
                          medical, regulatory and other specialised roles.
                        </p>
                        <p>
                          Where private-sector pay is significantly higher, the
                          Commission may prefer targeted incentives, special pay
                          or allowances rather than an exceptionally high
                          increase for every post.
                        </p>
                      </div>
                    </FactorCard>

                    {/* <FactorCard
                    title="Comparison with CPSEs and the private sector"
                    icon={FaBuilding}
                    badge="Benchmarking"
                  >
                    <div className="space-y-2">
                      <p>
                        Pay comparisons must include more than monthly cash
                        salary. Government employment also includes job
                        security, pension or retirement contributions, leave,
                        medical benefits and structured career progression.
                      </p>
                      <p>
                        The relevant question is whether total compensation
                        remains competitive for the skills and responsibilities
                        required, not whether every Government post matches the
                        highest private-sector salary.
                      </p>
                    </div>
                  </FactorCard> */}

                    <FactorCard
                      title="Pay hierarchy and level spacing"
                      icon={FaSitemap}
                      badge="Relativity"
                    >
                      <div className="space-y-2">
                        <p>
                          A large increase at the minimum level can compress
                          differences between junior, supervisory and senior
                          posts unless corresponding adjustments are made higher
                          in the matrix.
                        </p>
                        <p>
                          The Commission must preserve reasonable pay
                          differentials based on responsibility, qualification,
                          risk and decision-making authority.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Service-specific requirements"
                      icon={FaShieldHalved}
                      badge="Targeted treatment"
                    >
                      <div className="space-y-2">
                        <p>
                          Defence personnel, CAPFs, scientists, doctors,
                          technical cadres and employees serving in difficult
                          locations may have distinct working conditions and
                          retention challenges.
                        </p>
                        <p>
                          Their concerns may be addressed through separate pay
                          levels, risk-and-hardship allowances, special
                          incentives or other service-specific provisions.
                        </p>
                      </div>
                    </FactorCard>
                  </div>
                </section>

                {/* Fiscal and pension factors */}
                <section>
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-amber-700">
                      Pension and fiscal considerations
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold text-slate-950">
                      What can be sustained over the long term?
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      A pay revision creates recurring expenditure, not merely a
                      one-time implementation cost.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FactorCard
                      title="Pension and gratuity liabilities"
                      icon={FaWallet}
                      badge="Long-term cost"
                    >
                      <div className="space-y-2">
                        <p>
                          Revised basic pay can affect pension, family pension,
                          gratuity, leave encashment and other retirement
                          benefits. The impact extends to existing pensioners as
                          well as employees who retire under the revised
                          structure.
                        </p>
                        <p>
                          The Commission must also consider the different
                          financial effects of the old pension system, NPS and
                          UPS.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Government revenue and fiscal capacity"
                      icon={FaLandmark}
                      badge="Affordability"
                    >
                      <div className="space-y-2">
                        <p>
                          Additional pay and pension expenditure must coexist
                          with interest payments, defence requirements, welfare
                          schemes, infrastructure investment and other public
                          commitments.
                        </p>
                        <p>
                          Strong revenue growth may create room for a more
                          accommodative revision, while a high deficit or debt
                          burden may favour a moderate award or phased
                          implementation.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Impact on State Governments"
                      icon={FaCity}
                      badge="Wider impact"
                    >
                      <div className="space-y-2">
                        <p>
                          Central CPC recommendations formally apply to Central
                          Government employees, but many States later adopt
                          similar structures with modifications.
                        </p>
                        <p>
                          A large Central award can therefore create substantial
                          salary and pension pressure for States with very
                          different revenue capacity and debt positions.
                        </p>
                      </div>
                    </FactorCard>

                    <FactorCard
                      title="Implementation and arrears"
                      icon={FaChartColumn}
                      badge="Cash flow"
                    >
                      <div className="space-y-2">
                        <p>
                          Even where recommendations take effect from an earlier
                          date, the Government may manage the immediate
                          financial burden through phased arrears, delayed
                          allowance revision or staggered implementation.
                        </p>
                        <p>
                          The effective date and the date of actual payment may
                          therefore differ.
                        </p>
                      </div>
                    </FactorCard>
                  </div>
                </section>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <h4 className="font-extrabold text-slate-950">
                    How these factors may shape the final package
                  </h4>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Universal changes
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Revised minimum pay, fitment methodology, pay matrix and
                        common increment rules.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Targeted changes
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Level upgrades, anomaly correction, hardship benefits
                        and specialised-role incentives.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Fiscal adjustments
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Phased implementation, separate allowance orders or
                        controlled payment of arrears.
                      </p>
                    </div>
                  </div>
                </div>

                <Callout
                  title="The likely outcome is a package, not one number"
                  tone="teal"
                >
                  The final recommendations may combine a common fitment
                  methodology with revised allowances, level-specific
                  corrections, pension provisions and phased implementation.
                  Judging the entire exercise only by the headline fitment
                  factor would therefore give an incomplete picture.
                </Callout>
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
                  A fitment factor cannot be assessed in isolation. It performs
                  at least two functions: first, it absorbs the Dearness
                  Allowance already being paid under the existing pay structure;
                  second, it provides an additional increase over and above that
                  neutralisation. The higher the DA at the time of transition,
                  the larger the factor required merely to preserve the
                  employee’s existing basic pay plus DA.
                </p>

                <p>
                  This is why the 7th CPC factor of 2.57 cannot be treated as a
                  benchmark that must either be repeated or exceeded. At the
                  time of the 7th CPC transition, the relevant DA component was
                  much higher than the present illustrative baseline used below.
                  A substantial part of 2.57 therefore represented absorption of
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
                The figures below assume a 60% DA baseline only for
                illustration. A factor of 1.60 would merely absorb existing DA
                and produce no additional increase over basic plus DA. Any
                amount above 1.60 represents the real fitment benefit, subject
                to pay-matrix placement, rounding and subsequent changes in
                allowances.
              </Callout>
              <br />

              <Callout title="Interpretation" tone="amber">
                At a 60% DA baseline, a factor of 1.83 implies roughly a 14.4%
                increase over existing basic plus DA. A factor of 2.00 implies a
                25% increase. A factor of 2.57 would imply an increase of about
                60.6%, while 2.86 would imply nearly 78.8%. These are not minor
                variations in methodology; they represent fundamentally
                different levels of fiscal and real-pay enhancement.
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
                  Instead of asking whether the fitment factor will be 2.57,
                  2.86 or 3.00, the more useful question is: what minimum pay
                  will the Commission determine, how much DA will require
                  neutralisation, and what additional real increase will be
                  considered affordable and justified?
                </p>
              </div>
            </Accordion>

            <Accordion
              id="employee"
              numberLabel="8"
              title="What an employee should actually examine"
              summary="Your final benefit will emerge in stages: revised basic pay, revised gross salary and, finally, take-home pay."
            >
              <div className="space-y-6">
                <div className="space-y-3 text-[15px] leading-7 text-slate-700">
                  <p>
                    A fitment factor does not directly tell an employee how much
                    money will be credited to the bank account. It generally
                    helps determine the revised basic pay. After that, the
                    employee must be placed in the revised pay structure,
                    applicable allowances must be recalculated and deductions
                    must be applied.
                  </p>

                  <p>
                    The calculation should therefore be understood in three
                    separate stages. Mixing these stages is one of the main
                    reasons that online salary estimates appear much larger than
                    the likely increase in take-home pay.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                        <FaTableCellsLarge aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                          Stage 1
                        </p>
                        <h4 className="font-bold text-slate-950">
                          Revised basic pay
                        </h4>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      Existing basic pay is fitted into the revised structure
                      through the prescribed formula and pay-matrix rules.
                    </p>
                  </div>

                  <div className="flex items-center justify-center sm:hidden">
                    <FaArrowRight
                      className="rotate-90 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                        <FaSackDollar aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-sky-700">
                          Stage 2
                        </p>
                        <h4 className="font-bold text-slate-950">
                          Revised gross salary
                        </h4>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      HRA, transport allowance and other admissible components
                      are added separately using their revised rates.
                    </p>
                  </div>

                  <div className="flex items-center justify-center sm:hidden">
                    <FaArrowRight
                      className="rotate-90 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                        <FaWallet aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                          Stage 3
                        </p>
                        <h4 className="font-bold text-slate-950">
                          Revised take-home pay
                        </h4>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      NPS or UPS contributions, tax, CGHS contribution and other
                      deductions are then subtracted from gross salary.
                    </p>
                  </div>
                </div>

                <div className="hidden items-center justify-center gap-3 text-slate-400 sm:flex">
                  <span className="text-xs font-semibold">Basic pay</span>
                  <FaArrowRight aria-hidden="true" />
                  <span className="text-xs font-semibold">Gross salary</span>
                  <FaArrowRight aria-hidden="true" />
                  <span className="text-xs font-semibold">Take-home pay</span>
                </div>

                <div>
                  <div className="mb-3">
                    <h3 className="text-base font-extrabold text-slate-950">
                      Factors that can change the individual outcome
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Two employees with similar current salaries may receive
                      different benefits because their levels, increment dates
                      and deductions may not be identical.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <FactorCard
                      title="Current basic pay"
                      icon={FaCoins}
                      badge="Starting point"
                    >
                      The fixation calculation ordinarily begins with existing
                      basic pay, not gross salary. DA, HRA and most other
                      allowances are not multiplied again as though they were
                      part of basic pay.
                    </FactorCard>

                    <FactorCard
                      title="Corresponding pay level"
                      icon={FaLayerGroup}
                      badge="Structure"
                    >
                      The employee must be mapped to the appropriate level in
                      the revised pay structure. A level may be retained,
                      upgraded, merged or otherwise modified by the Commission
                      or Government.
                    </FactorCard>

                    <FactorCard
                      title="Placement in the matrix"
                      icon={FaTableCellsLarge}
                      badge="Fixation"
                    >
                      The calculated amount may not exactly match a matrix cell.
                      The employee may be placed at the equal or next-higher
                      cell according to the prescribed fixation rule.
                    </FactorCard>

                    <FactorCard
                      title="Rounding and bunching"
                      icon={FaScaleBalanced}
                      badge="Anomaly"
                    >
                      Employees drawing different pre-revised pay may reach the
                      same revised cell. Bunching relief, if provided, can
                      preserve a reasonable difference between junior and senior
                      employees.
                    </FactorCard>

                    <FactorCard
                      title="Promotion and increment date"
                      icon={FaPersonArrowUpFromLine}
                      badge="Timing"
                    >
                      An employee close to promotion or annual increment may
                      have fixation options. The chosen date can affect revised
                      pay immediately and in later years.
                    </FactorCard>

                    <FactorCard
                      title="HRA and other allowances"
                      icon={FaHouse}
                      badge="Gross salary"
                    >
                      Allowance rates may be revised, rationalised or reset
                      after basic pay increases. A higher basic pay does not
                      necessarily mean every allowance will rise in the same
                      proportion.
                    </FactorCard>

                    <FactorCard
                      title="NPS or UPS contribution"
                      icon={FaMoneyBillTransfer}
                      badge="Deduction"
                    >
                      Contributions linked to basic pay and DA may rise with the
                      revised pay structure. This builds retirement benefits but
                      reduces the immediate increase visible in monthly
                      take-home salary.
                    </FactorCard>

                    <FactorCard
                      title="Income tax"
                      icon={FaFileInvoiceDollar}
                      badge="Deduction"
                    >
                      A higher gross income may increase tax liability or move
                      part of the income into a higher effective tax range.
                      Gross increase and net increase are therefore not the
                      same.
                    </FactorCard>

                    <FactorCard
                      title="Serving or pensioner status"
                      icon={FaUserClock}
                      badge="Different rules"
                    >
                      Serving employees, existing pensioners, family pensioners
                      and future retirees may be covered by different fixation,
                      pension revision and gratuity provisions.
                    </FactorCard>
                  </div>
                </div>

                <Callout
                  title="Do not multiply gross salary by the fitment factor"
                  tone="rose"
                >
                  <div className="space-y-2">
                    <p>
                      A fitment factor ordinarily operates on the prescribed
                      existing pay base. HRA, transport allowance, DA and other
                      components are then dealt with separately.
                    </p>
                    <p>
                      Applying the factor to the entire gross salary can
                      multiply allowances that are supposed to be recalculated
                      independently. This double-counting produces an inflated
                      and misleading estimate.
                    </p>
                  </div>
                </Callout>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                      <FaChartLine aria-hidden="true" />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-950">
                        A better way to estimate the impact
                      </h4>

                      <ol className="mt-3 space-y-3 text-sm leading-6 text-slate-700">
                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            1
                          </span>
                          <span>
                            Note the current basic pay, pay level and next
                            increment or promotion date.
                          </span>
                        </li>

                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            2
                          </span>
                          <span>
                            Apply the officially prescribed fitment method only
                            after it is announced.
                          </span>
                        </li>

                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            3
                          </span>
                          <span>
                            Place the resulting amount in the applicable revised
                            matrix and account for rounding or bunching rules.
                          </span>
                        </li>

                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            4
                          </span>
                          <span>
                            Recalculate HRA, transport allowance and other
                            admissible components separately.
                          </span>
                        </li>

                        <li className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                            5
                          </span>
                          <span>
                            Subtract NPS or UPS contribution, tax and other
                            deductions to estimate the actual take-home
                            increase.
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <Callout title="The number that matters most" tone="teal">
                  For household budgeting, the most useful figure is not the
                  fitment factor or even the revised basic pay. It is the
                  increase in monthly take-home pay after revised allowances,
                  contributions and tax are taken into account.
                </Callout>
              </div>
            </Accordion>

            <Accordion
              id="expectation"
              numberLabel="9"
              title="Reasonable expectation range—not a prediction"
              summary="Use scenarios to understand scale, not to manufacture certainty."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Callout title="Conservative scenario" tone="slate">
                  A modest real increase after full DA neutralisation, with
                  greater emphasis on anomaly correction and selected
                  allowances.
                </Callout>
                <Callout
                  title="Broadly comparable with the 7th CPC"
                  tone="teal"
                >
                  A real increase in the broad vicinity of the 7th CPC’s 14.29%,
                  subject to a new minimum-pay calculation.
                </Callout>
                <Callout title="Moderately higher scenario" tone="amber">
                  A stronger real increase justified by revised consumption
                  norms, recruitment concerns or correction of pay compression.
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
                      None exists until the competent authority formally
                      decides.
                    </p>
                  </div>
                </div>
              </div>
            </Accordion>

            <Accordion
              id="conclusion"
              numberLabel="10"
              title="Conclusion"
              summary="The credible answer today is conditional, not sensational."
            >
              <div className="space-y-4 text-[15px] leading-7 text-slate-700">
                <p>
                  The 8th CPC will not merely choose an attractive multiplier
                  and apply it uniformly to existing salaries. It will have to
                  construct a coherent framework covering minimum pay, pay
                  levels, annual progression, allowances, pension, gratuity and
                  service-specific requirements. That exercise must also account
                  for internal pay relativities, existing anomalies, recruitment
                  and retention needs, the financial position of the Union
                  Government and the likely impact on State Governments.
                </p>

                <p>
                  The experience of the 6th and 7th CPCs shows that the headline
                  fitment factor is only one part of the transition. A
                  substantial portion of that factor may merely absorb the
                  Dearness Allowance already being paid under the existing
                  structure. The meaningful comparison is therefore between the
                  employee&apos;s present basic pay plus DA and the revised
                  basic pay after fitment—not between the old basic pay and a
                  speculative multiplier.
                </p>

                <p>
                  Even after a common fitment factor is announced, the actual
                  financial benefit will not be identical for every employee. It
                  will depend on the revised pay level, placement in the matrix,
                  rounding to the next cell, treatment of bunching, HRA and
                  other allowances, promotion or increment position, pension
                  status, NPS or UPS deductions and income-tax liability. A
                  single headline figure cannot accurately capture these
                  differences.
                </p>

                <p>
                  It is therefore reasonable to discuss possible scenarios,
                  provided they are clearly identified as illustrations and are
                  based on transparent assumptions about DA, minimum pay and the
                  proposed real increase. It is not reasonable to present a
                  fitment factor, minimum salary or employee-wise revised pay as
                  settled merely because the same number has been repeated
                  across multiple websites or social-media posts.
                </p>

                <Callout
                  title="What can responsibly be said today"
                  tone="slate"
                >
                  The 8th CPC is expected to examine the full compensation
                  framework and recommend a revision based on evidence,
                  affordability and policy considerations. The final outcome
                  will emerge only after the Commission submits its
                  recommendations and the Government examines and accepts,
                  modifies or rejects them.
                </Callout>

                <Callout title="Bottom line" tone="teal">
                  Until that process is complete, precise claims about minimum
                  pay, fitment factor, revised pay matrix or employee-wise
                  salary should be treated as scenarios—not official outcomes.
                  The more credible approach is to examine the assumptions
                  behind each estimate and ask how much of the proposed increase
                  represents DA neutralisation and how much represents a genuine
                  improvement in pay.
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
                circulating projections. They are not relied upon as authority
                for the substantive conclusions in this article.
              </div>
            </Accordion>
          </div>

          <footer className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm sm:p-6">
            <p className="font-black text-slate-950">Editorial disclosure</p>
            <p className="mt-2">
              This is an independent explanatory analysis based on publicly
              available official documents. It does not represent the views of
              the Government of India or the Eighth Central Pay Commission.
              Figures shown through interactive tools are illustrative and
              should not be treated as a salary or pension entitlement.
            </p>
          </footer>
          <PageFeedback pageSlug="/8th CPC" />
        </article>
      </main>
    </>
  );
}

export default EighthCPCRealityCheck;
