// src/pages/admin/IdeaManagement.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaSearch, FaSyncAlt } from "react-icons/fa";
import PropTypes from "prop-types";

// ====== Config (match your style) ======
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

// ====== Helpers in-file (no external utils) ======
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
});

const api = axios.create({
  baseURL: BASE_URL,
});

export default function IdeaManagement() {
  // Views: "board" (columns) or "detail" (single idea)
  const [view, setView] = useState("board");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [tag, setTag] = useState("");
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const [selected, setSelected] = useState(null); // full idea doc when in "detail"
  const [detailLoading, setDetailLoading] = useState(false);

  const loadList = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get(`/ideaManagement`, {
        headers: authHeaders(),
        params: {
          q: params.q ?? q,
          status: params.status ?? status,
          tag: params.tag ?? tag,
        },
      });
      setItems(res.data || []);
    } catch (e) {
      console.error("Error loading ideas:", e?.response?.data || e.message);
      alert("Failed to load ideas.");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (id) => {
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
  }, [q, status, tag]);

  const grouped = useMemo(() => {
    const g = {};
    for (const s of STATUSES) g[s] = [];
    for (const it of items) g[it.status || "Draft"].push(it);
    return g;
  }, [items]);

  // ====== Create ======
  const onCreate = async () => {
    if (!createForm.title.trim()) return alert("Title is required.");
    try {
      const payload = {
        title: createForm.title.trim(),
        description: createForm.description?.trim(),
        tags: createForm.tags
          ? createForm.tags
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
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

  // ====== Delete from detail ======
  const onDelete = async (id) => {
    if (!window.confirm("Delete this idea permanently?")) return;
    try {
      await api.delete(`/ideaManagement/${id}`, { headers: authHeaders() });
      setSelected(null);
      setView("board");
      loadList({});
    } catch (e) {
      console.error("Delete failed:", e?.response?.data || e.message);
      alert("Failed to delete idea.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800">
          Ideas &amp; Roadmap
        </h2>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded border hover:bg-gray-50 flex items-center gap-2"
            onClick={() => loadList({})}
            title="Refresh"
          >
            <FaSyncAlt /> Refresh
          </button>
          <button
            className="px-3 py-2 rounded border hover:bg-gray-50 flex items-center gap-2"
            onClick={() => setCreating(true)}
            title="New Idea"
          >
            <FaPlus /> New
          </button>
        </div>
      </div>

      {/* Filters */}
      {view === "board" && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center border rounded px-2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              className="py-2 outline-none"
              placeholder="Search ideas…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <select
            className="border rounded px-3 py-2"
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

          <input
            className="border rounded px-3 py-2"
            placeholder="Filter by tag (exact)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
      )}

      {/* Board */}
      {view === "board" ? (
        loading ? (
          <div className="mt-6">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mt-6">
            {STATUSES.map((s) => (
              <div key={s} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{s}</h3>
                  <span className="text-xs text-gray-500">
                    {grouped[s].length}
                  </span>
                </div>
                <div className="space-y-2">
                  {grouped[s].map((it) => (
                    <IdeaCard key={it._id} idea={it} onOpen={openDetail} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // Detail
        <DetailView
          ideaId={selected?._id}
          idea={selected}
          loading={detailLoading}
          onBack={() => setView("board")}
          onRefresh={refreshDetail}
          onDelete={onDelete}
          setIdea={setSelected}
        />
      )}

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[95%] max-w-lg">
            <h3 className="text-lg font-semibold">New Idea</h3>
            <div className="mt-3 space-y-2">
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Title"
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, title: e.target.value }))
                }
              />
              <textarea
                className="border rounded px-3 py-2 w-full"
                rows={3}
                placeholder="Description"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
              />
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Tags (comma separated)"
                value={createForm.tags}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, tags: e.target.value }))
                }
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded border"
                onClick={() => setCreating(false)}
              >
                Cancel
              </button>
              <button className="px-3 py-2 rounded border" onClick={onCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IdeaCard({ idea, onOpen }) {
  const done = (idea.slices || []).filter((s) => s.done).length;
  const total = (idea.slices || []).length || 1;
  const progress = Math.round((done / total) * 100);

  return (
    <button
      onClick={() => onOpen(idea._id)}
      className="w-full text-left block rounded-lg border p-3 hover:shadow-sm"
      title="Open"
    >
      <div className="font-medium">{idea.title}</div>
      <div className="mt-1 flex flex-wrap gap-1">
        {idea.tags?.slice(0, 4).map((t) => (
          <span key={t} className="text-xs bg-gray-100 rounded px-2 py-0.5">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-2 h-1.5 bg-gray-200 rounded">
        <div
          className="h-1.5 rounded"
          style={{ width: `${progress}%`, background: "#111827" }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Progress {progress}% • RICE {idea.rice?.score ?? 0}
      </div>
    </button>
  );
}

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

  const savePatch = async (patch) => {
    if (!ideaId) return;
    try {
      const res = await axios.patch(
        `${BASE_URL}/ideaManagement/${ideaId}`,
        patch,
        { headers: authHeaders() }
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
        { headers: authHeaders() }
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
        { headers: authHeaders() }
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
        { headers: authHeaders() }
      );
      setIdea(res.data);
      setComment("");
    } catch (e) {
      console.error("Comment failed:", e?.response?.data || e.message);
      alert("Failed to add comment.");
    }
  };

  const done = (idea?.slices || []).filter((s) => s.done).length;
  const total = (idea?.slices || []).length || 1;
  const progress = Math.round((done / total) * 100);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <button className="px-3 py-2 rounded border" onClick={onBack}>
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-2 rounded border"
            onClick={onRefresh}
            title="Refresh"
          >
            <FaSyncAlt />
          </button>
          <button
            className="px-3 py-2 rounded border text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={() => onDelete(ideaId)}
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {loading || !idea ? (
        <div className="mt-6">Loading…</div>
      ) : (
        <div className="bg-white rounded-lg border p-4 mt-4 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <input
                className="w-full text-xl font-semibold outline-none"
                value={idea.title || ""}
                onChange={(e) => setIdea({ ...idea, title: e.target.value })}
                onBlur={() => savePatch({ title: idea.title })}
              />
              <textarea
                className="mt-1 w-full text-gray-700 outline-none border rounded px-3 py-2"
                rows={3}
                value={idea.description || ""}
                placeholder="Description"
                onChange={(e) =>
                  setIdea({ ...idea, description: e.target.value })
                }
                onBlur={() => savePatch({ description: idea.description })}
              />
              <TagsEditor
                tags={idea.tags || []}
                onChange={(tags) => {
                  setIdea({ ...idea, tags });
                  savePatch({ tags });
                }}
              />
            </div>

            <div className="flex flex-col gap-2 items-end">
              <select
                className="border rounded px-3 py-2"
                value={idea.status}
                onChange={(e) => savePatch({ status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <RICEEditor
                rice={idea.rice}
                onChange={(rice) => savePatch({ rice })}
              />
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="h-1.5 bg-gray-200 rounded">
              <div
                className="h-1.5 rounded"
                style={{ width: `${progress}%`, background: "#111827" }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Progress {progress}% ({done}/{total})
            </div>
          </div>

          {/* Slices */}
          <section>
            <h3 className="font-semibold">Slices</h3>
            <div className="mt-2 space-y-2">
              {idea.slices?.map((s) => (
                <label key={s._id} className="flex gap-2 items-start">
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={() => toggleSlice(s._id, !s.done)}
                  />
                  <div className={s.done ? "line-through text-gray-500" : ""}>
                    {s.title}
                  </div>
                </label>
              ))}
              <div className="flex gap-2">
                <input
                  className="border rounded px-3 py-2 flex-1"
                  placeholder="Add slice…"
                  value={newSlice}
                  onChange={(e) => setNewSlice(e.target.value)}
                />
                <button className="border rounded px-3 py-2" onClick={addSlice}>
                  Add
                </button>
              </div>
            </div>
          </section>

          {/* Activity */}
          <section>
            <h3 className="font-semibold">Activity</h3>
            <div className="mt-2 space-y-2">
              {(idea.activity || [])
                .slice()
                .reverse()
                .map((a, i) => (
                  <div key={i} className="text-sm text-gray-600">
                    <span className="font-medium">{a.type}</span> •{" "}
                    {new Date(a.at).toLocaleString()} —{" "}
                    {typeof a.payload === "object"
                      ? JSON.stringify(a.payload)
                      : String(a.payload)}
                  </div>
                ))}

              <div className="flex gap-2">
                <input
                  className="border rounded px-3 py-2 flex-1"
                  placeholder="Add comment…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="border rounded px-3 py-2"
                  onClick={postComment}
                >
                  Post
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function TagsEditor({ tags, onChange }) {
  const [text, setText] = useState(tags.join(", "));
  useEffect(() => setText(tags.join(", ")), [tags]);
  return (
    <div className="mt-2">
      <label className="text-sm text-gray-600">Tags</label>
      <input
        className="mt-1 border rounded px-3 py-2 w-full"
        placeholder="comma,separated,tags"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() =>
          onChange(
            text
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
      />
    </div>
  );
}

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
  }, [rice]);

  const update = (k, val) => {
    const next = { ...v, [k]: Number(val) };
    setV(next);
    onChange(next); // server computes score
  };

  return (
    <div className="flex flex-wrap gap-2 items-center text-sm">
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
        label="Conf."
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

function Num({ label, value, onChange, step = "1" }) {
  return (
    <label className="flex items-center gap-1">
      <span className="text-gray-600">{label}</span>
      <input
        type="number"
        step={step}
        className="border rounded px-2 py-1 w-24"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

IdeaCard.propTypes = {
  idea: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    slices: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        done: PropTypes.bool,
      })
    ),
    rice: PropTypes.shape({
      score: PropTypes.number,
    }),
    status: PropTypes.string,
  }).isRequired,
  onOpen: PropTypes.func.isRequired,
};

// Example for DetailView
DetailView.propTypes = {
  ideaId: PropTypes.string,
  idea: PropTypes.object,
  loading: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  setIdea: PropTypes.func.isRequired,
};

// Example for TagsEditor
TagsEditor.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

// Example for RICEEditor
RICEEditor.propTypes = {
  rice: PropTypes.shape({
    reach: PropTypes.number,
    impact: PropTypes.number,
    confidence: PropTypes.number,
    effort: PropTypes.number,
  }),
  onChange: PropTypes.func.isRequired,
};

// Example for Num
Num.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  step: PropTypes.string,
};
