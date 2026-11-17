import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { mockRequest } from "./mockPublicApi";
import useMockMemberToken from "./useMockMemberToken";
export default function ClosedMockReviewPage() {
  const { mockTestId } = useParams(),
    token = useMockMemberToken();
  const [state, setState] = useState(null),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!token) return;
    let active = true;
    const controller = new AbortController();
    setState({ token, id: mockTestId, loading: true });
    mockRequest(
      "get",
      "/mocks/tests/" + encodeURIComponent(mockTestId) + "/review",
      undefined,
      {
        headers: { Authorization: "Bearer " + token },
        signal: controller.signal,
      },
    )
      .then((response) => {
        if (active) setState({ token, id: mockTestId, data: response.data });
      })
      .catch((error) => {
        if (active)
          setState({
            token,
            id: mockTestId,
            error: error.message,
            signIn: error.status === 401,
            paidRequired: error.code === "PAID_REVIEW_REQUIRED",
          });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [mockTestId, token, retry]);
  const current =
    state?.token === token && state?.id === mockTestId ? state : null;
  const login =
    "/login?returnUrl=" +
    encodeURIComponent("/mock-tests/" + mockTestId + "/review");
  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 px-3 py-5 sm:px-6 sm:py-8">
      <Link
        to="/mock-tests"
        className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-800 hover:underline"
      >
        Back to Mock Tests
      </Link>
      <h1 className="break-words text-2xl font-bold text-slate-950">
        {current?.data?.mockTest?.title || "Closed mock review"}
      </h1>
      <p className="text-sm leading-6 text-slate-600">
        Paid subscribers can review all closed mock papers. If you took this
        mock, you can review your own questions and answers free from your
        results.
      </p>
      <Link
        to="/mock-tests/results"
        className="inline-flex min-h-11 items-center rounded-lg border border-teal-300 px-4 text-sm font-semibold text-teal-800 hover:bg-teal-50"
      >
        Review a mock I took — free
      </Link>
      {!token || current?.signIn ? (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
          <p className="text-sm leading-6 text-teal-950">
            Sign in to your paid UnderSigned account to view a paper you did not
            take. To review a mock you took, use the free results link above
            with your mock-test mobile/password login.
          </p>
          <Link
            to={login}
            className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-teal-700 px-4 text-sm font-semibold text-white"
          >
            Sign in to view questions
          </Link>
        </div>
      ) : (
        <>
          {!current || current.loading ? (
            <p
              role="status"
              className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700"
            >
              Loading questions and answers…
            </p>
          ) : null}
          {current?.error ? (
            <div
              role="alert"
              className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
            >
              <p>{current.error}</p>
              {current.paidRequired ? (
                <Link
                  to="/subscribe"
                  className="mt-2 inline-flex min-h-11 items-center rounded-lg border border-amber-400 px-4 font-semibold"
                >
                  Subscription details
                </Link>
              ) : null}
              {!current.paidRequired ? (
                <button
                  type="button"
                  onClick={() => setRetry((value) => value + 1)}
                  className="mt-2 min-h-11 rounded-lg border border-amber-400 px-4 font-semibold"
                >
                  Retry review
                </button>
              ) : null}
            </div>
          ) : null}
          {current?.data ? (
            <section aria-label="Question review" className="space-y-4">
              <p className="text-sm text-slate-600">
                {current.data.questions.length} questions
              </p>
              {current.data.questions.map((question, index) => (
                <ClosedMockQuestion
                  key={question._id}
                  question={question}
                  index={index}
                />
              ))}
              {!current.data.questions.length ? (
                <p className="text-sm text-slate-600">
                  No questions are available for this paper. Please contact
                  support.
                </p>
              ) : null}
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
function ClosedMockQuestion({ question, index }) {
  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        Question {index + 1}
      </h2>
      <p className="whitespace-pre-wrap [overflow-wrap:anywhere] text-base font-semibold leading-7 text-slate-950">
        {question.questionText}
      </p>
      <ol className="mt-4 space-y-2">
        {question.options.map((option, i) => (
          <li
            key={i}
            className={
              "rounded-lg border p-3 [overflow-wrap:anywhere] text-sm leading-6 " +
              (i === question.correctOptionIndex
                ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                : "border-slate-200 text-slate-700")
            }
          >
            <span className="mr-2 font-bold">
              {String.fromCharCode(65 + i)}.
            </span>
            {option.optionText}
            {i === question.correctOptionIndex ? (
              <span className="ml-2 inline-block text-xs font-bold">
                Correct answer
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {question.explanation ? (
        <div className="mt-4 rounded-lg bg-amber-50 p-3">
          <h3 className="text-xs font-bold text-amber-900">Explanation</h3>
          <p className="mt-1 whitespace-pre-wrap [overflow-wrap:anywhere] text-sm leading-6 text-slate-800">
            {question.explanation}
          </p>
        </div>
      ) : null}
    </article>
  );
}
ClosedMockQuestion.propTypes = {
  index: PropTypes.number.isRequired,
  question: PropTypes.shape({
    _id: PropTypes.string,
    questionText: PropTypes.string,
    correctOptionIndex: PropTypes.number,
    options: PropTypes.arrayOf(
      PropTypes.shape({ optionText: PropTypes.string }),
    ).isRequired,
    explanation: PropTypes.string,
  }).isRequired,
};
