import { Link } from "react-router-dom";

{
  /* PYQ: Yearwise + Topicwise */
}

export default function PrevYearCTA() {
  return (
    <section
      aria-label="Previous Year Questions"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-gray-100 text-gray-700 shadow-xl my-6"
    >
      {/* subtle decorative blobs */}
      <div className="pointer-events-none absolute -top-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

      <div className="relative p-5 md:p-7">
        {/* Header + Badge */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight">
              Previous Year Questions (PYQ)
            </h2>
            <p className="mt-1 text-gray-600 max-w-2xl text-sm">
              Practice actual exam questions. Take Topic wise tests to firm up
              preparation and gain confidence.
            </p>
          </div>

          {/* <span
            className="inline-flex items-center gap-2 self-start md:self-center rounded-full bg-white/15 px-3 py-1 text-xs md:text-sm font-semibold ring-1 ring-white/25"
            title="Latest update"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
            2024 PYQ added
          </span> */}
        </div>

        {/* Paper quick chips */}
        {/* <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px]">
          <span className="px-2.5 py-1 rounded-full bg-white/15 ring-1 ring-white/20">
            Paper&nbsp;I: Constitution, RTI, DFPR…
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/15 ring-1 ring-white/20">
            Paper&nbsp;II: FR-SR, Leave, Pension, CSMOP…
          </span>
          <span className="px-2.5 py-1 rounded-full bg-white/15 ring-1 ring-white/20">
            Topicwise & Yearwise practice modes
          </span>
        </div> */}

        {/* CTA row */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Yearwise CTA */}
          <Link
            to="/pages/quiz/previousYear/Exam"
            className="group inline-flex items-center justify-between gap-3 rounded-xl bg-amber-100 text-amber-700 px-4 py-3 ring-1 ring-white/40 shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-9 w-9 rounded-lg bg-amber-50 ring-1 ring-amber-200">
                {/* calendar icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="text-amber-600"
                >
                  <path
                    fill="currentColor"
                    d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v4H3V5a1 1 0 0 1 1-1h3V2zm14 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9h18zM5 12h4v4H5v-4z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Browse by Year</div>
                <p className="text-xs text-gray-600">
                  Attempt full Paper&nbsp;I/II sets yearwise
                </p>
              </div>
            </div>
            <span className="text-indigo-600 group-hover:translate-x-0.5 transition">
              →
            </span>
          </Link>

          {/* Topicwise CTA */}
          <Link
            to="/pages/quiz/pyq/topic"
            className="group inline-flex items-center justify-between gap-3 rounded-xl bg-cyan-600 text-white px-4 py-3 ring-1 ring-cyan-600/40 shadow hover:bg-cyan-600 transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-9 w-9 rounded-lg bg-white/15 ring-1 ring-white/30">
                {/* target icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" className="">
                  <path
                    fill="currentColor"
                    d="M12 2a1 1 0 0 1 1 1v1.055A8.002 8.002 0 0 1 20.945 11H22a1 1 0 1 1 0 2h-1.055A8.002 8.002 0 0 1 13 20.945V22a1 1 0 1 1-2 0v-1.055A8.002 8.002 0 0 1 3.055 13H2a1 1 0 1 1 0-2h1.055A8.002 8.002 0 0 1 11 3.055V2a1 1 0 0 1 1-1Zm0 5a5 5 0 1 0 0 10a5 5 0 0 0 0-10Zm0 3a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Practice by Topic</div>
                <p className="text-xs text-cyan-50/90">
                  Customize PYQ by Topic and Year
                </p>
              </div>
            </div>
            <span className="text-white group-hover:translate-x-0.5 transition">
              →
            </span>
          </Link>
        </div>

        {/* Footnote / trust hint */}
        {/* <p className="mt-4 text-[12px] text-cyan-900/90">
          Tip: Start with the last 5 years, then broaden. Explanations show
          after you submit.
        </p> */}
      </div>
    </section>
  );
}
