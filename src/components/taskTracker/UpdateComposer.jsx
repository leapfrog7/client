// import { useEffect, useMemo, useState } from "react"; // ✅ add useEffectimport PropTypes from "prop-types";
// import { QUICK_STAGES } from "./constants";
// import { safeTrim } from "./utils";
// import PropTypes from "prop-types";

// function TabButton({ active, onClick, children }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-3 py-2 text-xs font-medium border-r last:border-r-0 transition
//         ${
//           active
//             ? "bg-slate-100 text-slate-900 font-semibold"
//             : "bg-slate-50 text-slate-600 hover:bg-white"
//         }
//         border-slate-200`}
//       type="button"
//     >
//       {children}
//     </button>
//   );
// }

// TabButton.propTypes = {
//   active: PropTypes.bool,
//   onClick: PropTypes.func.isRequired,
//   children: PropTypes.node.isRequired,
// };

// export default function UpdateComposer({
//   currentStage,
//   onAddUpdate,
//   onNotify,
// }) {
//   const [mode, setMode] = useState("quick"); // quick | custom | remark
//   const [quickStage, setQuickStage] = useState(currentStage || "Pending");
//   const [customStage, setCustomStage] = useState("");
//   const [remark, setRemark] = useState("");
//   const [status, setStatus] = useState("idle"); // idle | saving | saved

//   useEffect(() => {
//     setQuickStage(currentStage || "Pending");

//     // optional but recommended UX: reset carry-over inputs when task changes
//     setCustomStage("");
//     setRemark("");
//     setStatus("idle");
//     setMode("quick");
//   }, [currentStage]);
//   const canSubmit = useMemo(() => {
//     const r = safeTrim(remark);

//     if (mode === "remark") return r.length > 0;

//     if (mode === "custom") {
//       const cs = safeTrim(customStage);
//       // allow stage only OR remark only OR both
//       return cs.length > 0 || r.length > 0;
//     }

//     // quick
//     return safeTrim(quickStage).length > 0;
//   }, [mode, quickStage, customStage, remark]);

//   function buildPayload() {
//     const r = safeTrim(remark);

//     if (mode === "remark") {
//       return { kind: "remark", toStage: null, remark: r };
//     }

//     if (mode === "custom") {
//       const cs = safeTrim(customStage);
//       // If stage is empty but remark exists, treat as remark-only
//       if (!cs && r) return { kind: "remark", toStage: null, remark: r };
//       return { kind: "stage_change", toStage: cs || null, remark: r };
//     }

//     // quick
//     return { kind: "stage_change", toStage: safeTrim(quickStage), remark: r };
//   }

//   async function handleSubmit() {
//     if (!canSubmit || status === "saving") return;

//     setStatus("saving");

//     try {
//       const payload = buildPayload();
//       await Promise.resolve(onAddUpdate(payload));

//       setStatus("saved");
//       onNotify?.("Update added");

//       // reset inputs (keep quick stage selection as-is)
//       setRemark("");
//       setCustomStage("");

//       window.setTimeout(() => setStatus("idle"), 900);
//     } catch (e) {
//       setStatus("idle");
//       onNotify?.("Could not add update", "error");
//     }
//   }

//   return (
//     <div className="p-4 rounded-xl border border-slate-200 bg-white">
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
//         <div className="grid grid-cols-3">
//           <TabButton active={mode === "quick"} onClick={() => setMode("quick")}>
//             Quick Stage
//           </TabButton>
//           <TabButton
//             active={mode === "custom"}
//             onClick={() => setMode("custom")}
//           >
//             Custom
//           </TabButton>
//           <TabButton
//             active={mode === "remark"}
//             onClick={() => setMode("remark")}
//           >
//             Remark
//           </TabButton>
//         </div>
//       </div>

