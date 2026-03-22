import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { QUICK_STAGES } from "./constants";
import { safeTrim } from "./utils";

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-[11px] sm:text-sm  transition
        ${active ? "text-slate-700 font-bold lg:font-extrabold" : "text-slate-700 hover:text-slate-700"}
      `}
      type="button"
      aria-pressed={active}
    >
      {children}
      <div
        className={`mt-1 h-0.5 rounded-full transition ${
          active ? "bg-slate-700 rounded-full" : "bg-transparent"
        }`}
      />
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
  // Default to "quick" (your original), but visually we make it feel lighter.
  const [mode, setMode] = useState("quick"); // quick | custom | remark

  const [quickStage, setQuickStage] = useState(currentStage || "Pending");
  const [customStage, setCustomStage] = useState("");
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | saved

  useEffect(() => {
    setQuickStage(currentStage || "Pending");
    setCustomStage("");
    setRemark("");
    setStatus("idle");
    setMode("quick");
  }, [currentStage]);

  const canSubmit = useMemo(() => {
    const r = safeTrim(remark);

    if (mode === "remark") return r.length > 0;

    if (mode === "custom") {
      const cs = safeTrim(customStage);
      return cs.length > 0 || r.length > 0;
    }

    return safeTrim(quickStage).length > 0;
  }, [mode, quickStage, customStage, remark]);

  function buildPayload() {
    const r = safeTrim(remark);

    if (mode === "remark") {
      return { kind: "remark", toStage: null, remark: r };
    }

    if (mode === "custom") {
      const cs = safeTrim(customStage);
      if (!cs && r) return { kind: "remark", toStage: null, remark: r };
      return { kind: "stage_change", toStage: cs || null, remark: r };
    }

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

      setRemark("");
      setCustomStage("");

      window.setTimeout(() => setStatus("idle"), 900);
    } catch (e) {
      setStatus("idle");
      onNotify?.("Could not add update", "error");
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs md:text-sm lg:text-base font-semibold text-slate-700">
              Add update
            </div>
            <div className="mt-0.5 text-[11px] sm:text-xs text-slate-700">
              Each update becomes a milestone in the timeline.
            </div>
          </div>

          {/* Tiny status */}
          <div className="text-[11px] text-slate-700">
            Current Stage:{" "}
            <span className="font-semibold text-slate-700">
              {currentStage || "—"}
            </span>
          </div>
        </div>

        {/* Minimal tabs (no big segmented box) */}
        <div className="mt-3  flex items-center gap-3 border-b border-slate-200">
          <TabButton active={mode === "quick"} onClick={() => setMode("quick")}>
            Quick stage
          </TabButton>
          <TabButton
            active={mode === "custom"}
            onClick={() => setMode("custom")}
          >
            Custom stage
          </TabButton>
          <TabButton
            active={mode === "remark"}
            onClick={() => setMode("remark")}
          >
            Remark only
          </TabButton>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4">
        <div className="mt-3 grid gap-3">
          {/* QUICK: chips become a calm horizontal scroll row */}
          {mode === "quick" && (
            <div className="min-w-0">
              <div className="text-[11px] text-slate-700 mb-2  lg:font-normal">
                Pick the next stage:
              </div>

              {/* horizontal scroller (laptop-safe + nicer UX) */}
              {/* Quick stages: wrap on most screens, scroll only on very wide */}
              <div className="min-w-0 max-w-full">
                <div
                  className="
      flex flex-wrap gap-2
      2xl:flex-nowrap 2xl:overflow-x-auto 2xl:overflow-y-hidden 2xl:pb-2
    "
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {QUICK_STAGES.map((s) => {
                    const active = quickStage === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuickStage(s)}
                        className={`text-[11px] sm:text-xs lg:text-sm sm:font-normal px-3 py-1.5 rounded-full border transition
            ${
              active
                ? "bg-black text-white border-black"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
                        aria-pressed={active}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-1  lg:font-normal text-[11px] text-slate-700">
                Selected:{" "}
                <span className="font-semibold text-slate-700 ">
                  {quickStage}
                </span>
              </div>
            </div>
          )}

          {mode === "custom" && (
            <div>
              <div className="text-[11px] text-slate-700 mb-2  lg:font-normal">
                Type a custom stage:
              </div>
              <input
                value={customStage}
                onChange={(e) => setCustomStage(e.target.value)}
                placeholder="e.g., Draft para-wise comments"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300  lg:font-normal"
              />
              <div className="mt-1 text-[11px] text-slate-700  lg:font-normal">
                Tip: keep it short and action-based.
              </div>
            </div>
          )}

          {/* Remark textarea always visible (but calmer) */}
          <div>
            <div className="text-[11px] text-slate-700 mb-2  lg:font-normal">
              {mode === "remark"
                ? "Remark (required)"
                : "Remark (optional but useful)"}
            </div>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder={
                mode === "remark"
                  ? "Write your remark (required in this tab)"
                  : "Example: Submitted to DS for approval."
              }
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[11px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300  lg:font-normal"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-[10px] sm:text-[11px] md:text-xs text-slate-700">
              Shortcut: add small remarks quickly.
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || status === "saving"}
              className={`px-3 lg:px-4 py-2 rounded-xl text-xs lg:text-sm font-normal lg:font-semibold transition active:scale-[0.99]
                ${
                  status === "saving"
                    ? "bg-slate-300 text-slate-700 cursor-not-allowed"
                    : status === "saved"
                      ? "bg-emerald-600 text-white"
                      : canSubmit
                        ? "bg-black text-white hover:bg-black"
                        : "bg-slate-200 text-slate-700 cursor-not-allowed"
                }`}
            >
              {status === "saving" ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin  lg:font-normal" />
                  Saving…
                </span>
              ) : status === "saved" ? (
                "Saved ✓"
              ) : (
                "Add update"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

UpdateComposer.propTypes = {
  currentStage: PropTypes.string,
  onAddUpdate: PropTypes.func.isRequired,
  onNotify: PropTypes.func,
};
