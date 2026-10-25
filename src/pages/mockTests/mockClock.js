// Count request transit against the clock. The wall anchor also covers device sleep.
export function attemptDeadline(response) {
  const saved = response.data.attempt || response.data;
  const duration = Math.max(0, Date.parse(saved.deadlineAt) - Date.parse(saved.serverNow));
  return { monotonic: (response.requestTiming?.startedAt ?? performance.now()) + duration,
    wall: (response.requestTiming?.wallStartedAt ?? Date.now()) + duration };
}
export function millisecondsLeft(clock) {
  return clock ? Math.max(0, Math.min(clock.monotonic - performance.now(), clock.wall - Date.now())) : 0;
}
