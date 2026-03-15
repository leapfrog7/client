import PropTypes from "prop-types";
import { FaRedo, FaPlay, FaPauseCircle, FaEye } from "react-icons/fa";
import { formatRemainingTimeCompact } from "../utils/time";

export default function PaperListTable({
  filteredPapers,
  onStart,
  onResume,
  onResetTimer,
  onViewResult,
}) {
  const renderActionButton = (paper) => {
    const isInProgress = paper.sessionStatus === "in_progress";
    const hasLatestResult = !!paper.hasLatestResult;

    if (isInProgress) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700"
            onClick={() => onResume(paper)}
          >
            <FaPauseCircle />
            Resume Quiz
          </button>

          {hasLatestResult && (
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-200"
              onClick={() => onViewResult(paper)}
            >
              <FaEye />
              Last Score
            </button>
          )}
        </div>
      );
    }

    if (hasLatestResult) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            onClick={() => onStart(paper)}
          >
            <span className="text-[11px]">
              <FaPlay />
            </span>
            Start Again
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-200"
            onClick={() => onViewResult(paper)}
          >
            <FaEye />
            Last Score
          </button>
        </div>
      );
    }

    return (
      <button
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        onClick={() => onStart(paper)}
      >
        <span className="text-[11px]">
          <FaPlay />
        </span>
        Start Quiz
      </button>
    );
  };

  return (
    <div className="w-full md:w-11/12 mx-auto">
      <div className="mb-4 rounded-md bg-sky-50 p-3 shadow-sm sm:p-4 md:p-5">
        <div className="text-center">
          <p className="inline-flex px-3 py-1 text-base md:text-2xl font-semibold text-sky-700">
            Previous Year Papers 🖊️
          </p>
          <p className="mt-2 text-xs md:text-sm leading-4 text-slate-600">
            Attempt actual previous year papers, save progress, resume later,
            and benchmark your preparation more realistically.
          </p>
          <p className="mt-2 text-xs italic text-slate-500">
            Answers are aligned with the official UPSC answer key.
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 shadow-sm">
        <p className="text-sm font-semibold text-amber-800">
          Important update for existing users
        </p>

        <p className="mt-1 text-xs md:text-sm leading-5 text-amber-700">
          The Previous Year Exam module has been upgraded. If you had an older
          saved exam state from before this update, you may notice occasional
          compatibility issues. If that happens, please reset that paper once
          and start again for the best experience.
        </p>

        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs md:text-sm leading-5 text-amber-700">
          <li>
            You can now view your latest submitted result directly from this
            page.
          </li>
          {/* <li>Only your latest submitted result for each paper is retained.</li> */}
          {/* <li>
            Saved progress and submitted results are now managed more clearly.
          </li> */}
          <li>
            The interface has been refined to improve usability on mobile and
            desktop.
          </li>
          <li>
            Resetting an older saved paper once should usually fix any legacy
            state issue.
          </li>
        </ul>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filteredPapers.map((paper) => {
          const isInProgress = paper.sessionStatus === "in_progress";
          const hasLatestResult = !!paper.hasLatestResult;

          return (
            <div
              key={`${paper.year}-${paper.paperType}`}
              className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-bold tracking-wide text-sky-700">
                  {paper.year}
                  <span
                    className={` ml-4 inline-flex rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                      paper.paperType === "Paper I"
                        ? "bg-gradient-to-r from-sky-100 to-zinc-100 text-sky-700"
                        : "bg-gradient-to-r from-rose-100 to-stone-100 text-rose-800"
                    }`}
                  >
                    {paper.paperType}
                  </span>
                </p>

                <span
                  className={`rounded-lg mt-1 px-2.5 py-1 text-[11px] font-medium ${
                    isInProgress
                      ? "bg-pink-100 text-pink-700"
                      : hasLatestResult
                        ? "bg-white text-emerald-700 text-base p-0"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isInProgress ? "Saved" : hasLatestResult ? "✅" : "New"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Time Left
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatRemainingTimeCompact(
                      isInProgress ? paper.remainingTime : null,
                    )}
                  </p>
                </div>

                {isInProgress ? (
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-50"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "This will reset your saved exam state and timer for this paper. Do you want to continue?",
                      );
                      if (confirmed) {
                        onResetTimer(paper._id);
                      }
                    }}
                    title="Reset timer"
                  >
                    <FaRedo />
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </div>

              <div className="mt-3 text-center">
                {renderActionButton(paper)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="mt-6 min-w-full overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Year
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Paper Type
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Start / Resume
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Time Left
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Reset
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredPapers.map((paper) => {
              const isInProgress = paper.sessionStatus === "in_progress";

              return (
                <tr
                  key={`${paper.year}-${paper.paperType}`}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                    {paper.year}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex rounded-lg px-4 py-2 text-sm font-semibold ${
                        paper.paperType === "Paper I"
                          ? "bg-gradient-to-r from-sky-100 to-zinc-100 text-sky-700"
                          : "bg-gradient-to-r from-rose-100 to-stone-100 text-rose-700"
                      }`}
                    >
                      {paper.paperType}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {renderActionButton(paper)}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-medium text-slate-700">
                      {formatRemainingTimeCompact(
                        isInProgress ? paper.remainingTime : null,
                      )}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    {isInProgress ? (
                      <button
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-50"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "This will reset your saved exam state and timer for this paper. Do you want to continue?",
                          );
                          if (confirmed) {
                            onResetTimer(paper._id);
                          }
                        }}
                        title="Reset timer"
                      >
                        <FaRedo />
                        <span>Reset</span>
                      </button>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:p-4">
        <p className="text-base font-semibold text-slate-900">
          Important Points
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          <li>More questions on previous year exams will be added soon.</li>
          <li>You will have 120 minutes to finish the exam after starting.</li>
          <li>You can save your progress and resume later.</li>
          <li>
            The exam auto-submits when time runs out, though you can submit
            earlier.
          </li>
          <li>
            Scoring follows UPSC-style marking including negative marking.
          </li>
          <li>You can reset and retake the exam as many times as you want.</li>
        </ul>
      </div>
    </div>
  );
}

PaperListTable.propTypes = {
  filteredPapers: PropTypes.array.isRequired,
  onStart: PropTypes.func.isRequired,
  onResume: PropTypes.func.isRequired,
  onResetTimer: PropTypes.func.isRequired,
  onViewResult: PropTypes.func.isRequired,
};
