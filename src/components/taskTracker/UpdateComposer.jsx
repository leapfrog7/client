import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { QUICK_STAGES } from "./constants";
import { safeTrim } from "./utils";

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group relative   text-xs sm:text-sm font-medium transition-all duration-300 outline-none"
      type="button"
      aria-pressed={active}
    >
      {/* Label: Slides up slightly and turns black when active */}
      <span
        className={`relative z-10 block transition-all duration-300 ${
          active
            ? "text-teal-700 bg-teal-50  px-4 py-2 transform -translate-y-[1px]"
            : "text-slate-500 px-4 py-2 group-hover:text-slate-800 group-hover:rounded-none"
        }`}
      >
        {children}
      </span>

      {/* The Underline: Grows from center outwards */}
      <div
        className={`absolute bottom-0 left-0 h-[3px] w-full bg-teal-300 transition-transform duration-300 ease-out origin-center ${
          active ? "scale-x-200" : "scale-x-0"
        }`}
      />

      {/* Hover background: A very faint pulse effect */}
      <div
        className={`absolute inset-0  transition-all duration-300 -z-0 ${
          active
            ? "bg-transparent"
            : "bg-teal-100/0 group-hover:bg-slate-100/50"
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
  disabled = false,
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

  useEffect(() => {
    if (disabled) {
      setStatus("idle");
    }
  }, [disabled]);

  const canSubmit = useMemo(() => {
    if (disabled) return false;

    const r = safeTrim(remark);

    if (mode === "remark") return r.length > 0;

    if (mode === "custom") {
      const cs = safeTrim(customStage);
      return cs.length > 0 || r.length > 0;
    }

    return safeTrim(quickStage).length > 0;
  }, [disabled, mode, quickStage, customStage, remark]);

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
    if (disabled) {
      setStatus("idle");
      onNotify?.("This task is archived. Restore it to add updates.", "error");
      return;
    }

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
                        disabled={disabled}
                        onClick={() => {
                          if (!disabled) setQuickStage(s);
                        }}
                        className={`text-[11px] sm:text-xs lg:text-sm sm:font-normal px-3 py-1.5 rounded-full border transition
            ${
              active
                ? "bg-black text-white border-black"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }
             ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
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
                disabled={disabled}
                onChange={(e) => setCustomStage(e.target.value)}
                placeholder="e.g., Draft para-wise comments"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300  lg:font-normal disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
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
              disabled={disabled}
              onChange={(e) => setRemark(e.target.value)}
              placeholder={
                mode === "remark"
                  ? "Write your remark (required in this tab)"
                  : "Example: Submitted to DS for approval."
              }
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[11px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-slate-300  lg:font-normal disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
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
              disabled={disabled || !canSubmit || status === "saving"}
              className={`relative min-w-[120px] overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98]
  ${
    disabled
      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
      : status === "saving"
        ? "bg-black/80 text-white/80 cursor-not-allowed"
        : status === "saved"
          ? "bg-black text-white"
          : canSubmit
            ? "bg-black text-white hover:bg-neutral-800 shadow-md"
            : "bg-slate-200 text-slate-500 cursor-not-allowed"
  }`}
            >
              <div className="flex items-center justify-center gap-2">
                {status === "saving" ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : status === "saved" ? (
                  <span className="flex items-center gap-1 animate-in zoom-in duration-300">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Saved
                  </span>
                ) : disabled ? (
                  "Archived"
                ) : (
                  "Add update"
                )}
              </div>
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
  disabled: PropTypes.bool,
};
