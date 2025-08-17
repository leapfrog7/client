// src/pages/Admin/RevenueManagement.jsx
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = "https://server-v4dy.onrender.com/api/v1/";
// const BASE_URL = "http://localhost:5000/api/v1/";

export default function RevenueManagement() {
  const token = localStorage.getItem("jwtToken");

  // auth gate (simple; you may wrap with AdminGuard route anyway)
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    try {
      const payload = JSON.parse(atob((token || "").split(".")[1] || ""));
      setIsAdmin(
        String(payload?.userType || "").toLowerCase() === "admin" &&
          (!payload?.exp || Date.now() < payload.exp * 1000)
      );
    } catch {
      setIsAdmin(false);
    }
  }, [token]);

  // data + metrics
  const [rows, setRows] = useState([]);
  const [metrics, setMetrics] = useState({
    baselineAmount: 0,
    baselineAnchor: null,
    totalConfirmed: 0,
    pending: 0,
    transactionsCount: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  // UI state
  const [tab, setTab] = useState("pending"); // 'pending' | 'confirmed' | 'all'
  const [search, setSearch] = useState("");

  // modals
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [renewTarget, setRenewTarget] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const [adjustTarget, setAdjustTarget] = useState(null);

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  async function fetchAll() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}revenue`, {
        params: { includeMetrics: true },
        headers,
      });
      const { rows: rws = data, metrics: m = {} } = data.rows
        ? data
        : { rows: data, metrics: {} };
      setRows(Array.isArray(rws) ? rws : []);
      setMetrics({
        baselineAmount: m.baselineAmount || 0,
        baselineAnchor: m.baselineAnchor || null,
        totalConfirmed: m.totalConfirmed ?? 0,
        pending: m.pending ?? 0,
        transactionsCount: m.transactionsCount ?? 0,
        activeUsers: m.activeUsers ?? 0,
      });
    } catch (e) {
      console.error("Fetch revenue failed", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // derived
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = rows.filter((r) => {
      if (tab === "pending" && r.confirmed) return false;
      if (tab === "confirmed" && !r.confirmed) return false;
      return true;
    });
    if (!q) return list;
    return list.filter((r) => (r.userId?.name || "").toLowerCase().includes(q));
  }, [rows, search, tab]);

  // actions
  // async function createPending(userId, amount, note, reference) {
  //   try {
  //     setBusyId("create");
  //     await axios.post(
  //       `${BASE_URL}revenue`,
  //       { userId, amount, note, reference },
  //       { headers }
  //     );
  //     await fetchAll();
  //   } catch (e) {
  //     console.error("Create pending failed", e);
  //   } finally {
  //     setBusyId(null);
  //   }
  // }

  async function editPending(id, amount, note, reference) {
    try {
      setBusyId(id);
      await axios.patch(
        `${BASE_URL}revenue/${id}`,
        {
          ...(amount !== undefined ? { amount: Number(amount) } : {}),
          ...(note !== undefined ? { note } : {}),
          ...(reference !== undefined ? { reference } : {}),
        },
        { headers }
      );
      await fetchAll();
    } catch (e) {
      console.error("Edit pending failed", e);
    } finally {
      setBusyId(null);
    }
  }

  async function confirm(id, amount) {
    try {
      setBusyId(id);
      await axios.post(
        `${BASE_URL}revenue/${id}/confirm`,
        amount !== undefined ? { amount: Number(amount) } : {},
        { headers }
      );
      await fetchAll();
    } catch (e) {
      console.error("Confirm failed", e);
    } finally {
      setBusyId(null);
      setConfirmTarget(null);
    }
  }

  async function renew(userId, amount, note, reference) {
    try {
      setBusyId("renew");
      await axios.post(
        `${BASE_URL}revenue/renew`,
        { userId, amount: Number(amount), note, reference },
        { headers }
      );
      await fetchAll();
    } catch (e) {
      console.error("Renew failed", e);
    } finally {
      setBusyId(null);
      setRenewTarget(null);
    }
  }

  async function refund(id, mode, amount, note, reference) {
    try {
      setBusyId(id);
      await axios.post(
        `${BASE_URL}revenue/${id}/refund`,
        {
          mode, // "remove" | "mark"
          ...(amount ? { amount: Number(amount) } : {}),
          ...(note ? { note } : {}),
          ...(reference ? { reference } : {}),
        },
        { headers }
      );
      await fetchAll();
    } catch (e) {
      console.error("Refund failed", e);
    } finally {
      setBusyId(null);
      setRefundTarget(null);
    }
  }

  async function adjust(id, amount, note, reference) {
    try {
      setBusyId(id);
      await axios.post(
        `${BASE_URL}revenue/${id}/adjust`,
        { amount: Number(amount), note, reference },
        { headers }
      );
      await fetchAll();
    } catch (e) {
      console.error("Adjust failed", e);
    } finally {
      setBusyId(null);
      setAdjustTarget(null);
    }
  }

  if (!isAdmin) {
    return (
      <div className="p-8 mx-auto flex flex-col text-center gap-4 ">
        <span className="text-3xl bg-red-100 text-red-800 py-6 px-4 rounded">
          Unauthorized Access
        </span>
        <Link to="/" className="text-blue-600 text-xl underline">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center text-amber-600 tracking-wide">
        Revenue Management
      </h2>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 my-4">
        <StatCard
          title="Total Revenue"
          value={`₹${metrics.totalConfirmed}`}
          cls="from-cyan-100 to-blue-200"
          text="text-blue-800"
        />
        <StatCard
          title="Pending Revenue"
          value={`₹${metrics.pending}`}
          cls="from-amber-200 to-yellow-400"
          text="text-yellow-700"
        />
        <StatCard
          title="Transactions"
          value={metrics.transactionsCount}
          cls="from-green-300 to-cyan-400"
          text="text-green-700"
        />
        <StatCard
          title="Active Users"
          value={metrics.activeUsers}
          cls="from-rose-200 to-pink-400"
          text="text-purple-700"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 my-4">
        <div className="inline-flex rounded-lg border overflow-hidden">
          {["pending", "confirmed", "all"].map((t) => (
            <button
              key={t}
              className={`px-3 py-1.5 text-sm capitalize ${
                tab === t
                  ? "bg-teal-600 text-white"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:max-w-sm">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M15 11a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by user name"
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="relative bg-white border rounded-lg overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            Loading…
          </div>
        )}
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Name</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  No records.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <Row
                key={r._id}
                r={r}
                busy={busyId === r._id || loading}
                onConfirm={() => setConfirmTarget(r)}
                onRenew={() => setRenewTarget(r.userId)}
                onRefund={() => setRefundTarget(r)}
                onAdjust={() => setAdjustTarget(r)}
                onEditPending={(payload) =>
                  editPending(
                    r._id,
                    payload.amount,
                    payload.note,
                    payload.reference
                  )
                }
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {confirmTarget && (
        <ConfirmModal
          entry={confirmTarget}
          onClose={() => setConfirmTarget(null)}
          onConfirm={(amount) => confirm(confirmTarget._id, amount)}
        />
      )}
      {renewTarget && (
        <RenewModal
          user={renewTarget}
          onClose={() => setRenewTarget(null)}
          onRenew={(amount, note, reference) =>
            renew(renewTarget._id || renewTarget, amount, note, reference)
          }
        />
      )}
      {refundTarget && (
        <RefundModal
          entry={refundTarget}
          onClose={() => setRefundTarget(null)}
          onRefund={(mode, amount, note, reference) =>
            refund(refundTarget._id, mode, amount, note, reference)
          }
        />
      )}
      {adjustTarget && (
        <AdjustModal
          entry={adjustTarget}
          onClose={() => setAdjustTarget(null)}
          onAdjust={(amount, note, reference) =>
            adjust(adjustTarget._id, amount, note, reference)
          }
        />
      )}
    </div>
  );
}

