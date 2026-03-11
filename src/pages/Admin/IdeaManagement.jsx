// src/pages/admin/IdeaManagement.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrash,
  FaSearch,
  FaSyncAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import PropTypes from "prop-types";

// ====== Config ======
const BASE_URL = "https://server-v4dy.onrender.com/api/v1";
// const BASE_URL = "http://localhost:5000/api/v1";

const STATUSES = [
  "Draft",
  "Triaged",
  "Planned",
  "In Progress",
  "Shipped",
  "Archived",
];

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
});

const api = axios.create({ baseURL: BASE_URL });

// ====== small helpers ======
const clampStyle = (lines = 2) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const safeArray = (v) => (Array.isArray(v) ? v : []);

const statusPill = (s) => {
  // sober palette
  switch (s) {
    case "Draft":
      return "bg-gray-50 text-gray-700 border-gray-200";
    case "Triaged":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "Planned":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "In Progress":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "Shipped":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "Archived":
      return "bg-zinc-50 text-zinc-700 border-zinc-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const parseTags = (text) =>
  text
    ? text
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return isMobile;
}

export default function IdeaManagement() {
  const isMobile = useIsMobile();

  // Views: "board" | "list" | "detail"
  const [view, setView] = useState("board");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");

  // create
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  // detail
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // UX
  const [showFilters, setShowFilters] = useState(false);

  // Mobile default view should be list (board is swipeable but list is best)
  useEffect(() => {
    if (isMobile) setView((v) => (v === "detail" ? v : "list"));
    else setView((v) => (v === "detail" ? v : "board"));
  }, [isMobile]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  const loadList = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get(`/ideaManagement`, {
        headers: authHeaders(),
        params: {
          q: params.q ?? debouncedQ,
          status: params.status ?? status,
          tag: params.tag ?? tag,
        },
      });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error loading ideas:", e?.response?.data || e.message);
      alert("Failed to load ideas.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (id) => {
    if (!id) return;
    setDetailLoading(true);
    try {
      const res = await api.get(`/ideaManagement/${id}`, {
        headers: authHeaders(),
      });
      setSelected(res.data);
      setView("detail");
    } catch (e) {
      console.error("Error opening idea:", e?.response?.data || e.message);
      alert("Failed to open idea.");
    } finally {
      setDetailLoading(false);
    }
  };

  const refreshDetail = async () => {
    if (!selected?._id) return;
    await openDetail(selected._id);
  };

  useEffect(() => {
    loadList({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, status, tag]);

  const grouped = useMemo(() => {
    const g = {};
    for (const s of STATUSES) g[s] = [];
    for (const it of items) g[it.status || "Draft"].push(it);
    return g;
  }, [items]);

  const allTags = useMemo(() => {
    const set = new Set();
    for (const it of items) for (const t of safeArray(it.tags)) set.add(t);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filteredCountText = useMemo(() => {
    const parts = [];
    if (debouncedQ) parts.push(`search “${debouncedQ}”`);
    if (status) parts.push(status);
    if (tag) parts.push(`#${tag}`);
    return parts.length ? parts.join(" • ") : "All ideas";
  }, [debouncedQ, status, tag]);

  // ====== Create ======
  const onCreate = async () => {
    if (!createForm.title.trim()) return alert("Title is required.");
    try {
      const payload = {
        title: createForm.title.trim(),
        description: createForm.description?.trim(),
        tags: parseTags(createForm.tags),
      };
      const res = await api.post(`/ideaManagement`, payload, {
        headers: authHeaders(),
      });
      setItems((prev) => [res.data, ...prev]);
      setCreating(false);
      setCreateForm({ title: "", description: "", tags: "" });
    } catch (e) {
      console.error("Create failed:", e?.response?.data || e.message);
      alert("Failed to create idea.");
    }
  };

  const onDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Delete this idea permanently?")) return;
    try {
      await api.delete(`/ideaManagement/${id}`, { headers: authHeaders() });
      setSelected(null);
      // return to list/board depending on device
      setView(isMobile ? "list" : "board");
      loadList({});
    } catch (e) {
      console.error("Delete failed:", e?.response?.data || e.message);
      alert("Failed to delete idea.");
    }
  };

  // ====== UI ======
  return (
    <div className="p-3 md:p-6 bg-white rounded-2xl border shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900">
            Ideas &amp; Roadmap
          </h2>
          <div className="mt-1 text-xs md:text-sm text-gray-500">
            {filteredCountText} • {items.length} total
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold text-gray-700"
            onClick={() => loadList({})}
            title="Refresh"
          >
            <FaSyncAlt /> Refresh
          </button>
          <button
            className="px-3 py-2 rounded-xl border bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-sm font-semibold text-white"
            onClick={() => setCreating(true)}
            title="New Idea"
          >
            <FaPlus /> New
          </button>
        </div>
      </div>

      {/* Top controls (hide when detail) */}
      {view !== "detail" && (
        <>
          {/* Mobile: segmented view + filters button */}
          <div className="mt-4 flex items-center justify-between gap-2 md:hidden">
            <div className="inline-flex rounded-2xl border bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${
                  view === "list" ? "bg-gray-900 text-white" : "text-gray-700"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setView("board")}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition ${
                  view === "board" ? "bg-gray-900 text-white" : "text-gray-700"
                }`}
              >
                Board
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="px-3 py-2 rounded-xl border bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Filters
            </button>
          </div>

          {/* Desktop filters always visible */}
          <div className="hidden md:block mt-4">
            <FiltersRow
              q={q}
              setQ={setQ}
              status={status}
              setStatus={setStatus}
              tag={tag}
              setTag={setTag}
              allTags={allTags}
              onClear={() => {
                setQ("");
                setStatus("");
                setTag("");
              }}
            />
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="md:hidden mt-3">
              <div className="rounded-2xl border bg-gray-50 p-3">
                <FiltersRow
                  q={q}
                  setQ={setQ}
                  status={status}
                  setStatus={setStatus}
                  tag={tag}
                  setTag={setTag}
                  allTags={allTags}
                  onClear={() => {
                    setQ("");
                    setStatus("");
                    setTag("");
                  }}
                  compact
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="px-3 py-2 rounded-xl border bg-white text-sm font-semibold text-gray-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Content */}
      <div className="mt-4">
        {view === "detail" ? (
          <DetailView
            ideaId={selected?._id}
            idea={selected}
            loading={detailLoading}
            onBack={() => setView(isMobile ? "list" : "board")}
            onRefresh={refreshDetail}
            onDelete={onDelete}
            setIdea={setSelected}
          />
        ) : loading ? (
          <div className="py-10 text-center text-gray-600">Loading…</div>
        ) : view === "list" ? (
          <MobileList
            items={items}
            q={debouncedQ}
            status={status}
            tag={tag}
            onOpen={openDetail}
            onQuickStatus={(id, nextStatus) =>
              quickStatusUpdate(id, nextStatus, setItems)
            }
          />
        ) : (
          <Board
            grouped={grouped}
            onOpen={openDetail}
            onQuickStatus={(id, nextStatus) =>
              quickStatusUpdate(id, nextStatus, setItems)
            }
          />
        )}
      </div>

      {/* Create Modal */}
      {creating && (
        <CreateModal
          form={createForm}
          setForm={setCreateForm}
          onClose={() => setCreating(false)}
          onCreate={onCreate}
        />
      )}
    </div>
  );
}

/* ===================== Components ===================== */

function FiltersRow({
  q,
  setQ,
  status,
  setStatus,
  tag,
  setTag,
  allTags,
  onClear,
  compact = false,
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-3 shadow-sm ${compact ? "" : ""}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center border rounded-xl px-3 bg-white w-full md:w-[360px]">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            className="py-2 outline-none w-full text-sm"
            placeholder="Search ideas…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <select
          className="border rounded-xl px-3 py-2 text-sm bg-white"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Tag filter: use dropdown on mobile to avoid typing */}
        <div className="flex-1 min-w-[180px]">
          <select
            className="border rounded-xl px-3 py-2 text-sm bg-white w-full"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                #{t}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="px-3 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-700"
        >
          Clear
        </button>
      </div>

      <div className="mt-2 text-[11px] text-gray-500">
        Tip: on mobile, “Board” is swipeable horizontally.
      </div>
    </div>
  );
}

FiltersRow.propTypes = {
  q: PropTypes.string.isRequired,
  setQ: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
  setTag: PropTypes.func.isRequired,
  allTags: PropTypes.array.isRequired,
  onClear: PropTypes.func.isRequired,
  compact: PropTypes.bool,
};

function Board({ grouped, onOpen, onQuickStatus }) {
  // Instead of grid-6 (unusable on mobile), we do a horizontal scroll board always.
  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span className="inline-flex items-center gap-1">
          <FaChevronLeft /> Swipe
        </span>
        <span>to move across columns</span>
        <span className="inline-flex items-center gap-1">
          <FaChevronRight />
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3">
        {STATUSES.map((s) => (
          <div
            key={s}
            className="min-w-[280px] max-w-[280px] rounded-2xl border bg-white"
          >
            <div className="p-3 border-b bg-gray-50 rounded-t-2xl flex items-center justify-between">
              <div className="font-semibold text-gray-800">{s}</div>
              <div className="text-xs text-gray-500">
                {grouped[s]?.length || 0}
              </div>
            </div>

            <div className="p-3 space-y-2">
              {(grouped[s] || []).length ? (
                grouped[s].map((it) => (
                  <IdeaCard
                    key={it._id}
                    idea={it}
                    onOpen={onOpen}
                    onQuickStatus={onQuickStatus}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">No items</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Board.propTypes = {
  grouped: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  onQuickStatus: PropTypes.func.isRequired,
};

function MobileList({ items, q, status, tag, onOpen, onQuickStatus }) {
  // On mobile, list + status pill is the primary UX.
  // Provide quick status change via small dropdown per item (optional).
  return (
    <div className="space-y-2">
      {items.length ? (
        items.map((it) => (
          <div key={it._id} className="rounded-2xl border bg-white p-3">
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={() => onOpen(it._id)}
                className="text-left flex-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusPill(
                      it.status || "Draft",
                    )}`}
                  >
                    {it.status || "Draft"}
                  </span>
                  {it.rice?.score != null ? (
                    <span className="text-[11px] text-gray-500">
                      RICE{" "}
                      <span className="font-semibold">{it.rice.score}</span>
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 font-semibold text-gray-900">
                  {it.title || "Untitled"}
                </div>

                {it.description ? (
                  <div
                    className="mt-1 text-sm text-gray-600"
                    style={clampStyle(2)}
                  >
                    {it.description}
                  </div>
                ) : null}

                <div className="mt-2 flex flex-wrap gap-1">
                  {safeArray(it.tags)
                    .slice(0, 4)
                    .map((t) => (
                      <span
                        key={t}
                        className="text-[11px] bg-gray-100 text-gray-700 rounded-full px-2 py-0.5"
                      >
                        #{t}
                      </span>
                    ))}
                </div>
              </button>

              <div className="shrink-0">
                <select
                  className="border rounded-xl px-2 py-2 text-xs bg-white"
                  value={it.status || "Draft"}
                  onChange={(e) => onQuickStatus(it._id, e.target.value)}
                  title="Quick status"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))
      ) : (
        <EmptyHint q={q} status={status} tag={tag} />
      )}
    </div>
  );
}

MobileList.propTypes = {
  items: PropTypes.array.isRequired,
  q: PropTypes.string,
  status: PropTypes.string,
  tag: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  onQuickStatus: PropTypes.func.isRequired,
};

function EmptyHint({ q, status, tag }) {
  return (
    <div className="py-10 text-center text-gray-600">
      <div className="text-lg font-semibold text-gray-800">No ideas found</div>
      <div className="mt-1 text-sm text-gray-500">
        Try clearing filters or changing the search.
      </div>
      <div className="mt-2 text-xs text-gray-400">
        {q ? `q="${q}" ` : ""}
        {status ? `status="${status}" ` : ""}
        {tag ? `tag="${tag}"` : ""}
      </div>
    </div>
  );
}

EmptyHint.propTypes = {
  q: PropTypes.string,
  status: PropTypes.string,
  tag: PropTypes.string,
};

async function quickStatusUpdate(id, nextStatus, setItems) {
  if (!id || !nextStatus) return;
  try {
    // optimistic
    setItems((prev) =>
      prev.map((x) => (x._id === id ? { ...x, status: nextStatus } : x)),
    );

    await api.patch(
      `/ideaManagement/${id}`,
      { status: nextStatus },
      { headers: authHeaders() },
    );
  } catch (e) {
    console.error(
      "Quick status update failed:",
      e?.response?.data || e.message,
    );
    alert("Failed to update status.");
  }
}

function IdeaCard({ idea, onOpen, onQuickStatus }) {
  const done = safeArray(idea.slices).filter((s) => s.done).length;
  const total = Math.max(1, safeArray(idea.slices).length);
  const progress = Math.round((done / total) * 100);

  return (
    <div className="rounded-xl border bg-white hover:shadow-sm transition">
      <button
        onClick={() => onOpen(idea._id)}
        className="w-full text-left p-3"
        title="Open"
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusPill(
              idea.status || "Draft",
            )}`}
          >
            {idea.status || "Draft"}
          </span>

          {idea.rice?.score != null ? (
            <span className="text-[11px] text-gray-500">
              RICE <span className="font-semibold">{idea.rice.score}</span>
            </span>
          ) : null}
        </div>

        <div className="mt-2 font-semibold text-gray-900" style={clampStyle(2)}>
          {idea.title || "Untitled"}
        </div>

        {idea.description ? (
          <div className="mt-1 text-sm text-gray-600" style={clampStyle(2)}>
            {idea.description}
          </div>
        ) : null}

        <div className="mt-2 flex flex-wrap gap-1">
          {safeArray(idea.tags)
            .slice(0, 4)
            .map((t) => (
              <span
                key={t}
                className="text-[11px] bg-gray-100 rounded-full px-2 py-0.5 text-gray-700"
              >
                #{t}
              </span>
            ))}
        </div>

        {/* subtle progress */}
        <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-1.5 bg-gray-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-[11px] text-gray-500">
          {progress}% • {done}/{total} slices
        </div>
      </button>

      {/* quick status (desktop board) */}
      <div className="px-3 pb-3">
        <select
          className="w-full border rounded-xl px-2 py-2 text-xs bg-white"
          value={idea.status || "Draft"}
          onChange={(e) => onQuickStatus(idea._id, e.target.value)}
          title="Quick status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

IdeaCard.propTypes = {
  idea: PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
  onQuickStatus: PropTypes.func.isRequired,
};

function CreateModal({ form, setForm, onClose, onCreate }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-2xl p-4 md:p-5 shadow-xl">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">New Idea</h3>
            <p className="text-xs text-gray-500 mt-1">
              Keep it short. You can refine details later.
            </p>
          </div>
          <button
            type="button"
            className="px-3 py-2 rounded-xl border bg-white text-sm font-semibold text-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">Title</label>
            <input
              className="mt-1 border rounded-xl px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., Add search to Current Affairs"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">
              Description
            </label>
            <textarea
              className="mt-1 border rounded-xl px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-200"
              rows={4}
              placeholder="What problem does it solve? Who benefits? Any notes…"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Tags</label>
            <input
              className="mt-1 border rounded-xl px-3 py-2 w-full text-sm outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="comma,separated,tags"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="px-3 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white"
            onClick={onCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

CreateModal.propTypes = {
  form: PropTypes.object.isRequired,
  setForm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

function DetailView({
  ideaId,
  idea,
  loading,
  onBack,
  onRefresh,
  onDelete,
  setIdea,
}) {
  const [newSlice, setNewSlice] = useState("");
  const [comment, setComment] = useState("");

  // local editable fields to avoid jittery autosave
  const [titleDraft, setTitleDraft] = useState("");
  const [descDraft, setDescDraft] = useState("");
  const [tagsDraft, setTagsDraft] = useState("");

  useEffect(() => {
    setTitleDraft(idea?.title || "");
    setDescDraft(idea?.description || "");
    setTagsDraft(safeArray(idea?.tags).join(", "));
  }, [idea?._id]); // reset when opening a different idea

  const savePatch = async (patch) => {
    if (!ideaId) return;
    try {
      const res = await axios.patch(
        `${BASE_URL}/ideaManagement/${ideaId}`,
        patch,
        {
          headers: authHeaders(),
        },
      );
      setIdea(res.data);
    } catch (e) {
      console.error("Update failed:", e?.response?.data || e.message);
      alert("Failed to update idea.");
    }
  };

  const addSlice = async () => {
    if (!newSlice.trim()) return;
    try {
      const res = await axios.post(
        `${BASE_URL}/ideaManagement/${ideaId}/slices`,
        { title: newSlice.trim() },
        { headers: authHeaders() },
      );
      setIdea(res.data);
      setNewSlice("");
    } catch (e) {
      console.error("Add slice failed:", e?.response?.data || e.message);
      alert("Failed to add slice.");
    }
  };

  const toggleSlice = async (sliceId, done) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/ideaManagement/${ideaId}/slices/${sliceId}`,
        { done },
        { headers: authHeaders() },
      );
      setIdea(res.data);
    } catch (e) {
      console.error("Toggle slice failed:", e?.response?.data || e.message);
      alert("Failed to update slice.");
    }
  };

  const postComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `${BASE_URL}/ideaManagement/${ideaId}/activity`,
        { type: "comment", payload: { text: comment.trim() } },
        { headers: authHeaders() },
      );
      setIdea(res.data);
      setComment("");
    } catch (e) {
      console.error("Comment failed:", e?.response?.data || e.message);
      alert("Failed to add comment.");
    }
  };

  const done = safeArray(idea?.slices).filter((s) => s.done).length;
  const total = Math.max(1, safeArray(idea?.slices).length);
  const progress = Math.round((done / total) * 100);

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-2">
        <button
          className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700"
            onClick={onRefresh}
            title="Refresh"
          >
            <FaSyncAlt />
          </button>
          <button
            className="px-3 py-2 rounded-xl border bg-white hover:bg-red-50 text-sm font-semibold text-red-700 flex items-center gap-2"
            onClick={() => onDelete(ideaId)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {loading || !idea ? (
        <div className="py-10 text-center text-gray-600">Loading…</div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Main card */}
          <div className="rounded-2xl border bg-white p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-start gap-3 md:justify-between">
              <div className="flex-1 min-w-0">
                <label className="text-xs font-semibold text-gray-600">
                  Title
                </label>
                <input
                  className="mt-1 w-full text-lg md:text-xl font-bold text-gray-900 outline-none border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-200"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                />

                <label className="block mt-3 text-xs font-semibold text-gray-600">
                  Description
                </label>
                <textarea
                  className="mt-1 w-full text-sm text-gray-800 outline-none border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-200"
                  rows={4}
                  value={descDraft}
                  onChange={(e) => setDescDraft(e.target.value)}
                  placeholder="Describe the idea…"
                />

                <label className="block mt-3 text-xs font-semibold text-gray-600">
                  Tags
                </label>
                <input
                  className="mt-1 w-full text-sm text-gray-800 outline-none border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-200"
                  value={tagsDraft}
                  onChange={(e) => setTagsDraft(e.target.value)}
                  placeholder="comma,separated,tags"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {parseTags(tagsDraft)
                    .slice(0, 8)
                    .map((t) => (
                      <span
                        key={t}
                        className="text-[11px] bg-gray-100 text-gray-700 rounded-full px-2 py-0.5"
                      >
                        #{t}
                      </span>
                    ))}
                </div>
              </div>

              <div className="w-full md:w-[320px] rounded-2xl border bg-gray-50 p-3">
                <div className="text-sm font-semibold text-gray-800 mb-2">
                  Status &amp; Scoring
                </div>

                <label className="text-xs font-semibold text-gray-600">
                  Status
                </label>
                <select
                  className="mt-1 border rounded-xl px-3 py-2 w-full bg-white text-sm"
                  value={idea.status || "Draft"}
                  onChange={(e) => savePatch({ status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gray-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Progress {progress}% ({done}/{total})
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-600">
                    RICE Score:{" "}
                    <span className="font-semibold text-gray-900">
                      {idea.rice?.score ?? 0}
                    </span>
                  </div>
                  <RICEEditor
                    rice={idea.rice}
                    onChange={(rice) => savePatch({ rice })}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 rounded-xl border bg-white hover:bg-gray-100 text-sm font-semibold text-gray-700"
                    onClick={() => {
                      setTitleDraft(idea.title || "");
                      setDescDraft(idea.description || "");
                      setTagsDraft(safeArray(idea.tags).join(", "));
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="flex-1 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white"
                    onClick={() =>
                      savePatch({
                        title: titleDraft.trim(),
                        description: descDraft.trim(),
                        tags: parseTags(tagsDraft),
                      })
                    }
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Slices */}
          <div className="rounded-2xl border bg-white p-4 md:p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Slices</h3>
              <div className="text-xs text-gray-500">
                {done}/{total} done
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {safeArray(idea.slices).length ? (
                safeArray(idea.slices).map((s) => (
                  <label
                    key={s._id}
                    className="flex gap-3 items-start rounded-xl border bg-gray-50 p-3"
                  >
                    <input
                      type="checkbox"
                      checked={!!s.done}
                      onChange={() => toggleSlice(s._id, !s.done)}
                      className="mt-1"
                    />
                    <div
                      className={
                        s.done ? "line-through text-gray-500" : "text-gray-900"
                      }
                    >
                      {s.title}
                    </div>
                  </label>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">
                  No slices yet.
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <input
                  className="border rounded-xl px-3 py-2 flex-1 text-sm"
                  placeholder="Add a slice…"
                  value={newSlice}
                  onChange={(e) => setNewSlice(e.target.value)}
                />
                <button
                  className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-semibold"
                  onClick={addSlice}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-2xl border bg-white p-4 md:p-5">
            <h3 className="font-semibold text-gray-900">Activity</h3>

            <div className="mt-3 space-y-2">
              {safeArray(idea.activity).length ? (
                safeArray(idea.activity)
                  .slice()
                  .reverse()
                  .slice(0, 20)
                  .map((a, i) => (
                    <div
                      key={i}
                      className="rounded-xl border bg-gray-50 p-3 text-sm"
                    >
                      <div className="text-gray-700">
                        <span className="font-semibold">{a.type}</span>{" "}
                        <span className="text-gray-400">•</span>{" "}
                        <span className="text-gray-600">
                          {a.at ? new Date(a.at).toLocaleString() : ""}
                        </span>
                      </div>
                      <div className="mt-1 text-gray-700">
                        {a?.payload?.text
                          ? a.payload.text
                          : typeof a.payload === "object"
                            ? JSON.stringify(a.payload)
                            : String(a.payload)}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-sm text-gray-500 italic">
                  No activity yet.
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <input
                  className="border rounded-xl px-3 py-2 flex-1 text-sm"
                  placeholder="Add a comment…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="px-3 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-sm font-semibold text-white"
                  onClick={postComment}
                >
                  Post
                </button>
              </div>

              <div className="text-[11px] text-gray-500">
                Showing latest 20 entries.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

DetailView.propTypes = {
  ideaId: PropTypes.string,
  idea: PropTypes.object,
  loading: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  setIdea: PropTypes.func.isRequired,
};

function RICEEditor({ rice = {}, onChange }) {
  const [v, setV] = useState({
    reach: rice.reach ?? 1,
    impact: rice.impact ?? 1,
    confidence: rice.confidence ?? 0.8,
    effort: rice.effort ?? 1,
  });

  useEffect(() => {
    setV({
      reach: rice.reach ?? 1,
      impact: rice.impact ?? 1,
      confidence: rice.confidence ?? 0.8,
      effort: rice.effort ?? 1,
    });
  }, [rice?.reach, rice?.impact, rice?.confidence, rice?.effort]);

  const update = (k, val) => {
    const next = { ...v, [k]: Number(val) };
    setV(next);
    onChange(next); // server computes score
  };

  return (
    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
      <Num
        label="Reach"
        value={v.reach}
        onChange={(val) => update("reach", val)}
      />
      <Num
        label="Impact"
        value={v.impact}
        step="0.25"
        onChange={(val) => update("impact", val)}
      />
      <Num
        label="Confidence"
        value={v.confidence}
        step="0.05"
        onChange={(val) => update("confidence", val)}
      />
      <Num
        label="Effort"
        value={v.effort}
        step="0.25"
        onChange={(val) => update("effort", val)}
      />
    </div>
  );
}

RICEEditor.propTypes = {
  rice: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

function Num({ label, value, onChange, step = "1" }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-gray-600">{label}</span>
      <input
        type="number"
        step={step}
        className="border rounded-xl px-3 py-2 text-sm bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

Num.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.string,
};
