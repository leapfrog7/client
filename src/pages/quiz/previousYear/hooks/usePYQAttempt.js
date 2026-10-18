import { useCallback, useEffect, useRef, useState } from "react";
import { getUserIdFromToken } from "../../../../util/decodeJWT";
import { pyq, messageFor } from "../pyqApi";

const localFrom = a => ({ answers: Object.fromEntries((a.responses || []).filter(r => r.userAnswer != null).map(r => [String(r.questionId), r.userAnswer])),
  revealed: a.revealed || [], index: a.currentIndex || 0, pendingSubmit: false });
export default function usePYQAttempt(id) {
  const owner = getUserIdFromToken(), key = "pyq-draft:" + owner + ":" + id;
  const [attempt, setAttempt] = useState(null), [local, setLocal] = useState({ answers: {}, revealed: [], index: 0, pendingSubmit: false });
  const [loading, setLoading] = useState(true), [error, setError] = useState(""), [busy, setBusy] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved"), [tick, setTick] = useState(0);
  const state = useRef({}), running = useRef(null), generation = useRef(0), alive = useRef(false), autoSubmitted = useRef(false);
  const persist = useCallback(() => {
    const s = state.current;
    if (!s.attempt || s.attempt.status !== "active" || getUserIdFromToken() !== owner) return;
    try { localStorage.setItem(key, JSON.stringify({ revision: s.attempt.revision, ...s.local })); } catch { /* Server autosave still works if storage is unavailable. */ }
  }, [key, owner]);
  const clearDraft = useCallback(() => { try { localStorage.removeItem(key); } catch { /* Browser storage is optional. */ } }, [key]);
  const change = useCallback(update => {
    const s = state.current;
    if (!s.attempt || s.attempt.status !== "active" || s.local.pendingSubmit || s.busy === "submit") return;
    const next = { ...s.local, ...update };
    state.current = { ...s, local: next, dirty: true }; generation.current++;
    setLocal(next); setSaveStatus("Unsaved changes"); persist();
  }, [persist]);
  const load = useCallback(async () => {
    setLoading(true); setError(""); autoSubmitted.current = false;
    const requestGeneration = ++generation.current;
    try {
      let a = await pyq.get("/attempts/" + id);
      if (a.status === "active") a = await pyq.post("/attempts/" + id + "/resume", {});
      if (!alive.current || getUserIdFromToken() !== owner || requestGeneration !== generation.current) return;
      let restored = localFrom(a), dirty = false, recovered = false;
      try {
        const raw = localStorage.getItem(key), saved = raw ? JSON.parse(raw) : null;
        if (a.status === "active" && saved?.revision === a.revision && saved.answers && Array.isArray(saved.revealed)) {
          const questions = new Map(a.questions.map(q => [String(q._id), q]));
          restored = { answers: Object.fromEntries(Object.entries(saved.answers).filter(([qid, answer]) => questions.get(qid)?.options.includes(answer))),
            revealed: saved.revealed.filter(qid => questions.has(qid)),
            index: Math.min(a.questions.length - 1, Math.max(0, Number(saved.index) || 0)), pendingSubmit: !!saved.pendingSubmit };
          dirty = JSON.stringify(restored.answers) !== JSON.stringify(localFrom(a).answers) || JSON.stringify(restored.revealed) !== JSON.stringify(a.revealed || []) ||
            restored.index !== a.currentIndex || restored.pendingSubmit;
          recovered = dirty;
        } else if (saved) clearDraft();
      } catch { /* Invalid or unavailable browser storage does not prevent loading the saved server version. */ }
      state.current = { attempt: a, local: restored, dirty, syncedAt: performance.now(), busy: "" };
      setAttempt(a); setLocal(restored); setSaveStatus(recovered ? "Recovered unsent answers" : "Saved");
      if (a.status !== "active") clearDraft();
    } catch (e) { if (alive.current && getUserIdFromToken() === owner) setError(messageFor(e)); }
    finally { if (alive.current && requestGeneration === generation.current) setLoading(false); }
  }, [id, key, owner, clearDraft]);
  useEffect(() => { alive.current = true; state.current = {}; load(); return () => { alive.current = false; }; }, [load]);
  const send = useCallback(async action => {
    while (running.current) {
      if (action === "save") return running.current;
      try { await running.current; } catch { /* A final submission includes the retained latest answers even if autosave failed. */ }
    }
    const current = state.current;
    if (!alive.current || getUserIdFromToken() !== owner || !current.attempt || current.attempt.status !== "active") return null;
    if (action === "save" && (!current.dirty || current.local.pendingSubmit)) return null;
    const gen = generation.current;
    if (action === "submit") {
      current.local = { ...current.local, pendingSubmit: true }; setLocal(current.local); persist();
    }
    const payload = { revision: current.attempt.revision, responses: Object.entries(current.local.answers).map(([questionId, userAnswer]) => ({ questionId, selectedOptionIndex: current.attempt.questions.find(q => String(q._id) === questionId).options.indexOf(userAnswer) })),
      revealed: current.local.revealed, currentIndex: current.local.index };
    current.busy = action; setBusy(action); setError(""); setSaveStatus(action === "save" ? "Saving..." : "Confirming...");
    const task = pyq.post("/attempts/" + id + "/" + action, payload).then(a => {
      if (!alive.current || getUserIdFromToken() !== owner || state.current.attempt?._id !== id) return null;
      const latest = state.current, dirty = generation.current !== gen;
      state.current = { ...latest, attempt: a, dirty, busy: "", syncedAt: performance.now() };
      setAttempt(a); setSaveStatus(dirty ? "Unsaved changes" : "Saved");
      if (a.status === "submitted") { state.current.local.pendingSubmit = false; clearDraft(); }
      else if (dirty) persist(); else clearDraft();
      return a;
    }).catch(e => {
      if (alive.current && getUserIdFromToken() === owner) {
        const conflict = e?.response?.data?.code === "PYQ_CONFLICT";
        state.current.conflict = conflict; setError(messageFor(e)); setSaveStatus(conflict ? "Newer version in another tab" : "Not saved — retry");
        persist();
      }
      throw e;
    }).finally(() => { running.current = null; if (alive.current) { state.current.busy = ""; setBusy(""); } });
    running.current = task; return task;
  }, [id, owner, persist, clearDraft]);
  useEffect(() => {
    if (!attempt || attempt.status !== "active") return;
    const timer = setTimeout(() => { if (!state.current.conflict) send("save").catch(() => {}); }, 1200);
    return () => clearTimeout(timer);
  }, [local, attempt, send]);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(n => n + 1);
      if (state.current.dirty && !state.current.conflict && !state.current.local?.pendingSubmit) send("save").catch(() => {});
    }, 10000);
    const beforeUnload = e => { persist(); if (state.current.dirty || state.current.local?.pendingSubmit) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", beforeUnload);
    return () => { clearInterval(timer); window.removeEventListener("beforeunload", beforeUnload); };
  }, [persist, send]);
  useEffect(() => {
    const timer = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  const delta = state.current.syncedAt && attempt?.status === "active" && attempt.lastResumedAt ? (performance.now() - state.current.syncedAt) / 1000 : 0;
  const remaining = attempt?.remainingTime == null ? null : Math.max(0, attempt.remainingTime - delta);
  useEffect(() => {
    if (attempt?.status === "active" && remaining === 0 && !autoSubmitted.current && !local.pendingSubmit) {
      autoSubmitted.current = true; send("submit").catch(() => {});
    }
  }, [attempt, local.pendingSubmit, remaining, send, tick]);
  return { attempt, local, loading, error, busy, saveStatus, remaining, change, send, load,
    usedSeconds: attempt ? attempt.usedSeconds + delta : 0, conflict: state.current.conflict };
}