/* -------------------- UI helpers -------------------- */
function Th({ children }) {
  return (
    <th className="px-3 py-2 text-left font-semibold border-b">{children}</th>
  );
}
Th.propTypes = { children: PropTypes.node };

function Td({ children }) {
  return <td className="px-3 py-2 border-b">{children}</td>;
}
Td.propTypes = { children: PropTypes.node };

function StatCard({ title, value, cls, text }) {
  return (
    <div
      className={`bg-gradient-to-tl ${cls} p-4 rounded-lg shadow-sm text-center`}
    >
      <h3 className="text-sm md:text-base font-semibold">{title}</h3>
      <p className={`text-lg md:text-xl font-bold ${text}`}>{value}</p>
    </div>
  );
}
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  cls: PropTypes.string,
  text: PropTypes.string,
};
StatCard.defaultProps = { cls: "", text: "" };

/* -------------------- Table Row -------------------- */
function Row({
  r,
  busy,
  onConfirm,
  onRenew,
  onRefund,
  onAdjust,
  onEditPending,
}) {
  // const refunded = false; // history is represented as negative entries; we keep simple badges

  return (
    <tr className="hover:bg-gray-50">
      <Td>{r.userId?.name || "—"}</Td>
      <Td>{`₹${Number(r.amount || 0)}`}</Td>
      <Td>
        <span
          className={[
            "px-2 py-0.5 rounded-full text-xs font-semibold",
            r.confirmed
              ? "bg-green-200 text-green-800"
              : "bg-yellow-200 text-yellow-800",
          ].join(" ")}
        >
          {r.confirmed ? "Confirmed" : "Pending"}
        </span>
      </Td>
      <Td>{new Date(r.createdAt).toLocaleString()}</Td>
      <Td>
        <div className="flex flex-wrap gap-2">
          {!r.confirmed ? (
            <>
              <button
                className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                onClick={onConfirm}
                disabled={busy}
                title="Confirm"
              >
                Confirm
              </button>
              <InlineEditPending r={r} disabled={busy} onSave={onEditPending} />
            </>
          ) : (
            <>
              <button
                className="px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                onClick={onRenew}
                disabled={busy}
                title="Renew"
              >
                Renew
              </button>
              <button
                className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={onRefund}
                disabled={busy}
                title="Refund"
              >
                Refund
              </button>
              <button
                className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={onAdjust}
                disabled={busy}
                title="Adjustment"
              >
                Adjust
              </button>
            </>
          )}
        </div>
      </Td>
    </tr>
  );
}
Row.propTypes = {
  r: PropTypes.object.isRequired,
  busy: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onRenew: PropTypes.func.isRequired,
  onRefund: PropTypes.func.isRequired,
  onAdjust: PropTypes.func.isRequired,
  onEditPending: PropTypes.func.isRequired,
};

