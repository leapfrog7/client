import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaEye,
  FaPlus,
  FaPowerOff,
  FaTrash,
} from "react-icons/fa";

import ConfirmActionModal from "../../../components/mocks/ConfirmActionModal";
import EmptyMockState from "../../../components/mocks/EmptyMockState";
import LoadingState from "../../../components/mocks/LoadingState";
import MockInfoCard from "../../../components/mocks/MockInfoCard";
import QuestionPreviewCard from "../../../components/mocks/QuestionPreviewCard";

import {
  deleteQuestion,
  getAdminMockTestById,
  getQuestionsByMockTest,
  toggleQuestionActive,
} from "./mockAdminApi";

function MockQuestionsPage() {
  const { mockTestId } = useParams();

  const [mockTest, setMockTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState({
    activeQuestionCount: 0,
    requiredQuestionCount: 40,
    isReadyToPublish: false,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewQuestion, setPreviewQuestion] = useState(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    type: "",
    question: null,
  });

  const groupedStats = useMemo(() => {
    const active = questions.filter((question) => question.isActive).length;
    const inactive = questions.length - active;

    return {
      total: questions.length,
      active,
      inactive,
    };
  }, [questions]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [mockResponse, questionResponse] = await Promise.all([
        getAdminMockTestById(mockTestId),
        getQuestionsByMockTest(mockTestId),
      ]);

      setMockTest(mockResponse?.data || null);
      setQuestions(
        Array.isArray(questionResponse?.data) ? questionResponse.data : [],
      );
      setMeta({
        activeQuestionCount: Number(questionResponse?.activeQuestionCount || 0),
        requiredQuestionCount: Number(
          questionResponse?.requiredQuestionCount || 40,
        ),
        isReadyToPublish: Boolean(questionResponse?.isReadyToPublish),
      });
    } catch (err) {
      setError(err.message || "Failed to load questions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  function openDeleteConfirm(question) {
    setConfirmState({
      open: true,
      type: "delete",
      question,
    });
  }

  function openToggleConfirm(question) {
    setConfirmState({
      open: true,
      type: "toggle",
      question,
    });
  }

  function closeConfirm() {
    if (actionLoading) return;

    setConfirmState({
      open: false,
      type: "",
      question: null,
    });
  }

  async function handleConfirmAction() {
    const questionId = confirmState.question?._id;

    if (!questionId) return;

    try {
      setActionLoading(true);
      setError("");

      if (confirmState.type === "delete") {
        await deleteQuestion(questionId);
      }

      if (confirmState.type === "toggle") {
        await toggleQuestionActive(questionId);
      }

      closeConfirm();
      await loadData();
    } catch (err) {
      setError(err.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Loading questions..." />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          to="/adminDashboard/mocks"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <FaArrowLeft />
          Back to Mock Tests
        </Link>

        <Link
          to={`/adminDashboard/mocks/${mockTestId}/questions/new`}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <FaPlus />
          Add Question
        </Link>
      </div>

      <MockInfoCard mockTest={mockTest} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Questions" value={groupedStats.total} />
        <StatCard label="Active" value={groupedStats.active} />
        <StatCard label="Inactive" value={groupedStats.inactive} />
        <StatCard
          label="Readiness"
          value={`${meta.activeQuestionCount}/${meta.requiredQuestionCount}`}
          tone={meta.isReadyToPublish ? "green" : "amber"}
        />
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {!questions.length ? (
        <EmptyMockState
          title="No questions added"
          message="Add questions before publishing this mock test."
          action={
            <Link
              to={`/adminDashboard/mocks/${mockTestId}/questions/new`}
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <FaPlus />
              Add Question
            </Link>
          }
        />
      ) : null}

      {questions.length ? (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>#</Th>
                  <Th>Question</Th>
                  <Th>Topic</Th>
                  <Th>Status</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {questions.map((question, index) => (
                  <tr key={question._id} className="hover:bg-gray-50">
                    <Td>{question.orderNo || index + 1}</Td>

                    <Td>
                      <p className="max-w-2xl whitespace-normal text-sm font-semibold leading-6 text-gray-900">
                        {question.questionText}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Correct option:{" "}
                        <span className="font-semibold">
                          {String.fromCharCode(
                            65 + Number(question.correctOptionIndex || 0),
                          )}
                        </span>
                      </p>
                    </Td>

                    <Td>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-700">
                          {question.subject || "-"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {question.topic || "-"}
                        </p>
                      </div>
                    </Td>

                    <Td>
                      {question.isActive ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Inactive
                        </span>
                      )}
                    </Td>

                    <Td align="right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewQuestion(question)}
                          className="inline-flex items-center gap-1 rounded border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <FaEye />
                          Preview
                        </button>

                        <Link
                          to={`/adminDashboard/mocks/${mockTestId}/questions/${question._id}/edit`}
                          className="inline-flex items-center gap-1 rounded border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          <FaEdit />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => openToggleConfirm(question)}
                          className="inline-flex items-center gap-1 rounded border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                        >
                          <FaPowerOff />
                          {question.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeleteConfirm(question)}
                          className="inline-flex items-center gap-1 rounded border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {previewQuestion ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Question Preview
              </h3>
              <button
                type="button"
                onClick={() => setPreviewQuestion(null)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            <QuestionPreviewCard question={previewQuestion} showAnswer />
          </div>
        </div>
      ) : null}

      <ConfirmActionModal
        open={confirmState.open}
        title={
          confirmState.type === "delete"
            ? "Delete question"
            : confirmState.question?.isActive
              ? "Deactivate question"
              : "Activate question"
        }
        message={
          confirmState.type === "delete"
            ? "Delete this question permanently?"
            : confirmState.question?.isActive
              ? "Deactivate this question? It will not count towards active question readiness."
              : "Activate this question? It will count towards mock test readiness."
        }
        confirmLabel={
          confirmState.type === "delete"
            ? "Delete"
            : confirmState.question?.isActive
              ? "Deactivate"
              : "Activate"
        }
        danger={confirmState.type === "delete"}
        loading={actionLoading}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirm}
      />
    </div>
  );
}

function StatCard({ label, value, tone = "gray" }) {
  const toneClasses = {
    gray: "bg-gray-50 text-gray-900",
    green: "bg-green-50 text-green-800",
    amber: "bg-amber-50 text-amber-800",
  };

  return (
    <div
      className={`rounded-lg border p-4 ${toneClasses[tone] || toneClasses.gray}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Th({ children, align = "left" }) {
  return (
    <th
      className={[
        "whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500",
        align === "right" ? "text-right" : "text-left",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return (
    <td
      className={[
        "px-4 py-3 align-top",
        align === "right" ? "text-right" : "text-left",
      ].join(" ")}
    >
      {children}
    </td>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tone: PropTypes.oneOf(["gray", "green", "amber"]),
};

Th.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
};

Td.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
};

export default MockQuestionsPage;
