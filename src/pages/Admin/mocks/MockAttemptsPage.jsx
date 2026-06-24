import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaEye, FaSync } from "react-icons/fa";

import AttemptStatusBadge from "../../../components/mocks/AttemptStatusBadge";
import EmptyMockState from "../../../components/mocks/EmptyMockState";
import LoadingState from "../../../components/mocks/LoadingState";
import MockInfoCard from "../../../components/mocks/MockInfoCard";

import {
  getAdminMockTestById,
  getMockAttempts,
  getMockAttemptSummary,
} from "./mockAdminApi";

import {
  formatAccuracy,
  formatDateTime,
  formatDuration,
  formatScore,
} from "./mockFormatters";

function MockAttemptsPage() {
  const { mockTestId } = useParams();

  const [mockTest, setMockTest] = useState(null);
  const [summary, setSummary] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const filteredLabel = useMemo(() => {
    if (!statusFilter) return "All Attempts";

    const labels = {
      in_progress: "In Progress",
      paused: "Paused",
      submitted: "Submitted",
      auto_submitted: "Auto-submitted",
      disqualified: "Disqualified",
    };

    return labels[statusFilter] || statusFilter;
  }, [statusFilter]);

  async function loadData({ silent = false } = {}) {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [mockResponse, summaryResponse, attemptsResponse] =
        await Promise.all([
          getAdminMockTestById(mockTestId),
          getMockAttemptSummary(mockTestId),
          getMockAttempts(mockTestId, statusFilter),
        ]);

      setMockTest(mockResponse?.data || null);
      setSummary(summaryResponse?.data || null);
      setAttempts(
        Array.isArray(attemptsResponse?.data) ? attemptsResponse.data : [],
      );
    } catch (err) {
      setError(err.message || "Failed to load attempts.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId, statusFilter]);

  if (loading) {
    return <LoadingState message="Loading attempts..." />;
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

        <button
          type="button"
          onClick={() => loadData({ silent: true })}
          disabled={refreshing}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaSync className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <MockInfoCard mockTest={mockTest} />

      {summary ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Attempts"
            value={summary.participation?.totalAttempts || 0}
          />
          <StatCard
            label="Submitted"
            value={summary.participation?.submitted || 0}
            tone="green"
          />
          <StatCard
            label="In Progress"
            value={summary.participation?.inProgress || 0}
            tone="blue"
          />
          <StatCard
            label="Paused"
            value={summary.participation?.paused || 0}
            tone="amber"
          />
          <StatCard
            label="Disqualified"
            value={summary.participation?.disqualified || 0}
            tone="red"
          />

          <StatCard
            label="Highest Score"
            value={formatScore(summary.performance?.highestScore)}
          />
          <StatCard
            label="Lowest Score"
            value={formatScore(summary.performance?.lowestScore)}
          />
          <StatCard
            label="Average Score"
            value={formatScore(summary.performance?.averageScore)}
          />
          <StatCard
            label="Total Correct"
            value={summary.performance?.totalCorrect || 0}
          />
          <StatCard
            label="Total Wrong"
            value={summary.performance?.totalWrong || 0}
          />
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {filteredLabel}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Review participant attempts, scores and completion status.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 md:w-56"
          >
            <option value="">All statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="paused">Paused</option>
            <option value="submitted">Submitted</option>
            <option value="auto_submitted">Auto-submitted</option>
            <option value="disqualified">Disqualified</option>
          </select>
        </div>
      </div>

      {!attempts.length ? (
        <EmptyMockState
          title="No attempts found"
          message="No participant attempts are available for the selected filter."
        />
      ) : null}

      {attempts.length ? (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>#</Th>
                  <Th>Participant</Th>
                  <Th>Status</Th>
                  <Th>Score</Th>
                  <Th>Breakup</Th>
                  <Th>Time</Th>
                  <Th>Submitted</Th>
                  <Th align="right">Action</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {attempts.map((attempt, index) => (
                  <tr key={attempt.attemptId} className="hover:bg-gray-50">
                    <Td>{index + 1}</Td>

                    <Td>
                      <p className="font-semibold text-gray-900">
                        {attempt.username || "-"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {attempt.mobileMasked || ""}
                      </p>
                    </Td>

                    <Td>
                      <AttemptStatusBadge status={attempt.status} />
                    </Td>

                    <Td>
                      <p className="font-bold text-gray-900">
                        {formatScore(attempt.score)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Accuracy: {formatAccuracy(attempt.accuracy)}
                      </p>
                    </Td>

                    <Td>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>Correct: {attempt.correctCount || 0}</p>
                        <p>Wrong: {attempt.wrongCount || 0}</p>
                        <p>Unattempted: {attempt.unattemptedCount || 0}</p>
                      </div>
                    </Td>

                    <Td>{formatDuration(attempt.usedSeconds)}</Td>

                    <Td>{formatDateTime(attempt.submittedAt)}</Td>

                    <Td align="right">
                      <Link
                        to={`/adminDashboard/mocks/${mockTestId}/attempts/${attempt.attemptId}`}
                        className="inline-flex items-center gap-1 rounded border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <FaEye />
                        View
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, tone = "gray" }) {
  const toneClasses = {
    gray: "bg-gray-50 text-gray-900",
    green: "bg-green-50 text-green-800",
    blue: "bg-blue-50 text-blue-800",
    amber: "bg-amber-50 text-amber-800",
    red: "bg-red-50 text-red-800",
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
        "whitespace-nowrap px-4 py-3 align-top",
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
  tone: PropTypes.oneOf(["gray", "green", "blue", "amber", "red"]),
};

Th.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
};

Td.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
};

export default MockAttemptsPage;
