import { useMemo, useState } from "react";
import { QUICK_STAGES } from "./constants";
import { safeTrim } from "./utils";
import PropTypes from "prop-types";

export default function UpdateComposer({ currentStage, onAddUpdate }) {
  const [mode, setMode] = useState("quick"); // quick | custom | remark
  const [quickStage, setQuickStage] = useState(currentStage || "Pending");
  const [customStage, setCustomStage] = useState("");
  const [remark, setRemark] = useState("");

  const canSubmit = useMemo(() => {
    if (mode === "remark") return safeTrim(remark).length > 0;
    if (mode === "custom")
      return safeTrim(customStage).length > 0 || safeTrim(remark).length > 0;
    // quick
    return safeTrim(quickStage).length > 0;
  }, [mode, quickStage, customStage, remark]);

  function submit() {
    if (!canSubmit) return;

    if (mode === "remark") {
      onAddUpdate({ kind: "remark", toStage: null, remark });
    } else if (mode === "custom") {
      onAddUpdate({
        kind: "stage_change",
        toStage: safeTrim(customStage) || null,
        remark,
      });
    } else {
      onAddUpdate({ kind: "stage_change", toStage: quickStage, remark });
    }

    setRemark("");
    setCustomStage("");
  }

  function TabButton({ active, onClick, children }) {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-2 text-xs font-medium border-r last:border-r-0 transition
        ${active ? "bg-white text-slate-900" : "bg-slate-50 text-slate-600 hover:bg-white"}
        border-slate-200`}
        type="button"
      >
        {children}
      </button>
    );
  }

  TabButton.propTypes = {
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div className="grid grid-cols-3">
          <TabButton active={mode === "quick"} onClick={() => setMode("quick")}>
            Quick Stage
          </TabButton>
          <TabButton
            active={mode === "custom"}
            onClick={() => setMode("custom")}
          >
            Custom
          </TabButton>
          <TabButton
            active={mode === "remark"}
            onClick={() => setMode("remark")}
          >
            Remark
          </TabButton>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        {mode === "quick" && (
          <div className="flex flex-wrap gap-2">
            {QUICK_STAGES.map((s) => (
              <button
                key={s}
                onClick={() => setQuickStage(s)}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  quickStage === s
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {mode === "custom" && (
          <input
            value={customStage}
            onChange={(e) => setCustomStage(e.target.value)}
            placeholder="Type your custom stage (e.g., 'Draft para-wise comments')"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        )}

        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder="Remarks (optional but recommended)"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Tip: each update becomes a timeline milestone.
          </div>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className={`px-3 py-2 rounded-lg text-sm ${
              canSubmit
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Add Update
          </button>
        </div>
      </div>
    </div>
  );
}

UpdateComposer.propTypes = {
  currentStage: PropTypes.string,
  onAddUpdate: PropTypes.func.isRequired,
  // receives { kind, toStage, remark }
};
