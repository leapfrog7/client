import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const label = (i) => String.fromCharCode(65 + i);

export default function AIExplanationModal({
  open,
  onClose,
  title,
  loading,
  error,
  content,
  question,
  userAnswer,
}) {
  if (!open) return null;

  const options = question?.options || [];
  const correct = question?.correctAnswer;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="AI Explanation"
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal */}
      <div className="relative z-10 w-[92vw] max-w-3xl rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b bg-gradient-to-r from-emerald-50 via-white to-sky-50">
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {title || "AI Insight"}
            </div>
            <div className="text-xs text-gray-600 mt-0.5">
              AI-generated guidance — verify with your notes / standard sources.
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Context: Question + Options */}
          {question && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div className="text-xs font-semibold text-gray-600 mb-2">
                Question context
              </div>

              <div
                className="text-sm font-semibold text-gray-900 whitespace-pre-line"
                style={{ whiteSpace: "pre-line" }}
              >
                {question.questionText}
              </div>

              <div className="mt-3 space-y-2">
                {options.map((opt, i) => {
                  const isUser = userAnswer === opt;
                  const isCorrect = correct === opt;

                  return (
                    <div
                      key={i}
                      className={[
                        "flex gap-2 rounded-lg border px-3 py-2 text-sm",
                        isCorrect
                          ? "border-emerald-300 bg-emerald-50"
                          : isUser
                            ? "border-amber-300 bg-amber-50"
                            : "border-gray-200 bg-white",
                      ].join(" ")}
                    >
                      <span className="w-6 shrink-0 font-bold text-gray-700">
                        {label(i)}.
                      </span>

                      <div className="flex-1 text-gray-900">{opt}</div>

                      <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold">
                        {isCorrect && (
                          <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5">
                            Correct
                          </span>
                        )}
                        {isUser && (
                          <span className="rounded-full bg-amber-500 text-white px-2 py-0.5">
                            Your pick
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick summary row */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white border px-2 py-1 text-gray-700">
                  Your Answer:{" "}
                  <span className="font-semibold">
                    {userAnswer ?? "Not Attempted"}
                  </span>
                </span>
                <span className="rounded-full bg-white border px-2 py-1 text-gray-700">
                  Correct: <span className="font-semibold">{correct}</span>
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            {loading ? (
              <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-sky-50 p-4">
                <div className="flex items-center gap-3">
                  {/* soft pulsing orb */}
                  <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-emerald-200">
                    <span className="absolute inline-flex h-9 w-9 rounded-full bg-emerald-200/40 animate-ping" />
                    <span className="relative text-emerald-700">✦</span>
                  </span>

                  <div className="flex-1">
                    <div className="text-sm font-semibold text-emerald-900">
                      Generating AI explanation…
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      This usually takes a moment. Please verify with standard
                      sources.
                    </div>

                    {/* animated “loading bar” */}
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                      <div className="h-full w-1/2 rounded-full bg-emerald-300 animate-[slide_1.1s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>

                {/* tiny shimmer text */}
                <div className="mt-3 text-[11px] text-gray-500">
                  Tip: Keep the question open — the explanation will appear here
                  automatically.
                </div>

                <style>
                  {`
      @keyframes slide {
        0% { transform: translateX(-80%); opacity: 0.35; }
        50% { opacity: 0.9; }
        100% { transform: translateX(220%); opacity: 0.35; }
      }
    `}
                </style>
              </div>
            ) : error ? (
              <div className="text-sm text-rose-700">❌ {error}</div>
            ) : !content ? (
              <div className="text-sm text-gray-600">No content.</div>
            ) : (
              <div className="prose prose-sm max-w-none ">
                <div className="p-0.5 text-base rounded-md bg-green-100 text-green-800 font-bold tracking-wider text-center">
                  <p>AI based Explanation ✨</p>
                </div>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          {/* Warning banner */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
            <div className="text-sm font-semibold text-amber-900">
              ⚠️ AI-generated explanation
            </div>
            <div className="text-xs text-amber-900/80 mt-1 leading-relaxed">
              This text may contain mistakes or over-simplifications. Treat it
              as a learning aid, not an authoritative source.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

AIExplanationModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.string,
  content: PropTypes.string,
  question: PropTypes.shape({
    questionText: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
    correctAnswer: PropTypes.string,
  }),
  userAnswer: PropTypes.string,
};
