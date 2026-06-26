import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaClipboardList,
  FaExclamationTriangle,
  FaPlay,
  FaRedo,
  FaTrophy,
  FaSyncAlt,
} from "react-icons/fa";

import EmptyMockState from "../../components/mocks/EmptyMockState";
import LoadingState from "../../components/mocks/LoadingState";
import MockStatusBadge from "../../components/mocks/MockStatusBadge";

import { getPublicMockTestById, getPublicMockTests } from "./mockPublicApi";
import {
  formatDateTime,
  getComputedStatusLabel,
} from "../Admin/mocks/mockFormatters";

function MockTestsPage() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshingId, setRefreshingId] = useState("");
  const [refreshingAll, setRefreshingAll] = useState(false);

  async function loadMockTests({ silent = false } = {}) {
    try {
      if (silent) {
        setRefreshingAll(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getPublicMockTests();
      setMockTests(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "Failed to load mock tests.");
    } finally {
      setLoading(false);
      setRefreshingAll(false);
    }
  }

  useEffect(() => {
    loadMockTests();
  }, []);

  async function refreshSingleMockTest(mockTestId) {
    try {
      setRefreshingId(mockTestId);
      setError("");

      const response = await getPublicMockTestById(mockTestId);
      const updatedMockTest = response?.data;

      if (!updatedMockTest?._id) {
        throw new Error("Mock test could not be refreshed.");
      }

      setMockTests((prev) =>
        prev.map((item) => (item._id === mockTestId ? updatedMockTest : item)),
      );
    } catch (err) {
      setError(err.message || "Failed to refresh mock test status.");
    } finally {
      setRefreshingId("");
    }
  }

  const summary = useMemo(() => {
    return mockTests.reduce(
      (acc, mockTest) => {
        const status = mockTest.computedStatus;

        if (status === "active") acc.active += 1;
        if (status === "upcoming") acc.upcoming += 1;
        if (status === "closed") acc.closed += 1;

        return acc;
      },
      {
        active: 0,
        upcoming: 0,
        closed: 0,
      },
    );
  }, [mockTests]);

  return (
    <main className="min-h-screen bg-white mt-6 mb-12">
      <div className="mx-auto max-w-6xl xlg:max-w-7xl">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-6 text-white sm:px-6 sm:py-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-200">
                  LDCE SO/PS Mock Tests
                </p>

                <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
                  Practice with timed mock tests
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-200">
                  Attempt mock tests within the notified test window. Scores are
                  shown immediately after submission. Leaderboards are displayed
                  after the test window closes.
                </p>
              </div>

              <div className="grid gap-3 grid-cols-3 lg:min-w-[380px]">
                <HeroStat label="Active" value={summary.active} />
                <HeroStat label="Upcoming" value={summary.upcoming} />
                <HeroStat label="Closed" value={summary.closed} />
              </div>
            </div>
            <div className="flex justify-end mt-2 md:mt-0">
              <button
                type="button"
                onClick={() => loadMockTests({ silent: true })}
                disabled={loading || refreshingAll}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
              >
                <FaSyncAlt className={refreshingAll ? "animate-spin" : ""} />
                {refreshingAll ? "Refreshing..." : "Refresh All"}
              </button>
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:grid-cols-3 sm:px-6">
            <PatternItem label="Questions" value="40" />
            <PatternItem label="Duration" value="30 minutes" />
            <PatternItem label="Marking" value="+1.25 / -1⁄3" />
          </div>
        </section>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium leading-6 text-red-700 shadow-sm">
            <div className="flex gap-3">
              <FaExclamationTriangle className="mt-1 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold">Unable to load mock tests.</p>
                <p className="mt-1">{error}</p>

                <button
                  type="button"
                  onClick={loadMockTests}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                >
                  <FaRedo />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? <LoadingState message="Loading mock tests..." /> : null}

        {!loading && !mockTests.length ? (
          <EmptyMockState
            title="No mock tests available"
            message="There is no active or upcoming mock test available at present."
          />
        ) : null}

        {!loading && mockTests.length ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 mx-4 md:mx-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="mt-4">
                <h2 className="text-lg font-black text-slate-950">
                  Available Mock Tests
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select an active test to start or resume your attempt.
                </p>
              </div>

              <p className="text-sm font-semibold text-slate-500">
                {mockTests.length} mock test{mockTests.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="grid gap-4">
              {mockTests.map((mockTest) => (
                <MockTestCard
                  key={mockTest._id}
                  mockTest={mockTest}
                  refreshing={refreshingId === mockTest._id}
                  onRefresh={() => refreshSingleMockTest(mockTest._id)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function MockTestCard({ mockTest, refreshing, onRefresh }) {
  const status = mockTest.computedStatus;
  const canStart = status === "active";
  const canViewLeaderboard = status === "closed";

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="border-b border-slate-100 px-3 py-4 sm:px-5 bg-slate-100">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ">
          <div className="min-w-0 ">
            <div className="flex flex-wrap items-center gap-2 ">
              <h2 className="text-lg font-black leading-tight  text-slate-950 sm:text-xl">
                {mockTest.title || "Mock Test"}
              </h2>

              <MockStatusBadge status={status} />
            </div>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {mockTest.examName || "LDCE SO/PS conducted by UPSC"}
            </p>
          </div>
        </div>

        {mockTest.description ? (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
            {mockTest.description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 py-2">
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <InfoLine
            icon={<FaCalendarAlt />}
            label="Starts"
            value={formatDateTime(mockTest.startAt)}
          />

          <InfoLine
            icon={<FaCalendarAlt />}
            label="Ends"
            value={formatDateTime(mockTest.endAt)}
          />

          <InfoLine
            icon={<FaClock />}
            label="Duration"
            value={`${mockTest.durationMinutes || 30} minutes`}
          />

          <InfoLine
            icon={<FaClipboardList />}
            label="Questions"
            value={`${mockTest.totalQuestions || 40}`}
          />
        </div>

        {/* <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ScoreBox
            label="Correct"
            value={`+${mockTest.correctMarks ?? 1.25}`}
            tone="positive"
          />

          <ScoreBox
            label="Wrong"
            value={`-${mockTest.negativeMarks ?? 0.4166667}`}
            tone="negative"
          />

          <ScoreBox label="Unattempted" value="0" tone="neutral" />
        </div> */}

        <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm leading-6 text-slate-700">
          <p>
            <span className="font-bold text-slate-900">Current status:</span>{" "}
            {getComputedStatusLabel(status)}
          </p>

          <p className="mt-1">
            Correct answers carry {mockTest.correctMarks ?? 1.25} marks. Wrong
            answers attract negative marking of{" "}
            {mockTest.negativeMarks ?? 0.4166} marks.
          </p>
          <div className="mt-auto pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {/* Primary action */}
              {canStart ? (
                <Link
                  to={`/mock-tests/${mockTest._id}/start`}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3.5 text-sm font-black text-white shadow-sm shadow-teal-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 sm:w-auto sm:min-w-[190px]"
                >
                  <FaPlay className="text-xs transition-transform duration-200 group-hover:scale-110" />
                  Start / Resume Test
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-200 px-5 py-3.5 text-sm font-black text-slate-500 shadow-inner sm:w-auto sm:min-w-[190px]"
                >
                  <FaPlay className="text-xs" />
                  {status === "upcoming" ? "Not Started Yet" : "Test Closed"}
                </button>
              )}

              {/* Secondary actions */}
              <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={refreshing}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-black text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm sm:w-auto"
                >
                  <FaSyncAlt
                    className={refreshing ? "animate-spin text-xs" : "text-xs"}
                  />
                  {refreshing ? "Refreshing..." : "Refresh Status"}
                </button>

                {canViewLeaderboard ? (
                  <Link
                    to={`/mock-tests/${mockTest._id}/leaderboard`}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3.5 text-sm font-black text-amber-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 sm:w-auto"
                  >
                    <FaTrophy className="text-xs transition-transform duration-200 group-hover:scale-110" />
                    Leaderboard
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Small helper text */}
            {canStart ? (
              <p className="mt-3 text-xs font-medium leading-5 text-slate-500">
                If the test room is busy, please wait a few seconds and try
                again.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

MockTestCard.propTypes = {
  mockTest: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    examName: PropTypes.string,
    description: PropTypes.string,
    computedStatus: PropTypes.string,
    startAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    endAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    durationMinutes: PropTypes.number,
    totalQuestions: PropTypes.number,
    correctMarks: PropTypes.number,
    negativeMarks: PropTypes.number,
  }).isRequired,
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

function HeroStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-300">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

HeroStat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

function PatternItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

PatternItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

function InfoLine({ icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-bold leading-5 text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

InfoLine.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

function ScoreBox({ label, value, tone }) {
  const toneClasses = {
    positive: "border-teal-200 bg-teal-50 text-teal-800",
    negative: "border-red-200 bg-red-50 text-red-800",
    neutral: "border-slate-200 bg-slate-50 text-slate-800",
  };

  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3",
        toneClasses[tone] || toneClasses.neutral,
      ].join(" ")}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide opacity-75">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

ScoreBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tone: PropTypes.oneOf(["positive", "negative", "neutral"]).isRequired,
};

export default MockTestsPage;
