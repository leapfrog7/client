import { useMemo, useState } from "react";
import { diffDays, safeTrim } from "./utils";
import { getStageStyle } from "./constants";
import PropTypes from "prop-types";

export default function TaskList({
  tasks,
  selectedTaskId,
  onSelect,
  onCreate,
  onDelete,
  onArchive, // ✅
  onUnarchive, // ✅
  showArchived, // ✅
  onToggleArchived, // ✅
}) {
  const [q, setQ] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  const stages = useMemo(() => {
    const set = new Set(tasks.map((t) => t.currentStage).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [tasks]);

  const filtered = useMemo(() => {
    const qq = safeTrim(q).toLowerCase();

    return tasks
      .filter((t) =>
        stageFilter === "ALL" ? true : t.currentStage === stageFilter,
      )
      .filter((t) => {
        if (!qq) return true;
        const hay = [
          t.title,
          t.identifiers?.receiptNo,
          t.identifiers?.fileNo,
          t.identifiers?.section,
          t.currentStage,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(qq);
      });
    // .sort((a, b) => {
    //   const au = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    //   const bu = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    //   return bu - au;
    // });
  }, [tasks, q, stageFilter]);

  return (
    <div className="h-full min-h-0 flex flex-col border-r border-slate-200 bg-slate-50 overflow-hidden">
      {/* Header (fixed) */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900 truncate">
              Your Task List
            </h2>
            {/* <p className="text-xs text-slate-500">Local Phase 0 (offline)</p> */}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCreate}
              className="shrink-0 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 active:scale-[0.99]"
            >
              Add New +
            </button>

            <button
              type="button"
              onClick={onToggleArchived}
              className="shrink-0 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm hover:border-slate-300"
            >
              {showArchived ? "Go Back ❮❮" : "View Archive"}
            </button>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search: subject / file / receipt / stage..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="shrink-0 px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
            title="Filter by stage"
          >
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List (scrolls independently) */}
      <div className="flex-1 min-h-0 overflow-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-sm text-slate-600">
            No tasks found. Create your first task.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((t) => {
              const isSelected = t.id === selectedTaskId;
              const agingDays = diffDays(t.createdAt, new Date().toISOString());
              const s = getStageStyle(t.currentStage);

              return (
                <li
                  key={t.id}
                  className={`p-4 cursor-pointer hover:bg-slate-50 ${
                    isSelected
                      ? "bg-gradient-to-tr from-zinc-200 to-white"
                      : "bg-white"
                  }`}
                  onClick={() => onSelect(t.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm  font-semibold text-slate-800 truncate">
                        {t.title || "Untitled"}
                      </div>

                      <div className="mt-1 text-xs text-slate-500 truncate">
                        {t.identifiers?.section
                          ? `${t.identifiers.section} · `
                          : ""}
                        {t.identifiers?.fileNo
                          ? `File: ${t.identifiers.fileNo} · `
                          : ""}
                        {t.identifiers?.receiptNo
                          ? `Receipt: ${t.identifiers.receiptNo}`
                          : ""}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${s.chip}`}
                        >
                          {t.currentStage || "—"}
                        </span>
                        <span className="text-xs text-slate-500">
                          Total: {agingDays}d
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-col">
                      {showArchived ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnarchive(t.id);
                          }}
                          className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white hover:border-slate-300"
                        >
                          ♻️ Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onArchive(t.id);
                          }}
                          className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-700 bg-white hover:border-slate-300"
                        >
                          📦 Archive
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(t.id);
                        }}
                        className="text-xs px-2 py-1 rounded-lg border border-slate-200 text-slate-600 bg-white hover:border-slate-300"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
      identifiers: PropTypes.shape({
        receiptNo: PropTypes.string,
        fileNo: PropTypes.string,
        section: PropTypes.string,
      }),
      currentStage: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      events: PropTypes.array,
    }),
  ).isRequired,
  selectedTaskId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onArchive: PropTypes.func.isRequired,
  onUnarchive: PropTypes.func.isRequired,
  showArchived: PropTypes.bool.isRequired,
  onToggleArchived: PropTypes.func.isRequired,
};
