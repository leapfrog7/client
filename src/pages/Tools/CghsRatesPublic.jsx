import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MdNavigateBefore, MdNavigateNext, MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import PageFeedback from "../../components/PageFeedback";
import { Helmet } from "react-helmet-async";
import { FiShare2, FiInfo } from "react-icons/fi";

import CghsGuidelinesModal from "./CghsGuidelinesModal"; // adjust path
// ---------- helpers ----------
const TIERS = [
  { value: "TIER_I", label: "Tier I" },
  { value: "TIER_II", label: "Tier II" },
  { value: "TIER_III", label: "Tier III" },
];

const WARD_CHIPS = [
  { value: "PRIVATE", label: "Private" },
  { value: "SEMI_PRIVATE", label: "Semi-Private" },
  { value: "GENERAL", label: "General" },
];

const WARD_LABEL = {
  PRIVATE: "Private",
  SEMI_PRIVATE: "Semi-Private",
  GENERAL: "General",
};

const FACILITY_ROWS = [
  { key: "SS", label: "Super Spl." },
  { key: "NABH", label: "NABH" },
  { key: "NON_NABH", label: "Non-NABH" },
  // render only if showSS=true
];

function formatCell(cell) {
  if (!cell) return "—";
  if (cell.amount !== null && cell.amount !== undefined && cell.amount !== "") {
    const n = Number(cell.amount);
    if (Number.isFinite(n)) return `₹${n.toLocaleString("en-IN")}`;
  }
  const raw = String(cell.raw || "").trim();
  return raw ? raw : "—";
}

function getRateCell(proc, tier, facility, ward) {
  return proc?.rates?.[tier]?.[facility]?.[ward] || null;
}

// Small debounce (no library)
function useDebouncedValue(value, delayMs = 350) {
  const [deb, setDeb] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return deb;
}

const chipBase =
  "px-3 py-1.5 rounded-full text-sm border transition whitespace-nowrap";
const chipOn = "bg-blue-600 text-white border-blue-600";
const chipOff = "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";