//       <div className="mt-3 grid gap-3">
//         {mode === "quick" && (
//           <div className="flex flex-wrap gap-2">
//             {QUICK_STAGES.map((s) => (
//               <button
//                 key={s}
//                 type="button"
//                 onClick={() => setQuickStage(s)}
//                 className={`text-xs px-3 py-1.5 rounded-full border transition
//                   ${
//                     quickStage === s
//                       ? "bg-slate-900 text-white border-slate-900"
//                       : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-white"
//                   }`}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>
//         )}

//         {mode === "custom" && (
//           <input
//             value={customStage}
//             onChange={(e) => setCustomStage(e.target.value)}
//             placeholder="Type your custom stage (e.g., 'Draft para-wise comments')"
//             className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
//           />
//         )}

//         <textarea
//           value={remark}
//           onChange={(e) => setRemark(e.target.value)}
//           placeholder={
//             mode === "remark"
//               ? "Write your remark (required in this tab)"
//               : "Remarks (optional but recommended)"
//           }
//           rows={3}
//           className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
//         />

//         <div className="flex items-center justify-between gap-3">
//           <div className="text-xs text-slate-500">
//             Tip: each update becomes a timeline milestone.
//           </div>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={!canSubmit || status === "saving"}
//             className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition active:scale-[0.99]
//               ${
//                 status === "saving"
//                   ? "bg-slate-300 text-slate-600 cursor-not-allowed"
//                   : status === "saved"
//                     ? "bg-emerald-600 text-white"
//                     : canSubmit
//                       ? "bg-slate-900 text-white hover:bg-slate-800"
//                       : "bg-slate-200 text-slate-500 cursor-not-allowed"
//               }`}
//           >
//             {status === "saving" ? (
//               <span className="inline-flex items-center justify-center gap-2">
//                 <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
//                 Saving…
//               </span>
//             ) : status === "saved" ? (
//               "Saved ✓"
//             ) : (
//               "Add Update"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// UpdateComposer.propTypes = {
//   currentStage: PropTypes.string,
//   onAddUpdate: PropTypes.func.isRequired, // ({ kind, toStage, remark }) => void
//   onNotify: PropTypes.func, // (message, type?) => void
// };

import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { QUICK_STAGES } from "./constants";
import { safeTrim } from "./utils";

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-xs font-medium transition
        ${active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"}
      `}
      type="button"
      aria-pressed={active}
    >
      {children}
      <div
        className={`mt-1 h-0.5 rounded-full transition ${
          active ? "bg-slate-900" : "bg-transparent"
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">
              Add update
            </div>
            <div className="mt-0.5 text-xs text-slate-500">
              Each update becomes a milestone in the timeline.
            </div>
          </div>

          {/* Tiny status */}
          <div className="text-[11px] text-slate-500">
            Stage:{" "}
            <span className="font-semibold text-slate-700">
              {currentStage || "—"}
            </span>
          </div>
        </div>

        {/* Minimal tabs (no big segmented box) */}
        <div className="mt-3 flex items-center gap-3 border-b border-slate-200">
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
              <div className="text-xs text-slate-600 mb-2">
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
                        className={`text-xs px-3 py-1.5 rounded-full border transition
            ${
              active
                ? "bg-slate-900 text-white border-slate-900"
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

              <div className="mt-1 text-[11px] text-slate-500">
                Selected:{" "}
                <span className="font-semibold text-slate-700">
                  {quickStage}
                </span>
              </div>
            </div>
          )}

          {mode === "custom" && (
            <div>
              <div className="text-xs text-slate-600 mb-2">
                Type a custom stage:
              </div>
              <input
                value={customStage}
                onChange={(e) => setCustomStage(e.target.value)}
                placeholder="e.g., Draft para-wise comments"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <div className="mt-1 text-[11px] text-slate-500">
                Tip: keep it short and action-based.
              </div>
            </div>
          )}

          {/* Remark textarea always visible (but calmer) */}
          <div>
            <div className="text-xs text-slate-600 mb-2">
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
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-[11px] text-slate-500">
              Shortcut: add small remarks frequently.
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || status === "saving"}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-[0.99]
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
