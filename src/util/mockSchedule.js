export const MOCK_TEST_WINDOW_HOURS = 36;
export const MOCK_TEST_WINDOW_MS = MOCK_TEST_WINDOW_HOURS * 60 * 60 * 1000;
export const MOCK_SERIES_START_TEXT = "31 October 2026, 9:00 AM IST";

// Dates are intentionally explicit: no test is scheduled for the 7–8 November break.
export const MOCK_TEST_SCHEDULE = [
  "2026-10-31", "2026-11-14", "2026-11-21", "2026-11-28", "2026-12-05",
].map((date, index) => {
  const startAt = date + "T09:00:00+05:30";
  return {
    title: "Mock Test " + (index + 1),
    startAt,
    endAt: new Date(new Date(startAt).getTime() + MOCK_TEST_WINDOW_MS).toISOString(),
    dateLabel: new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata", day: "2-digit", month: "long", year: "numeric",
    }).format(new Date(startAt)),
  };
});

export function formatMockDateTime(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short",
  }).format(new Date(value)) + " IST";
}

export function formatMockDateForInput(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit",
    day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date(value));
  const fields = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return fields.year + "-" + fields.month + "-" + fields.day + "T" + fields.hour + ":" + fields.minute;
}

export function parseMockInput(value) {
  return new Date(value ? value + "+05:30" : NaN);
}

export function getMockEndInput(startInput) {
  const start = parseMockInput(startInput);
  return Number.isNaN(start.getTime()) ? "" :
    formatMockDateForInput(new Date(start.getTime() + MOCK_TEST_WINDOW_MS));
}