const CghsRatesPublic = () => {
  // keep old link working (same component path unchanged)
  const BASE_URL = "https://server-v4dy.onrender.com";
  // const BASE_URL = "http://localhost:5000";

  // IMPORTANT: your app.js mounts public V2 here:
  const API = `${BASE_URL}/api/v1/public-cghs-rates-v2`;

  // paging
  const limit = 10;
  const [page, setPage] = useState(1);

  // filters
  const [q, setQ] = useState("");
  const dq = useDebouncedValue(q, 350);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [tier, setTier] = useState("TIER_I"); // default Tier I
  // const [ward, setWard] = useState("PRIVATE"); // default Private
  const [selectedWards, setSelectedWards] = useState([
    "PRIVATE",
    "SEMI_PRIVATE",
  ]);
  //  const [showSS, setShowSS] = useState(false); // SS chip

  // “More options”
  // const [moreOpen, setMoreOpen] = useState(false);
  // const [showNonNabh, setShowNonNabh] = useState(false); // hidden by default
  // const [showRawOnExpand, setShowRawOnExpand] = useState(true);

  // data
  const [loading, setLoading] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);

  const [activeRateSet, setActiveRateSet] = useState(null);

  const [items, setItems] = useState([]); // list results (code+name+speciality)
  const [total, setTotal] = useState(0);

  // details per row (cghsCode -> full procedure doc)
  const [detailsMap, setDetailsMap] = useState({});
  // const [expanded, setExpanded] = useState({}); // code -> true/false

  const skip = (page - 1) * limit;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  );

  // reset paging when filters change
  useEffect(() => {
    setPage(1);
  }, [dq, tier, selectedWards.join("|")]);

  // fetch list
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(page === 1 && !items.length);
        setLoadingRows(true);

        // NOTE: your existing publicController uses page/limit style.
        // But your earlier UI used skip/limit. We'll support both patterns safely:
        // If your backend currently expects page/limit, it will ignore skip.
        // If it expects skip/limit, it will ignore page.
        const res = await axios.get(`${API}/search`, {
          params: {
            q: dq || "",
            page,
            limit,
            skip,
          },
        });

        // Try to read response in either format:
        const apiItems = res.data?.items || [];
        const apiTotal =
          typeof res.data?.total === "number"
            ? res.data.total
            : typeof res.data?.count === "number"
              ? res.data.count
              : 0;

        setActiveRateSet(res.data?.activeRateSet || null);
        setItems(apiItems);
        setTotal(apiTotal);

        // keep already fetched details for caching; just collapse all on new search/page
      } catch (e) {
        console.error(e);
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
        setLoadingRows(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API, dq, page, limit, skip]);

  // fetch details for visible items (so cards can show NABH + SS without expanding)
  useEffect(() => {
    const run = async () => {
      if (!items.length) return;

      // fetch only missing
      const missing = items
        .map((x) => x.cghsCode)
        .filter((code) => code && !detailsMap[code]);

      if (missing.length === 0) return;

      try {
        const results = await Promise.all(
          missing.map((code) =>
            axios
              .get(`${API}/procedure/${code}`)
              .then((r) => r.data)
              .catch(() => null),
          ),
        );

        setDetailsMap((prev) => {
          const next = { ...prev };
          results.forEach((doc) => {
            if (doc?.cghsCode) next[doc.cghsCode] = doc;
          });
          return next;
        });
      } catch (e) {
        console.error(e);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const pageInfo = useMemo(() => {
    if (!total) return "0 results";
    const from = skip + 1;
    const to = Math.min(skip + items.length, total);
    return `Showing ${from}–${to} of ${total}`;
  }, [skip, items.length, total]);

  // const toggleExpanded = (code) => {
  //   setExpanded((p) => ({ ...p, [code]: !p[code] }));
  // };

  if (loading) return <Loading />;

  return (
    <div className="p-2 max-w-6xl mx-auto animate-fade-in">
      <Helmet>
        {/* Primary */}
        <title>
          Latest CGHS Package Rates | Tier I, II & III | NABH & Non-NABH |
          UnderSigned
        </title>
        <meta
          name="description"
          content="Check the latest CGHS package rates for Tier I, II and III cities—Super Speciality, NABH and Non-NABH hospitals. View rates across General, Semi-Private and Private ward categories."
        />
        <link
          rel="canonical"
          href="https://undersigned.in/pages/public/cghs-rates"
        />

        {/* Indexing */}
        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />

        {/* Theme */}
        <meta name="theme-color" content="#1e40af" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UnderSigned" />
        <meta
          property="og:title"
          content="Latest CGHS Package Rates | UnderSigned"
        />
        <meta
          property="og:description"
          content="Updated CGHS rates for Tier I/II/III cities—Super Speciality, NABH & Non-NABH, with General/Semi-Private/Private categories."
        />
        <meta
          property="og:url"
          content="https://undersigned.in/pages/public/cghs-rates"
        />
        {/* Replace with a real absolute URL image (1200×630 recommended) */}
        {/* <meta
          property="og:image"
          content="https://undersigned.in/og/cghs-rates.png"
        /> */}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Latest CGHS Package Rates | UnderSigned"
        />
        <meta
          name="twitter:description"
          content="Updated CGHS rates for Tier I/II/III cities—Super Speciality, NABH & Non-NABH, with General/Semi-Private/Private categories."
        />
        <meta
          name="twitter:image"
          content="https://undersigned.in/og/cghs-rates.png"
        />

        {/* Structured Data */}
        <script type="application/ld+json">{`
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://undersigned.in/#website",
        "name": "UnderSigned",
        "url": "https://undersigned.in"
      },
      {
        "@type": "WebPage",
        "@id": "https://undersigned.in/pages/public/cghs-rates#webpage",
        "url": "https://undersigned.in/pages/public/cghs-rates",
        "name": "Latest CGHS Package Rates (Tier I, II & III)",
        "description": "Updated CGHS package rates for Tier I/II/III cities across Super Speciality, NABH and Non-NABH hospitals, with General/Semi-Private/Private categories.",
        "isPartOf": { "@id": "https://undersigned.in/#website" }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://undersigned.in/pages/public/cghs-rates#breadcrumb",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://undersigned.in/" },
          { "@type": "ListItem", "position": 2, "name": "CGHS Rates", "item": "https://undersigned.in/pages/public/cghs-rates" }
        ]
      }
    ]
  }
  `}</script>
      </Helmet>

      <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-2 mt-4">
        Latest CGHS Rates 📋
      </h1>

      <p className="text-center text-gray-600 text-sm md:text-base mb-4 max-w-2xl mx-auto leading-relaxed">
        Search and Find Latest CGHS procedures and view rates in the most
        convenient manner.
      </p>

      {/* Sticky filter bar (mobile-first) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 -mx-2 px-2 py-3">
        {/* Tier tabs */}
        <div className="mt-1">
          <div className="inline-flex w-full rounded-md border border-gray-200 bg-gray-50 p-1 shadow-sm">
            {TIERS.map((t) => {
              const active = tier === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTier(t.value)}
                  className={[
                    "flex-1 rounded-md px-3 py-2 text-sm font-semibold transition",
                    "focus:outline-none focus:ring-2 focus:ring-blue-600/30",
                    active
                      ? "bg-white text-blue-800 shadow border border-gray-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-white/60",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ward chips + More */}
        <div className="mt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {WARD_CHIPS.map((w) => {
              const on = selectedWards.includes(w.value);

              return (
                <button
                  key={w.value}
                  type="button"
                  className={`${chipBase} ${on ? chipOn : chipOff}`}
                  aria-pressed={on}
                  onClick={() => {
                    setSelectedWards((prev) => {
                      const isOn = prev.includes(w.value);
                      let next = isOn
                        ? prev.filter((x) => x !== w.value)
                        : [...prev, w.value];

                      // If user unselects everything, revert to your two defaults
                      if (next.length === 0) return ["PRIVATE", "SEMI_PRIVATE"];

                      // Optional: if user removes BOTH defaults, snap back to both defaults.
                      // (This keeps your UI focused on what most people need.)
                      const hasPrivate = next.includes("PRIVATE");
                      const hasSemi = next.includes("SEMI_PRIVATE");
                      if (!hasPrivate && !hasSemi)
                        return ["PRIVATE", "SEMI_PRIVATE"];

                      return next;
                    });
                  }}
                >
                  {w.label}
                  {on ? <span className="ml-1">✓</span> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="ml-auto text-xs text-gray-500 whitespace-nowrap text-right mr-2">
          {pageInfo}
        </div>
        {/* Search */}
        <div className="mt-3">
          <div className="relative">
            {/* Search icon */}
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              🔍
            </div>

            <input
              type="text"
              placeholder="Search procedure name or CGHS code"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="
        w-full
        rounded-xl
        border border-gray-300
        bg-white
        pl-10 pr-10 py-2.5
        text-sm md:text-base
        shadow-sm
        focus:outline-none
        focus:ring-2 focus:ring-blue-600/40
        focus:border-blue-600
        transition
      "
            />

            {/* Clear button */}
            {q && (
              <button
                onClick={() => setQ("")}
                className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-gray-400 hover:text-gray-700
          transition
        "
                title="Clear search"
              >
                <MdCancel size={20} />
              </button>
            )}
          </div>
          {/* Helper text
          <div className="mt-1 text-[11px] text-gray-500 px-1">
            Example: <span className="font-medium">MRI Brain</span>,{" "}
            <span className="font-medium">CGHS Code 1234</span>
          </div> */}
        </div>
      </div>

      {/* Active dataset meta */}
      <div className="hidden mt-4 bg-white border border-gray-200 rounded-md px-4 py-3 shadow-sm">
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Dataset:</span>{" "}
          {activeRateSet?.title || "ACTIVE RateSet"}
          {activeRateSet?.effectiveFrom ? (
            <span className="text-gray-500">
              {" "}
              • Effective:{" "}
              {new Date(activeRateSet.effectiveFrom).toLocaleDateString(
                "en-IN",
              )}
            </span>
          ) : null}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Showing rates for <b>{tier.replace("_", " ")}</b> • Wards:{" "}
          <b>{selectedWards.map((w) => w.replace("_", "-")).join(", ")}</b>
        </div>
      </div>

      {/* Pagination
      {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-6 text-sm md:text-base">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <MdNavigateBefore size={20} />
          </button>

          <span className="px-3 py-1 rounded-full border bg-white text-gray-700">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <MdNavigateNext size={20} />
          </button>
        </div>
      )} */}

      {/* Results */}
      <div className="mt-4 space-y-3">
        {loadingRows ? (
          <div className="py-8 text-center text-gray-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No results.</div>
        ) : (
          items.map((it) => {
            const proc = detailsMap[it.cghsCode];

            // Visible ward columns: Private always + optional selected
            const visibleWards = ["PRIVATE"];
            if (selectedWards.includes("SEMI_PRIVATE"))
              visibleWards.push("SEMI_PRIVATE");
            if (selectedWards.includes("GENERAL")) visibleWards.push("GENERAL");

            const get = (facility, ward) =>
              getRateCell(proc, tier, facility, ward);

            return (
              <div
                key={it.cghsCode}
                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
              >
                <div className="py-4 px-2">
                  {/* title */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-blue-900 font-semibold text-sm md:text-base break-words">
                        🧪 {it.name}
                      </div>
                      <div className="mt-1 text-xs text-blue-700">
                        #️⃣ {it.cghsCode}
                        {it.speciality ? (
                          <span className="text-gray-500">
                            {" "}
                            • 🏷️ {it.speciality}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Grouped Rates: rows = facility, cols = wards */}
                  <div className="mt-3 border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header row */}
                    <div
                      className="grid bg-gray-50 text-[12px] md:text-base text-gray-600"
                      style={{
                        gridTemplateColumns: `90px repeat(${visibleWards.length}, minmax(0, 1fr))`,
                      }}
                    >
                      <div className="px-2 py-2 font-semibold">Rate</div>
                      {visibleWards.map((w) => (
                        <div key={w} className="px-2 py-2 text-center">
                          {WARD_LABEL[w]}
                        </div>
                      ))}
                    </div>

                    {/* Facility rows */}
                    {FACILITY_ROWS.map((row) => (
                      <div
                        key={row.key}
                        className="grid border-t border-gray-200"
                        style={{
                          gridTemplateColumns: `90px repeat(${visibleWards.length}, minmax(0, 1fr))`,
                        }}
                      >
                        <div className="px-2 py-2 text-[12px] md:text-base text-gray-600 bg-white">
                          {row.label}
                        </div>

                        {visibleWards.map((w) => (
                          <div
                            key={w}
                            className="px-2 py-2 text-center bg-white"
                          >
                            <div className="text-[12px] md:text-base text-gray-900">
                              {formatCell(get(row.key, w))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Tier-wise CGHS Cities */}
      <div className="mt-10 border-t border-gray-200 pt-6">
        <details className="group bg-gray-50 rounded-xl shadow-sm">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm md:text-base font-semibold text-blue-800">
            <span>📍 CGHS Cities (Tier-wise)</span>
            <span className="text-gray-400 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>

          <div className="px-4 pb-4 pt-2 text-sm text-gray-700 space-y-4">
            {/* Tier I */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Tier I Cities
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Hyderabad (UA)",
                  "Delhi (UA)",
                  "Ahmedabad (UA)",
                  "Bengaluru (UA)",
                  "Mumbai (UA)",
                  "Pune (UA)",
                  "Chennai (UA)",
                  "Kolkata (UA)",
                ].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            {/* Tier II */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Tier II Cities
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Vijayawada",
                  "Warangal",
                  "Visakhapatnam",
                  "Guntur",
                  "Nellore",
                  "Guwahati",
                  "Patna",
                  "Chandigarh",
                  "Durg-Bhilai",
                  "Raipur",
                  "Rajkot",
                  "Jamnagar",
                  "Bhavnagar",
                  "Vadodara",
                  "Surat",
                  "Faridabad",
                  "Gurgaon",
                  "Srinagar",
                  "Jammu",
                  "Jamshedpur",
                  "Dhanbad",
                  "Ranchi Bokaro",
                  "Belgaum",
                  "Hubli-Dharwad",
                  "Mangalore",
                  "Mysore",
                  "Gulbarga",
                  "Kozhikode",
                  "Kochi",
                  "Thiruvananthapuram",
                  "Thrissur",
                  "Malappuram",
                  "Kannur",
                  "Kollam",
                  "Gwalior",
                  "Indore",
                  "Bhopal",
                  "Jabalpur",
                  "Ujjain",
                  "Amravati",
                  "Nagpur",
                  "Aurangabad",
                  "Nashik",
                  "Bhiwandi",
                  "Solapur",
                  "Kolhapur",
                  "Vasai-Virar",
                  "Malegaon",
                  "Nanded-Waghala",
                  "Sangli",
                  "Cuttack",
                  "Bhubaneswar",
                  "Raurkela",
                  "Puducherry",
                  "Amritsar",
                  "Jalandhar",
                  "Ludhiana",
                  "Bikaner",
                  "Jaipur",
                  "Jodhpur",
                  "Kota",
                  "Ajmer",
                  "Salem",
                  "Tiruppur",
                  "Coimbatore",
                  "Tiruchirappalli",
                  "Madurai",
                  "Erode",
                  "Moradabad",
                  "Meerut",
                  "Ghaziabad",
                  "Aligarh",
                  "Agra",
                  "Bareilly",
                  "Lucknow",
                  "Kanpur",
                  "Allahabad",
                  "Gorakhpur",
                  "Varanasi",
                  "Saharanpur",
                  "Noida",
                  "Firozabad",
                  "Jhansi",
                  "Dehradun",
                  "Asansol",
                  "Siliguri",
                  "Durgapur",
                ].map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
            {/* Tier III */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Tier III Cities
              </h4>
              <p className="text-sm text-gray-600">
                Cities not mentioned above are Tier III
              </p>
            </div>
          </div>
        </details>

        {/* <p className="mt-3 text-xs text-gray-500 text-center">
          City classification as per CGHS guidelines for rate applicability.  
        </p> */}
      </div>
      <div className="mx-auto mt-3 flex flex-wrap items-center justify-center gap-3 w-full">
        {/* Guidelines button */}
        <button
          onClick={() => setGuidelinesOpen(true)}
          className="
      inline-flex items-center gap-2
      px-5 py-2.5
      rounded-lg
      border border-blue-200
      bg-blue-50
      text-sm font-medium text-blue-800
      hover:bg-blue-100 hover:border-blue-300
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      shadow-sm
    "
        >
          <FiInfo className="text-base" />
          <span>CGHS General Guidelines</span>
        </button>

        {/* Share button */}
        <button
          onClick={async () => {
            const url = window.location.href;
            const title = "CGHS Rates & Guidelines";
            const text =
              "Check CGHS package rates, ward entitlement rules and billing guidelines.";

            try {
              if (navigator.share) {
                await navigator.share({ title, text, url });
              } else {
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard");
              }
            } catch (err) {
              console.error("Share failed", err);
            }
          }}
          className="
      inline-flex items-center justify-center
      w-11 h-11
      rounded-full
      border border-gray-300
      bg-white
      text-gray-600
      hover:bg-gray-50 hover:text-blue-700
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      shadow-sm
    "
          title="Share this page"
          aria-label="Share CGHS rates page"
        >
          <FiShare2 className="text-lg" />
        </button>
      </div>

      <CghsGuidelinesModal
        open={guidelinesOpen}
        onClose={() => setGuidelinesOpen(false)}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2 mt-6 text-sm md:text-base">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <MdNavigateBefore size={20} />
          </button>

          <span className="px-3 py-1 rounded-full border bg-white text-gray-700">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <MdNavigateNext size={20} />
          </button>
        </div>
      )}

      <PageFeedback pageSlug="/cghs-rates" />

      <div className="bg-indigo-50 rounded-lg p-6 my-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="text-center md:text-left">
          <h3 className="text-lg md:text-xl font-semibold text-indigo-700">
            Looking for CGHS Hospitals and Labs?
          </h3>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Find empanelled hospitals, diagnostic centers, and labs city-wise.
          </p>
        </div>

        <Link
          to="/pages/public/cghs-units"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-full transition"
        >
          Explore CGHS Units
        </Link>
      </div>

      <p className="text-xs text-gray-400 my-12 text-center px-4">
        <strong>Disclaimer:</strong> Rates are subject to change; please verify
        at the time of billing.
      </p>
    </div>
  );
};

export default CghsRatesPublic;
