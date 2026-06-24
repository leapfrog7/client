import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FaArchive,
  FaClipboardList,
  FaEye,
  FaPen,
  FaPlus,
  FaRocket,
} from "react-icons/fa";

import EmptyMockState from "../../../components/mocks/EmptyMockState";
import LoadingState from "../../../components/mocks/LoadingState";
import MockStatusBadge from "../../../components/mocks/MockStatusBadge";
import ConfirmActionModal from "../../../components/mocks/ConfirmActionModal";

import {
  archiveMockTest,
  getAdminMockTests,
  publishMockTest,
} from "./mockAdminApi";

import { formatDateTime, getStoredStatusLabel } from "./mockFormatters";

function AdminMockTestsPage() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmState, setConfirmState] = useState({
    open: false,
    type: "",
    mockTest: null,
  });

  const stats = useMemo(() => {
    return {
      total: mockTests.length,
      draft: mockTests.filter((item) => item.status === "draft").length,
      published: mockTests.filter((item) => item.status === "published").length,
      active: mockTests.filter((item) => item.computedStatus === "active")
        .length,
      closed: mockTests.filter((item) => item.computedStatus === "closed")
        .length,
    };
  }, [mockTests]);

  async function loadMockTests() {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminMockTests();
      setMockTests(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err.message || "Failed to load mock tests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMockTests();
  }, []);

  function openPublishConfirm(mockTest) {
    setConfirmState({
      open: true,
      type: "publish",
      mockTest,
    });
  }

  function openArchiveConfirm(mockTest) {
    setConfirmState({
      open: true,
      type: "archive",
      mockTest,
    });
  }

  function closeConfirm() {
    if (actionLoading) return;

    setConfirmState({
      open: false,
      type: "",
      mockTest: null,
    });
  }

  async function handleConfirmAction() {
    if (!confirmState.mockTest?._id) return;

    try {
      setActionLoading(true);
      setError("");

      if (confirmState.type === "publish") {
        await publishMockTest(confirmState.mockTest._id);
      }

      if (confirmState.type === "archive") {
        await archiveMockTest(confirmState.mockTest._id);
      }

      closeConfirm();
      await loadMockTests();
    } catch (err) {
      setError(err.message || "Action failed.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Mock Test Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create, publish, archive and monitor LDCE SO/PS mock tests.
            </p>
          </div>

          <Link
            to="new"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <FaPlus />
            Create Mock Test
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Draft" value={stats.draft} />
          <StatCard label="Published" value={stats.published} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Closed" value={stats.closed} />
        </div>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? <LoadingState message="Loading mock tests..." /> : null}

      {!loading && !mockTests.length ? (
        <EmptyMockState
          title="No mock tests created"
          message="Create your first LDCE SO/PS mock test and then add questions to it."
          action={
            <Link
              to="new"
              className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <FaPlus />
              Create Mock Test
            </Link>
          }
        />
      ) : null}

      {!loading && mockTests.length ? (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Mock Test</Th>
                  <Th>Window</Th>
                  <Th>Questions</Th>
                  <Th>Status</Th>
                  <Th>Readiness</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 bg-white">
                {mockTests.map((mockTest) => (
                  <tr key={mockTest._id} className="hover:bg-gray-50">
                    <Td>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {mockTest.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {mockTest.examName}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Stored: {getStoredStatusLabel(mockTest.status)}
                        </p>
                      </div>
                    </Td>

                    <Td>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>
                          <span className="font-semibold">Start:</span>{" "}
                          {formatDateTime(mockTest.startAt)}
                        </p>
                        <p>
                          <span className="font-semibold">End:</span>{" "}
                          {formatDateTime(mockTest.endAt)}
                        </p>
                        <p>
                          {mockTest.durationMinutes} mins ·{" "}
                          {mockTest.totalQuestions} questions
                        </p>
                      </div>
                    </Td>

                    <Td>
                      <div className="font-semibold text-gray-800">
                        {mockTest.activeQuestionCount || 0}/
                        {mockTest.totalQuestions || 40}
                      </div>
                    </Td>

                    <Td>
                      <MockStatusBadge status={mockTest.computedStatus} />
                    </Td>

                    <Td>
                      {mockTest.isReadyToPublish ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Ready
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          Questions pending
                        </span>
                      )}
                    </Td>

                    <Td align="right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <IconLink
                          to={`${mockTest._id}/questions`}
                          title="Questions"
                          icon={<FaClipboardList />}
                        />

                        <IconLink
                          to={`${mockTest._id}/attempts`}
                          title="Attempts"
                          icon={<FaEye />}
                        />

                        {mockTest.computedStatus !== "active" &&
                        mockTest.computedStatus !== "closed" ? (
                          <IconLink
                            to={`${mockTest._id}/edit`}
                            title="Edit"
                            icon={<FaPen />}
                          />
                        ) : null}

                        {mockTest.status === "draft" ? (
                          <button
                            type="button"
                            onClick={() => openPublishConfirm(mockTest)}
                            className="inline-flex items-center gap-1 rounded border border-teal-200 px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                          >
                            <FaRocket />
                            Publish
                          </button>
                        ) : null}

                        {mockTest.status !== "archived" ? (
                          <button
                            type="button"
                            onClick={() => openArchiveConfirm(mockTest)}
                            className="inline-flex items-center gap-1 rounded border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            <FaArchive />
                            Archive
                          </button>
                        ) : null}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <ConfirmActionModal
        open={confirmState.open}
        title={
          confirmState.type === "publish"
            ? "Publish mock test"
            : "Archive mock test"
        }
        message={
          confirmState.type === "publish"
            ? `Publish "${confirmState.mockTest?.title}"? Users will be able to see this mock test as per its schedule.`
            : `Archive "${confirmState.mockTest?.title}"? It will be hidden from normal listing.`
        }
        confirmLabel={confirmState.type === "publish" ? "Publish" : "Archive"}
        danger={confirmState.type === "archive"}
        loading={actionLoading}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirm}
      />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
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

function IconLink({ to, title, icon }) {
  return (
    <Link
      to={to}
      title={title}
      className="inline-flex items-center gap-1 rounded border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
    >
      {icon}
      {title}
    </Link>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

Th.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
};

Td.propTypes = {
  children: PropTypes.node.isRequired,
  align: PropTypes.oneOf(["left", "right"]),
};

IconLink.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

export default AdminMockTestsPage;
