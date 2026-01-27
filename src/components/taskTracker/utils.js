export function nowIso() {
  return new Date().toISOString();
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  // Friendly but compact
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function diffDays(aIso, bIso) {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  const ms = Math.abs(b - a);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function uid() {
  // modern browsers support this; fallback included
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function safeTrim(s) {
  return (s ?? "").toString().trim();
}

export function deriveLastStageEvent(events = []) {
  // last event that has a toStage
  for (let i = events.length - 1; i >= 0; i--) {
    if (events[i]?.toStage) return events[i];
  }
  return null;
}
