import { Link } from "react-router-dom";

export default function PrevYearCTA() {
  return (
    <section
      aria-label="Previous Year Questions"
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-sm"
    >
      <div className="pointer-events-none absolute -top-12 -right-10 h-36 w-36 rounded-full bg-cyan-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative p-3 sm:p-6 lg:p-7">
        <div className="flex flex-col px-3 gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-700">
              Previous Year Questions
            </div>

            <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Practice actual exam patterns with PYQ-based preparation
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-[15px]">
              Strengthen your preparation using previous year questions in two
              simple ways. Attempt full yearwise sets for exam-like practice or
              focus topicwise to sharpen weak areas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 self-start text-xs sm:flex sm:flex-wrap">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">
              Yearwise sets
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">
              Topicwise practice
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">
              Exam-oriented
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600">
              Immediate Insights
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Link
            to="/pages/quiz/previousYear/Exam"
            className="group rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-amber-200">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="text-amber-600"
                >
                  <path
                    fill="currentColor"
                    d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v4H3V5a1 1 0 0 1 1-1h3V2zm14 8v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9h18zM5 12h4v4H5v-4z"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    Browse by Year
                  </h3>
                  <span className="text-sm font-medium text-amber-700 transition group-hover:translate-x-0.5">
                    Explore →
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Attempt Paper I and Paper II sets yearwise to get a more
                  exam-like practice experience.
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/pages/quiz/pyq/topic"
            className="group rounded-lg border border-cyan-200 bg-gradient-to-br from-cyan-50 to-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white ring-1 ring-cyan-200">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="text-cyan-700"
                >
                  <path
                    fill="currentColor"
                    d="M12 2a1 1 0 0 1 1 1v1.055A8.002 8.002 0 0 1 20.945 11H22a1 1 0 1 1 0 2h-1.055A8.002 8.002 0 0 1 13 20.945V22a1 1 0 1 1-2 0v-1.055A8.002 8.002 0 0 1 3.055 13H2a1 1 0 1 1 0-2h1.055A8.002 8.002 0 0 1 11 3.055V2a1 1 0 0 1 1-1Zm0 5a5 5 0 1 0 0 10a5 5 0 0 0 0-10Zm0 3a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z"
                  />
                </svg>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    Practice by Topic
                  </h3>
                  <span className="text-sm font-medium text-cyan-700 transition group-hover:translate-x-0.5">
                    Start →
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Choose a topic and narrow your practice area so you can revise
                  strategically and improve faster.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs leading-5 text-slate-500 sm:text-sm">
          A practical approach is to attempt yearwise papers first for overall
          readiness and then use topicwise practice to strengthen weaker areas.
        </div>
      </div>
    </section>
  );
}
