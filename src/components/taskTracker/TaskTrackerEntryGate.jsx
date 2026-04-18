import PropTypes from "prop-types";

const cards = [
  {
    title: "Create and organize tasks",
    text: "Create a task with a short subject and optionally add File No., Receipt No., or Section for quick identification later.",
    icon: "📝",
    tone: "from-sky-50 to-white border-sky-100",
    iconTone: "bg-sky-100 text-sky-700 border-sky-200",
  },
  {
    title: "Track stage movement",
    text: "Move matters across practical office stages like Pending, Under submission, To be discussed, Sent to IFD, and Comments awaited.",
    icon: "🗂️",
    tone: "from-violet-50 to-white border-violet-100",
    iconTone: "bg-violet-100 text-violet-700 border-violet-200",
  },
  {
    title: "Build a milestone history",
    text: "Every update becomes part of the task timeline, helping you retain a short movement history of the matter.",
    icon: "📍",
    tone: "from-emerald-50 to-white border-emerald-100",
    iconTone: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    title: "Watch aging and due dates",
    text: "Quickly identify overdue matters, due-soon tasks, and work that has remained pending for too long.",
    icon: "⏳",
    tone: "from-amber-50 to-white border-amber-100",
    iconTone: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    title: "Update quickly on mobile",
    text: "Use quick stage actions for faster updates when you do not want to open the full detail view each time.",
    icon: "⚡",
    tone: "from-cyan-50 to-white border-cyan-100",
    iconTone: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },
  {
    title: "Download concise summaries",
    text: "Export active work into a compact stage-wise PDF summary for review, discussion, or personal tracking.",
    icon: "📄",
    tone: "from-rose-50 to-white border-rose-100",
    iconTone: "bg-rose-100 text-rose-700 border-rose-200",
  },
];

export default function TaskTrackerEntryGate({ onLogin, onRegister }) {
  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 px-5 py-5 md:px-7 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              {/* <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-slate-600 shadow-sm">
                Task Tracker
              </div> */}

              <h1 className="mt-2 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                Track office work with stages, milestones, and overdue alerts
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Built for handling file-based work, movement of cases, pending
                action, and long-running official matters in a structured way.
              </p>
            </div>

            <div className="flex flex-col  shrink-0 flex-wrap items-center gap-2 lg:gap-4">
              <button
                type="button"
                onClick={onLogin}
                className="rounded-xl md:min-w-48 bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Login to Start ⌯⌲
              </button>

              <button
                type="button"
                onClick={onRegister}
                className="rounded-xl border md:min-w-48 border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
              >
                Register for free 📌
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="mb-4">
            <div className="text-sm font-semibold text-slate-900">
              What you can do with it
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Designed to help you handle work that is too important or too
              long-running to be left to memory alone.
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border bg-gradient-to-br ${item.tone} p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-lg shadow-sm ${item.iconTone}`}
                  >
                    {item.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-600 md:text-sm">
                      {item.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 md:px-5">
            <div className="text-sm font-semibold text-slate-900">
              Why login is needed
            </div>
            <div className="mt-1 text-sm leading-6 text-slate-600">
              Your tasks, milestones, stage changes, and summaries are saved to
              your account so that your work remains available across all your
              devices.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

TaskTrackerEntryGate.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
};
