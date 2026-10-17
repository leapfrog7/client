const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");
const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:5181";
assert.ok(["127.0.0.1", "localhost"].includes(new URL(baseURL).hostname));
const dates = ["31 Oct 2026", "14 Nov 2026", "21 Nov 2026", "28 Nov 2026", "5 Dec 2026"];
const id = "111111111111111111111111";
let browser;
before(async () => { browser = await chromium.launch({ channel: "msedge", headless: true }); });
after(async () => { await browser?.close(); });
async function fixture({ loggedIn = false, admin = false, offline = false, mobile = false, unpaid = false } = {}) {
  const context = await browser.newContext({
    serviceWorkers: "block", timezoneId: "America/Los_Angeles",
    viewport: mobile ? { width: 390, height: 844 } : { width: 1366, height: 900 },
  });
  if (loggedIn || admin) {
    const token = ["fixture", Buffer.from(JSON.stringify({
      userId: id, name: "Schedule Review", userType: admin ? "Admin" : "ordinary",
      paymentMade: !unpaid, exp: Math.floor(Date.now() / 1000) + 3600,
    })).toString("base64url"), "fixture"].join(".");
    await context.addInitScript((value) => localStorage.setItem("jwtToken", value), token);
  }
  const calls = [], errors = []; let draft = null;
  await context.route("**/*", async (route) => {
    const req = route.request(), url = new URL(req.url());
    if (url.pathname.startsWith("/api/v1/")) {
      const p = url.pathname.slice("/api/v1".length);
      calls.push({ path: p, method: req.method(), body: req.postDataJSON() });
      let status = 200, data = {};
      if (p === "/mocks/tests") {
        status = offline ? 500 : 200; data = { success: !offline, data: [], message: "Fixture server unavailable" };
      } else if (p === "/auth/access") data = { tier: "paid", paymentMade: true };
      else if (p === "/quiz/getUserStats") data = { paperI: Array.from({length: 7}, (_, i) => ({title: "Fixture I " + i, topicId: id, progress: "0", attemptedQuestions: 0})), paperII: Array.from({length: 11}, (_, i) => ({title: "Fixture II " + i, topicId: id, progress: "0", attemptedQuestions: 0})) };
      else if (p.startsWith("/quiz/getOverallStats/")) data = { attemptedPaperI: 0, attemptedPaperII: 0, totalQuestions: 100, overallPercentage: 0 };
      else if (p === "/mocks/admin/tests" && req.method() === "POST") {
        draft = { ...req.postDataJSON(), _id: id, status: "draft", computedStatus: "draft",
          activeQuestionCount: 0, isReadyToPublish: false };
        data = { success: true, data: draft };
      } else if (p === "/mocks/admin/tests") data = { success: true, data: draft ? [draft] : [] };
      else if (p.startsWith("/mocks/admin/tests/")) data = { success: true, data: draft };
      else if (p.startsWith("/mocks/questions/")) data = { success: true, data: [], activeQuestionCount: 0 };
      return route.fulfill({ status, contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(data) });
    }
    if (url.origin === new URL(baseURL).origin) return route.continue();
    return route.abort();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  return { page, context, calls, errors };
}

for (const audience of ["guest", "signed-in", "unpaid"]) {
  const loggedIn = audience !== "guest";
  test(audience + " home banner opens the local mock schedule", async () => {
    const f = await fixture({ loggedIn, unpaid: audience === "unpaid" });
    try {
      await f.page.goto(baseURL, { waitUntil: "networkidle" });
      await f.page.getByText("31 October 2026, 9:00 AM IST", { exact: true }).waitFor({ timeout: 5000 }).catch(async (error) => { console.log("Home diagnostic:", await f.page.locator("body").innerText(), f.errors, f.calls); throw error; });
      assert.equal(await f.page.getByText(/31 July/).count(), 0);
      const share = await f.page.getByRole("link", { name: "Share on WhatsApp" }).getAttribute("href");
      assert.match(decodeURIComponent(share), /31 October 2026, 9:00 AM IST/);
      assert.match(decodeURIComponent(share), /36 hours/);
      await f.page.getByRole("link", { name: "View schedule and mock tests" }).click();
      await f.page.getByRole("heading", { name: "Mock test schedule", exact: true }).waitFor();
      assert.equal(new URL(f.page.url()).origin, new URL(baseURL).origin);
      assert.deepEqual(f.errors, []);
    } finally { await f.context.close(); }
  });
}

test("five-date schedule and 36-hour closes remain visible when API is unavailable", async () => {
  const f = await fixture({ offline: true, mobile: true });
  try {
    await f.page.goto(baseURL + "/mock-tests", { waitUntil: "networkidle" });
    const table = f.page.getByRole("table", { name: /October to December/ });
    assert.equal(await table.getByRole("row").count(), 6);
    const text = await table.innerText();
    for (const date of dates) assert.ok(text.includes(date), date);
    assert.ok(text.includes("1 Nov 2026") && text.includes("6 Dec 2026"));
    assert.equal(await f.page.getByText(/No test is scheduled for 7/).count(), 1);
    assert.equal(await f.page.getByText("Unable to load mock tests.", { exact: true }).count(), 1);
    assert.ok(await f.page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    assert.deepEqual(f.errors, []);
  } finally { await f.context.close(); }
});

test("admin selects a schedule date and saves a 36-hour IST draft from a US browser", async () => {
  const f = await fixture({ admin: true });
  try {
    await f.page.goto(baseURL + "/adminDashboard/mocks/new", { waitUntil: "networkidle" });
    const schedule = f.page.getByLabel("Use a scheduled test date (IST)", { exact: true });
    await schedule.waitFor();
    assert.equal(await schedule.locator("option").count(), 6);
    await schedule.selectOption("2026-10-31T09:00:00+05:30");
    const start = f.page.getByLabel("Start Date/Time (IST)", { exact: false });
    const end = f.page.getByLabel("End Date/Time (IST, 36 hours later)", { exact: false });
    assert.equal(await start.inputValue(), "2026-10-31T09:00");
    assert.equal(await end.inputValue(), "2026-11-01T21:00");
    assert.equal(await end.evaluate((el) => el.readOnly), true);
    await start.fill("2026-11-14T09:00");
    assert.equal(await end.inputValue(), "2026-11-15T21:00");
    await f.page.getByRole("button", { name: "Save Mock Test", exact: true }).click();
    await f.page.getByRole("heading", { name: "Mock Test Management", exact: true }).waitFor();
    const saved = f.calls.find((c) => c.path === "/mocks/admin/tests" && c.method === "POST");
    assert.ok(saved, "Save must issue a draft creation request");
    assert.equal(saved.body.startAt, "2026-11-14T03:30:00.000Z");
    assert.equal(saved.body.endAt, "2026-11-15T15:30:00.000Z");
    assert.equal(new Date(saved.body.endAt) - new Date(saved.body.startAt), 36 * 60 * 60 * 1000);
    assert.equal(saved.body.negativeMarks, 0.4166667);
    assert.equal(saved.body.status, undefined);
    assert.deepEqual(f.errors, []);
  } finally { await f.context.close(); }
});
