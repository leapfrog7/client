import PropTypes from "prop-types";

function Step({ num, title, children }) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
        {num}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-600 leading-5">{children}</div>
      </div>
    </div>
  );
}

Step.propTypes = {
  num: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function TaskTrackerTutorial({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close tutorial"
      />

      {/* sheet/modal */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[calc(100%-24px)] max-w-xl
                   rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="How to use Task Tracker"
      >
        {/* header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">
              How to use Task Tracker
            </div>
            <div className="mt-0.5 text-xs text-slate-600">
              Built for file-based government work (receipts, notes, approvals).
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs hover:border-slate-300"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* content */}
        <div className="p-4 max-h-[70vh] overflow-auto space-y-4">
          <Step num={1} title="Create a task">
            Tap <span className="font-semibold">+ New</span>, write a short
            subject, and (optional) add File No / Receipt No / Section.
          </Step>

          <Step num={2} title="Update the stage">
            Use <span className="font-semibold">⚡ Quick</span> to move the task
            across stages (Pending → Under submission → Sent to IFD …).
          </Step>

          <Step num={3} title="Add a remark (milestone)">
            Every update becomes a timeline entry. Add a short remark like:
            “Submitted to DS” / “IFD concurrence awaited”.
          </Step>

          <Step num={4} title="Use due dates only when needed">
            Add due date for time-bound tasks. The dashboard highlights{" "}
            <span className="font-semibold">Due soon</span> and{" "}
            <span className="font-semibold">Overdue</span>.
          </Step>

          <Step num={5} title="Share read-only view (optional)">
            Tap <span className="font-semibold">Share</span> to generate a
            read-only link (expires automatically). Useful for reporting.
          </Step>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-800">
              Simple workflow tip
            </div>
            <div className="mt-1 text-xs text-slate-600 leading-5">
              Keep tasks short and action-based. Add small updates frequently —
              the timeline becomes your “file movement history”.
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-2 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

TaskTrackerTutorial.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