/* -------------------- Inline edit (pending only) -------------------- */
function InlineEditPending({ r, disabled, onSave }) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(Number(r.amount || 0));
  const [note, setNote] = useState(r.note || "");
  const [reference, setReference] = useState(r.reference || "");

  return editing ? (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        min="0"
        step="1"
        className="w-24 border rounded px-2 py-1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        placeholder="Note"
        className="w-40 border rounded px-2 py-1"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={disabled}
      />
      <input
        type="text"
        placeholder="Reference"
        className="w-40 border rounded px-2 py-1"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        disabled={disabled}
      />
      <button
        className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={() => {
          onSave({ amount, note, reference });
          setEditing(false);
        }}
        disabled={disabled}
      >
        Save
      </button>
      <button
        className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
        onClick={() => setEditing(false)}
        disabled={disabled}
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      className="px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
      onClick={() => setEditing(true)}
      disabled={disabled}
      title="Edit pending"
    >
      Edit
    </button>
  );
}
InlineEditPending.propTypes = {
  r: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
};

/* -------------------- Confirm Modal -------------------- */
function ConfirmModal({ entry, onClose, onConfirm }) {
  const [amount, setAmount] = useState(
    Number(entry.amount || 0) > 0 ? Number(entry.amount) : 999
  );
  return (
    <Modal onClose={onClose} title="Confirm Payment">
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Confirm payment for <b>{entry.userId?.name || "—"}</b>
        </p>
        <label className="block text-sm">
          Amount
          <input
            type="number"
            className="mt-1 w-full border rounded px-2 py-1"
            value={amount}
            min="0"
            step="1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
            onClick={() => onConfirm(amount)}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
ConfirmModal.propTypes = {
  entry: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

/* -------------------- Renew Modal -------------------- */
function RenewModal({ user, onClose, onRenew }) {
  const [amount, setAmount] = useState(999);
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");
  return (
    <Modal onClose={onClose} title={`Renew for ${user?.name || "User"}`}>
      <div className="space-y-3">
        <label className="block text-sm">
          Amount
          <input
            type="number"
            className="mt-1 w-full border rounded px-2 py-1"
            value={amount}
            min="0"
            step="1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="block text-sm">
            Reference (UPI/Txn)
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Note
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => onRenew(amount, note, reference)}
          >
            Renew & Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
RenewModal.propTypes = {
  user: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onRenew: PropTypes.func.isRequired,
};

/* -------------------- Refund Modal -------------------- */
function RefundModal({ entry, onClose, onRefund }) {
  const [mode, setMode] = useState("remove"); // remove | mark
  const [amount, setAmount] = useState(Number(entry.amount || 0));
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");

  return (
    <Modal onClose={onClose} title="Refund">
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Refund against <b>{entry.userId?.name || "—"}</b>
        </p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="remove"
              checked={mode === "remove"}
              onChange={() => setMode("remove")}
            />
            Remove from totals (void)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="mark"
              checked={mode === "mark"}
              onChange={() => setMode("mark")}
            />
            Mark refunded (keep record)
          </label>
        </div>
        <label className="block text-sm">
          Amount
          <input
            type="number"
            className="mt-1 w-full border rounded px-2 py-1"
            value={amount}
            min="0"
            step="1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="block text-sm">
            Reference (UPI/Txn)
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Note
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={() => onRefund(mode, amount, note, reference)}
          >
            Confirm Refund
          </button>
        </div>
      </div>
    </Modal>
  );
}
RefundModal.propTypes = {
  entry: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onRefund: PropTypes.func.isRequired,
};

/* -------------------- Adjust Modal -------------------- */
function AdjustModal({ entry, onClose, onAdjust }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [reference, setReference] = useState("");

  return (
    <Modal onClose={onClose} title="Adjustment">
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Create an adjustment for <b>{entry.userId?.name || "—"}</b>. Use
          positive (+) to increase, negative (−) to decrease.
        </p>
        <label className="block text-sm">
          Amount (±)
          <input
            type="number"
            className="mt-1 w-full border rounded px-2 py-1"
            value={amount}
            step="1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label className="block text-sm">
            Reference
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            Note
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => onAdjust(amount, note, reference)}
          >
            Save Adjustment
          </button>
        </div>
      </div>
    </Modal>
  );
}
AdjustModal.propTypes = {
  entry: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdjust: PropTypes.func.isRequired,
};

/* -------------------- Modal primitive -------------------- */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h4 className="font-semibold">{title}</h4>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};
