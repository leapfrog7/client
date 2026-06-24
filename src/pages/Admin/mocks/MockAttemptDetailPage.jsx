import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaBan, FaUndo } from "react-icons/fa";

import AttemptStatusBadge from "../../../components/mocks/AttemptStatusBadge";
import ConfirmActionModal from "../../../components/mocks/ConfirmActionModal";
import LoadingState from "../../../components/mocks/LoadingState";

import {
  disqualifyAttempt,
  getMockAttemptDetail,
  restoreAttempt,
} from "./mockAdminApi";

import {
  formatAccuracy,
  formatDateTime,
  formatDuration,
  formatScore,
} from "./mockFormatters";

function MockAttemptDetailPage() {
  const { mockTestId, attemptId } = useParams();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState({
    open: false,
    type: "",
  });
  const [reason, setReason] = useState("");

  async function loadDetail() {
    try {
      setLoading(true);
      setError("");

      const response = await getMockAttemptDetail(attemptId);
      setDetail(response?.data || null);
    } catch (err) {
      setError(err.message || "Failed to load attempt detail.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  function closeConfirm() {
    if (actionLoading) return;

    setConfirmState({
      open: false,
      type: "",
    });
    setReason("");
  }

  async function handleConfirmAction() {
    try {
      setActionLoading(true);
      setError("");

      if (confirmState.type === "disqualify") {
        await disqualifyAttempt(attemptId, reason || "Disqualified by admin.");
      }

      if (confirmState.type === "restore") {
        await restoreAttempt(attemptId);
      }

      closeConfirm();
      await loadDetail();
    } catch (err) {
      setError(err.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading attempt detail..." />;
  }

  const attempt = detail?.attempt;
  const mockTest = detail?.mockTest;
  const review = Array.isArray(detail?.review) ? detail.review : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          to={`/adminDashboard/mocks/${mockTestId}/attempts`}
          className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <FaArrowLeft />
          Back to Attempts
        </Link>

        <div className="flex flex-wrap gap-2">
          {attempt?.status === "disqualified" || attempt?.isDisqualified ? (
            <button
              type="button"
              onClick={() => setConfirmState({ open: true, type: "restore" })}
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <FaUndo />
              Restore Attempt
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setConfirmState({ open: true, type: "disqualify" })
              }
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <FaBan />
              Disqualify
            </button>
          )}
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {attempt?.username || "Participant"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {attempt?.mobileMasked || ""}
            </p>
            <p className="mt-2 text-sm font-medium text-gray-700">
              {mockTest?.title || "Mock Test"}
            </p>
          </div>

          <AttemptStatusBadge status={attempt?.status} />
        </div>

        {attempt?.disqualificationReason ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <span className="font-semibold">Disqualification reason:</span>{" "}
            {attempt.disqualificationReason}
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <InfoItem label="Score" value={formatScore(attempt?.score)} />
          <InfoItem label="Correct" value={attempt?.correctCount || 0} />
          <InfoItem label="Wrong" value={attempt?.wrongCount || 0} />
          <InfoItem
            label="Unattempted"
            value={attempt?.unattemptedCount || 0}
          />
          <InfoItem
            label="Accuracy"
            value={formatAccuracy(attempt?.accuracy)}
          />
          <InfoItem
            label="Used Time"
            value={formatDuration(attempt?.usedSeconds)}
          />
          <InfoItem
            label="Duration"
            value={formatDuration(attempt?.durationSeconds)}
          />
          <InfoItem
            label="Started"
            value={formatDateTime(attempt?.startedAt)}
          />
          <InfoItem
            label="Submitted"
            value={formatDateTime(attempt?.submittedAt)}
          />
          <InfoItem
            label="Last Saved"
            value={formatDateTime(attempt?.lastSavedAt)}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Answer Review</h3>

        <div className="mt-5 space-y-4">
          {review.map((item, index) => (
            <ReviewCard
              key={item.question?._id || index}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>

      <ConfirmActionModal
        open={confirmState.open}
        title={
          confirmState.type === "disqualify"
            ? "Disqualify attempt"
            : "Restore attempt"
        }
        message={
          confirmState.type === "disqualify"
            ? "This attempt will be excluded from the leaderboard."
            : "This attempt will be restored and included again as per its submission status."
        }
        confirmLabel={
          confirmState.type === "disqualify" ? "Disqualify" : "Restore"
        }
        danger={confirmState.type === "disqualify"}
        loading={actionLoading}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirm}
      />

      {confirmState.open && confirmState.type === "disqualify" ? (
        <div className="fixed inset-x-0 bottom-6 z-[60] mx-auto w-full max-w-md px-4">
          <div className="rounded-lg border bg-white p-4 shadow-xl">
            <label className="text-sm font-semibold text-gray-700">
              Reason
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Optional reason for disqualification"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-gray-900">{value || "-"}</p>
    </div>
  );
}

function ReviewCard({ item, index }) {
  const question = item.question;
  const userAnswer = item.userAnswer;

  const selectedIndex =
    userAnswer?.selectedOptionIndex === null ||
    userAnswer?.selectedOptionIndex === undefined
      ? null
      : Number(userAnswer.selectedOptionIndex);

  const correctIndex = Number(question?.correctOptionIndex);

  const isUnattempted = selectedIndex === null;
  const isCorrect = !isUnattempted && selectedIndex === correctIndex;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
          Q{index + 1}
        </span>

        {isUnattempted ? (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
            Unattempted
          </span>
        ) : isCorrect ? (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
            Correct
          </span>
        ) : (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            Wrong
          </span>
        )}

        {question?.subject ? (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {question.subject}
          </span>
        ) : null}

        {question?.topic ? (
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
            {question.topic}
          </span>
        ) : null}
      </div>

      <p className="whitespace-pre-wrap text-sm font-semibold leading-6 text-gray-900">
        {question?.questionText}
      </p>

      <div className="mt-4 space-y-2">
        {(question?.options || []).map((option, optionIndex) => {
          const optionIsCorrect = optionIndex === correctIndex;
          const optionIsSelected = optionIndex === selectedIndex;

          return (
            <div
              key={`${option.optionText}-${optionIndex}`}
              className={[
                "rounded-md border px-3 py-2 text-sm",
                optionIsCorrect
                  ? "border-green-300 bg-green-50 text-green-800"
                  : optionIsSelected
                    ? "border-red-300 bg-red-50 text-red-800"
                    : "border-gray-200 bg-gray-50 text-gray-700",
              ].join(" ")}
            >
              <span className="mr-2 font-semibold">
                {String.fromCharCode(65 + optionIndex)}.
              </span>
              {option.optionText}
              {optionIsCorrect ? (
                <span className="ml-2 text-xs font-semibold">(Correct)</span>
              ) : null}
              {optionIsSelected ? (
                <span className="ml-2 text-xs font-semibold">(Selected)</span>
              ) : null}
            </div>
          );
        })}
      </div>

      {question?.explanation ? (
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Explanation
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-amber-900">
            {question.explanation}
          </p>
        </div>
      ) : null}
    </div>
  );
}

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

ReviewCard.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.shape({
    question: PropTypes.shape({
      _id: PropTypes.string,
      questionText: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          optionText: PropTypes.string,
        }),
      ),
      correctOptionIndex: PropTypes.number,
      explanation: PropTypes.string,
      subject: PropTypes.string,
      topic: PropTypes.string,
    }),
    userAnswer: PropTypes.shape({
      selectedOptionIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }),
  }).isRequired,
};

export default MockAttemptDetailPage;
