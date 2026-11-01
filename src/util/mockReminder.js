import { MOCK_TEST_SCHEDULE } from "./mockSchedule.js";

// The public endpoint returns published tests only. Never infer publication from the static schedule.
export function getMockReminder(tests = [], now = Date.now()) {
  const published = (Array.isArray(tests) ? tests : []).filter(
    (test) =>
      ["active", "upcoming"].includes(test.computedStatus) &&
      (!test.status || test.status === "published") &&
      Number.isFinite(Date.parse(test.startAt)) &&
      Number.isFinite(Date.parse(test.endAt)) &&
      Date.parse(test.endAt) > Date.parse(test.startAt),
  );
  const active = published
    .filter(
      (test) => Date.parse(test.startAt) <= now && now < Date.parse(test.endAt),
    )
    .sort((a, b) => Date.parse(a.endAt) - Date.parse(b.endAt))[0];
  if (active)
    return {
      kind: "active",
      test: active,
      nextChangeAt: Date.parse(active.endAt),
    };
  const upcoming = published
    .filter((test) => Date.parse(test.startAt) > now)
    .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))[0];
  if (upcoming)
    return {
      kind: "upcoming",
      test: upcoming,
      nextChangeAt: Date.parse(upcoming.startAt),
    };
  const scheduled = MOCK_TEST_SCHEDULE.find(
    (test) => Date.parse(test.startAt) > now,
  );
  return scheduled
    ? {
        kind: "scheduled",
        test: scheduled,
        nextChangeAt: Date.parse(scheduled.startAt),
      }
    : null;
}

export function mockReminderNow(response, wallNow, monotonicNow) {
  const server = Date.parse(response?.serverNow),
    received = response?.requestTiming?.receivedAt;
  return Number.isFinite(server) &&
    Number.isFinite(received) &&
    Number.isFinite(monotonicNow)
    ? server + Math.max(0, monotonicNow - received)
    : wallNow;
}
