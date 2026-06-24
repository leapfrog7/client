import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaExclamationTriangle,
  FaMedal,
  FaRedo,
  FaSearch,
  FaTrophy,
} from "react-icons/fa";

import EmptyMockState from "../../components/mocks/EmptyMockState";
import LoadingState from "../../components/mocks/LoadingState";

import { getLeaderboard } from "./mockPublicApi";

import {
  formatDateTime,
  formatDuration,
  formatScore,
} from "../Admin/mocks/mockFormatters";

const leaderboardEntryShape = PropTypes.shape({
  attemptId: PropTypes.string,
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  displayRank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  username: PropTypes.string,
  mobileMasked: PropTypes.string,
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  correctCount: PropTypes.number,
  wrongCount: PropTypes.number,
  unattemptedCount: PropTypes.number,
  usedSeconds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  submittedAt: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
});

function MockLeaderboardPage() {
  const { mockTestId } = useParams();

  const [mockTest, setMockTest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

  async function loadLeaderboard({ silent = false } = {}) {
    try {
      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getLeaderboard(mockTestId);

      setMockTest(response?.mockTest || response?.data?.mockTest || null);

      setLeaderboard(
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.leaderboard)
            ? response.data.leaderboard
            : [],
      );

      setSummary(response?.summary || response?.data?.summary || null);
    } catch (err) {
      setError(err.message || "Failed to load leaderboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTestId]);

  const rankedLeaderboard = useMemo(() => {
    return leaderboard.map((entry, index) => ({
      ...entry,
      displayRank: Number(entry.rank || index + 1),
    }));
  }, [leaderboard]);

  const topThree = useMemo(() => {
    return rankedLeaderboard.slice(0, 3);
  }, [rankedLeaderboard]);

  const filteredLeaderboard = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return rankedLeaderboard;

    return rankedLeaderboard.filter((entry) => {
      const name = String(entry.username || "").toLowerCase();
      const mobile = String(entry.mobileMasked || "").toLowerCase();
      const rank = String(entry.displayRank || "");

      return (
        name.includes(query) || mobile.includes(query) || rank.includes(query)
      );
    });
  }, [rankedLeaderboard, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLeaderboard.length / PAGE_SIZE),
  );

  const paginatedLeaderboard = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLeaderboard.slice(start, start + PAGE_SIZE);
  }, [filteredLeaderboard, currentPage]);

  function updateSearch(value) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function goToPage(page) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center gap-2 sm:justify-between">
          <Link
            to="/mock-tests"
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 sm:flex-none sm:px-4 sm:text-sm"
          >
            <FaArrowLeft className="shrink-0" />
            <span className="truncate">Back</span>
            <span className="hidden sm:inline">to Mock Tests</span>
          </Link>

          <button
            type="button"
            onClick={() => loadLeaderboard({ silent: true })}
            disabled={loading || refreshing}
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-4 sm:text-sm"
          >
            <FaRedo
              className={["shrink-0", refreshing ? "animate-spin" : ""].join(
                " ",
              )}
            />
            <span className="truncate">
              {refreshing ? "Refreshing..." : "Refresh"}
            </span>
          </button>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-6 text-white sm:px-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-wide text-amber-300">
                  Leaderboard
                </p>

                <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
                  {mockTest?.title || "Mock Test Leaderboard"}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-200">
                  Rankings are displayed after the mock test window closes.
                  Disqualified attempts are excluded. Higher score ranks first;
                  tie-breakers use correct answers, wrong answers, time used and
                  submission time.
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl text-amber-300 shadow-sm">
                <FaTrophy />
              </div>
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium leading-6 text-red-700 shadow-sm">
            <div className="flex gap-3">
              <FaExclamationTriangle className="mt-1 shrink-0" />
              <div>
                <p className="font-black">Unable to load leaderboard.</p>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? <LoadingState message="Loading leaderboard..." /> : null}

        {!loading && summary ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Ranked"
              value={summary.totalRanked || leaderboard.length}
            />

            <StatCard
              label="Highest Score"
              value={formatScore(summary.highestScore)}
              tone="amber"
            />

            <StatCard
              label="Average Score"
              value={formatScore(summary.averageScore)}
            />

            <StatCard
              label="Closed At"
              value={formatDateTime(mockTest?.endAt)}
            />
          </div>
        ) : null}

        {!loading && !leaderboard.length ? (
          <EmptyMockState
            title="Leaderboard not available"
            message="No ranked attempts are available yet, or the test window has not closed."
          />
        ) : null}

        {!loading && leaderboard.length ? (
          <section className="space-y-5">
            <TopRankers entries={topThree} />

            <LeaderboardToolbar
              searchTerm={searchTerm}
              onSearchChange={updateSearch}
              totalCount={rankedLeaderboard.length}
              filteredCount={filteredLeaderboard.length}
            />

            {!filteredLeaderboard.length ? (
              <EmptyMockState
                title="No matching participant found"
                message="Try searching with a different name, masked mobile number, or rank."
              />
            ) : (
              <>
                <DesktopLeaderboardTable leaderboard={paginatedLeaderboard} />
                <MobileLeaderboardCards leaderboard={paginatedLeaderboard} />

                <LeaderboardPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredLeaderboard.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={goToPage}
                />
              </>
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}

function DesktopLeaderboardTable({ leaderboard }) {
  return (
    <section className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-black text-slate-950">
          Ranked Participants
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Compact public leaderboard view.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <Th>Rank</Th>
              <Th>Participant</Th>
              <Th>Score</Th>
              <Th>Breakup</Th>
              <Th>Time</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {leaderboard.map((entry, index) => (
              <tr
                key={
                  entry.attemptId ||
                  `${entry.username}-${entry.displayRank}-${index}`
                }
                className="transition hover:bg-slate-50"
              >
                <Td>
                  <RankBadge rank={entry.displayRank} />
                </Td>

                <Td>
                  <div className="min-w-[180px]">
                    <p className="font-black text-slate-950">
                      {entry.username || "-"}
                    </p>

                    {entry.mobileMasked ? (
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {entry.mobileMasked}
                      </p>
                    ) : null}
                  </div>
                </Td>

                <Td>
                  <p className="text-base font-black text-slate-950">
                    {formatScore(entry.score)}
                  </p>
                </Td>

                <Td>
                  <BreakupInline entry={entry} />
                </Td>

                <Td>
                  <UsedTime value={entry.usedSeconds} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MobileLeaderboardCards({ leaderboard }) {
  return (
    <section className="space-y-3 md:hidden">
      {leaderboard.map((entry, index) => (
        <article
          key={
            entry.attemptId || `${entry.username}-${entry.displayRank}-${index}`
          }
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <RankBadge rank={entry.displayRank} />

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">
                  {entry.username || "-"}
                </p>

                {entry.mobileMasked ? (
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {entry.mobileMasked}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
                Score
              </p>
              <p className="text-lg font-black text-slate-950">
                {formatScore(entry.score)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniStat label="Correct" value={entry.correctCount || 0} />
            <MiniStat label="Wrong" value={entry.wrongCount || 0} />
            <MiniStat label="Left" value={entry.unattemptedCount || 0} />
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <span className="font-bold">Time Used</span>
            <UsedTime value={entry.usedSeconds} />
          </div>
        </article>
      ))}
    </section>
  );
}

function TopRankers({ entries }) {
  if (!entries.length) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-slate-950">Top Rankers</h2>
          <p className="mt-1 text-sm text-slate-500">
            First three ranks are highlighted separately.
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <FaTrophy />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {entries.map((entry, index) => (
          <TopRankerCard
            key={
              entry.attemptId ||
              `${entry.username}-${entry.displayRank}-${index}`
            }
            entry={entry}
          />
        ))}
      </div>
    </section>
  );
}

TopRankers.propTypes = {
  entries: PropTypes.arrayOf(leaderboardEntryShape).isRequired,
};

function TopRankerCard({ entry }) {
  const rank = Number(entry.displayRank || entry.rank || 0);

  const rankClasses = {
    1: "border-amber-300 bg-amber-50",
    2: "border-slate-300 bg-slate-50",
    3: "border-orange-300 bg-orange-50",
  };

  return (
    <article
      className={[
        "rounded-2xl border p-4",
        rankClasses[rank] || "border-slate-200 bg-slate-50",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <RankBadge rank={rank} />
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">
              Rank {rank}
            </p>
          </div>

          <p className="mt-3 truncate text-sm font-black text-slate-950">
            {entry.username || "-"}
          </p>

          {entry.mobileMasked ? (
            <p className="mt-1 text-xs font-medium text-slate-500">
              {entry.mobileMasked}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Score
          </p>
          <p className="text-xl font-black text-slate-950">
            {formatScore(entry.score)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <BreakupInline entry={entry} />
      </div>
    </article>
  );
}

TopRankerCard.propTypes = {
  entry: leaderboardEntryShape.isRequired,
};

function LeaderboardToolbar({
  searchTerm,
  onSearchChange,
  totalCount,
  filteredCount,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-black text-slate-950">
            Ranked Participants
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredCount} of {totalCount} ranked participants.
          </p>
        </div>

        <div className="relative w-full md:max-w-sm">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, mobile or rank"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>
    </section>
  );
}

LeaderboardToolbar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired,
};

function LeaderboardPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-600">
        Showing {startItem}-{endItem} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          <FaChevronLeft />
          Previous
        </button>

        <div className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-black text-slate-700">
          {currentPage}/{totalPages}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
        >
          Next
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

LeaderboardPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

function RankBadge({ rank }) {
  const numericRank = Number(rank);
  const isTopThree = numericRank <= 3;

  const topRankClasses = {
    1: "border-amber-300 bg-amber-100 text-amber-900",
    2: "border-slate-300 bg-slate-100 text-slate-800",
    3: "border-orange-300 bg-orange-50 text-orange-800",
  };

  return (
    <span
      className={[
        "inline-flex h-10 min-w-10 shrink-0 items-center justify-center gap-1 rounded-full border px-3 text-sm font-black",
        isTopThree
          ? topRankClasses[numericRank]
          : "border-slate-200 bg-slate-50 text-slate-700",
      ].join(" ")}
    >
      {isTopThree ? <FaMedal className="text-xs" /> : null}
      {numericRank || rank}
    </span>
  );
}

RankBadge.propTypes = {
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function StatCard({ label, value, tone = "gray" }) {
  const toneClasses = {
    gray: "border-slate-200 bg-white text-slate-950",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div
      className={[
        "rounded-2xl border px-4 py-4 shadow-sm",
        toneClasses[tone] || toneClasses.gray,
      ].join(" ")}
    >
      <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value || "-"}</p>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
  tone: PropTypes.oneOf(["gray", "amber"]),
};

function BreakupInline({ entry }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-bold">
      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-teal-800">
        C {entry.correctCount || 0}
      </span>
      <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-800">
        W {entry.wrongCount || 0}
      </span>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
        U {entry.unattemptedCount || 0}
      </span>
    </div>
  );
}

function UsedTime({ value }) {
  const seconds = Number(value || 0);

  return (
    <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
      <FaClock className="text-slate-400" />
      {seconds ? formatDuration(seconds) : "-"}
    </span>
  );
}

UsedTime.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

MiniStat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function Th({ children }) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-black uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

Th.propTypes = {
  children: PropTypes.node.isRequired,
};

function Td({ children }) {
  return (
    <td className="whitespace-nowrap px-5 py-4 align-middle text-slate-700">
      {children}
    </td>
  );
}

Td.propTypes = {
  children: PropTypes.node.isRequired,
};

BreakupInline.propTypes = {
  entry: leaderboardEntryShape.isRequired,
};

MobileLeaderboardCards.propTypes = {
  leaderboard: PropTypes.arrayOf(leaderboardEntryShape).isRequired,
};

DesktopLeaderboardTable.propTypes = {
  leaderboard: PropTypes.arrayOf(leaderboardEntryShape).isRequired,
};

export default MockLeaderboardPage;
