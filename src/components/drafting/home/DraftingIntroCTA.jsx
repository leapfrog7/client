import {
  Building2,
  PenSquare,
  Sparkles,
  Eye,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Building2,
    title: "Set profile once",
    text: "Save office identity, place, and signatories for reuse in future drafts.",
  },
  {
    icon: PenSquare,
    title: "Draft in blocks",
    text: "Use familiar blocks like addressee, body, signatory, and document number.",
  },
  {
    icon: Sparkles,
    title: "Reuse standard text",
    text: "Insert routine lines and smart paragraphs instantly from Paragraph Bank.",
  },
  {
    icon: Eye,
    title: "Preview and finalize",
    text: "Check the structure first, then download DOCX for final use.",
  },
];

const badges = [
  { icon: ShieldCheck, label: "Private by design" },
  { icon: Download, label: "Best output in DOCX" },
];

export default function DraftingIntroCTA() {
  return (
    <section className="relative overflow-hidden rounded-lg md:rounded-2xl  bg-white shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_30%)]" />

      <div className="relative p-4 sm:px-8 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              New here?
            </div>

            <h2 className="mt-4 text-xl md:text-2xl font-semibold tracking-tight text-slate-900 ">
              Understand Drafting Studio in a minute
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 md:leading-7 text-slate-600 sm:text-base">
              Drafting Studio handles much of the repetitive formatting involved
              in official communications so you can focus more on the actual
              content. Set your profile once, draft through structured blocks,
              and reuse routine text wherever needed.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 md:gap-3">
              {badges.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    <Icon className="h-4 w-4 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/pages/tools/drafting/templates"
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] sm:w-auto"
              >
                Start a new draft
              </Link>

              <button
                type="button"
                onClick={() => {
                  const btn = document.querySelector(
                    '[data-drafting-tutorial-trigger="true"]',
                  );
                  btn?.click();
                }}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99] sm:w-auto"
              >
                Learn how it works
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:gap-4 md:grid-cols-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;

              const cardStyles = [
                {
                  card: "border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-cyan-50",
                  iconWrap: "bg-blue-100 text-blue-700 ring-1 ring-blue-200/70",
                  accent: "from-blue-400/20 to-cyan-400/10",
                },
                {
                  card: "border-violet-200/70 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50",
                  iconWrap:
                    "bg-violet-100 text-violet-700 ring-1 ring-violet-200/70",
                  accent: "from-violet-400/20 to-fuchsia-400/10",
                },
                {
                  card: "border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-teal-50",
                  iconWrap:
                    "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/70",
                  accent: "from-emerald-400/20 to-teal-400/10",
                },
                {
                  card: "border-amber-200/70 bg-gradient-to-br from-amber-50 via-white to-orange-50",
                  iconWrap:
                    "bg-amber-100 text-amber-700 ring-1 ring-amber-200/70",
                  accent: "from-amber-400/20 to-orange-400/10",
                },
              ];

              const style = cardStyles[idx % cardStyles.length];

              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-2xl border p-3 shadow-sm transition-all duration-300 md:p-4 md:rounded-2xl  md:hover:-translate-y-1 md:hover:shadow-lg ${style.card}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.accent} opacity-40 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100`}
                  />

                  <div className="relative flex items-start gap-3 md:gap-4 md:block">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm sm:h-11 sm:w-11 md:rounded-2xl ${style.iconWrap}`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <div className="min-w-0 flex-1 md:mt-0">
                      <h3 className="text-sm font-semibold leading-5 text-slate-900 sm:text-base md:mt-4">
                        {step.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-sm sm:leading-6">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
