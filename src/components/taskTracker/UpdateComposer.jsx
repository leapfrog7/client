import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { QUICK_STAGES } from "./constants";
import { safeTrim } from "./utils";

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-xs font-medium border-r last:border-r-0 transition
        ${
          active
            ? "bg-slate-100 text-slate-900 font-semibold"
            : "bg-slate-50 text-slate-600 hover:bg-white"
        }
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

export default function UpdateComposer({
  currentStage,
  onAddUpdate,
  onNotify,
}) {
  const [mode, setMode] = useState("quick"); // quick | custom | remark
  const [quickStage, setQuickStage] = useState(currentStage || "Pending");
  const [customStage, setCustomStage] = useState("");
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | saved

  const canSubmit = useMemo(() => {
    const r = safeTrim(remark);

    if (mode === "remark") return r.length > 0;

    if (mode === "custom") {
      const cs = safeTrim(customStage);
      // allow stage only OR remark only OR both
      return cs.length > 0 || r.length > 0;
    }

    // quick
    return safeTrim(quickStage).length > 0;
  }, [mode, quickStage, customStage, remark]);

  function buildPayload() {
    const r = safeTrim(remark);

    if (mode === "remark") {
      return { kind: "remark", toStage: null, remark: r };
    }

    if (mode === "custom") {
      const cs = safeTrim(customStage);
      // If stage is empty but remark exists, treat as remark-only
      if (!cs && r) return { kind: "remark", toStage: null, remark: r };
      return { kind: "stage_change", toStage: cs || null, remark: r };
    }

    // quick
    return { kind: "stage_change", toStage: safeTrim(quickStage), remark: r };
  }

  async function handleSubmit() {
    if (!canSubmit || status === "saving") return;

    setStatus("saving");

    try {
      const payload = buildPayload();
      await Promise.resolve(onAddUpdate(payload));

      setStatus("saved");
      onNotify?.("Update added");

      // reset inputs (keep quick stage selection as-is)
      setRemark("");
      setCustomStage("");

      window.setTimeout(() => setStatus("idle"), 900);
    } catch (e) {
      setStatus("idle");
      onNotify?.("Could not add update", "error");
    }
  }

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
                type="button"
                onClick={() => setQuickStage(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition
                  ${
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
          placeholder={
            mode === "remark"
              ? "Write your remark (required in this tab)"
              : "Remarks (optional but recommended)"
          }
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
        />

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Tip: each update becomes a timeline milestone.
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || status === "saving"}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition active:scale-[0.99]
              ${
                status === "saving"
                  ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                  : status === "saved"
                    ? "bg-emerald-600 text-white"
                    : canSubmit
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
          >
            {status === "saving" ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                Saving…
              </span>
            ) : status === "saved" ? (
              "Saved ✓"
            ) : (
              "Add Update"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

UpdateComposer.propTypes = {
  currentStage: PropTypes.string,
  onAddUpdate: PropTypes.func.isRequired, // ({ kind, toStage, remark }) => void
  onNotify: PropTypes.func, // (message, type?) => void
};
