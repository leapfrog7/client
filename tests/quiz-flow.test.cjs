/* Run with a local Vite server. Every API request is intercepted; no live data is used. */
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright");

const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:5181";
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(new URL(baseURL).hostname),
  "The regression test must target a local frontend.");
const userId = "111111111111111111111111";
const topicId = "222222222222222222222222";
const questionId = "333333333333333333333333";
const token = [
  Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url"),
  Buffer.from(JSON.stringify({
    userId, name: "Regression fixture", userType: "ordinary",
    paymentMade: true, exp: Math.floor(Date.now() / 1000) + 3600,
  })).toString("base64url"),
  "fixture",
].join(".");
let browser;

before(async () => {
  browser = await chromium.launch({
    headless: true, channel: process.env.BROWSER_CHANNEL || "msedge",
  });
});
after(async () => { await browser?.close(); });

async function fixture(options = {}) {
  const context = await browser.newContext({ serviceWorkers: "block" });
  await context.addInitScript((value) => localStorage.setItem("jwtToken", value), token);
  const calls = [], pageErrors = [];
  let saved = false, batch = 0, progressCalls = 0, submissions = 0;
  await context.route("**/*", async (route) => {
    const request = route.request(), url = new URL(request.url());
    if (url.pathname.startsWith("/api/v1/")) {
      const endpoint = url.pathname.slice("/api/v1".length);
      calls.push({ endpoint, method: request.method(), query: url.searchParams,
        body: request.postDataJSON() });
      let status = 200, data = {};
      if (endpoint === "/quiz/getTopicId") {
        await new Promise((resolve) => setTimeout(resolve, 80));
        data = { topicId };
      } else if (endpoint.startsWith("/quiz/progress/")) {
        progressCalls++;
        if (options.failProgressOnce && progressCalls === 2) {
          status = 500; data = { message: "Fixture progress unavailable" };
        } else {
          data = { attemptedQuestions: saved ? 21 : 20, progress: saved ? 21 : 20 };
        }
      } else if (endpoint === "/quiz/getQuiz" || endpoint === "/quiz/getRandomQuiz") {
        batch++;
        data = [{ _id: questionId, questionText: "Fixture batch " + batch,
          options: ["Choice A", "Choice B", "Choice C", "Choice D"],
          correctAnswer: "Choice A", explanation: "Fixture explanation" }];
      } else if (endpoint === "/quiz/fetchAllBookmarks") {
        data = { bookmarks: [] };
      } else if (endpoint === "/quiz/submitQuiz") {
        submissions++;
        if (options.failSubmit) {
          status = 500; data = { message: "Fixture submit failed" };
        } else {
          saved = true;
          data = { result: { correct: 0, total: 1, percent: 0 },
            comparison: { avgBefore: 50, attemptsBefore: 2 },
            attempt: { attemptId: "fixture" } };
        }
      }
      return route.fulfill({ status, contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(data) });
    }
    if (url.origin === new URL(baseURL).origin) return route.continue();
    return route.abort();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseURL + "/pages/quiz/paper-i/Constitution",
    { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Submit", exact: true }).waitFor();
  const heading = page.getByRole("heading", { name: "Constitution", exact: true }).locator("..");
  async function waitForProgress(value) {
    await page.waitForFunction(({ expected }) => {
      const h = [...document.querySelectorAll("h1")].find((e) => e.textContent === "Constitution");
      return h?.parentElement.innerText.includes(expected + "%");
    }, { expected: value });
  }
  return { context, page, heading, calls, pageErrors, waitForProgress,
    get submissions() { return submissions; } };
}

test("initial loading fetches one ready question batch and one bookmark list", async () => {
  const f = await fixture();
  try {
    const questions = f.calls.filter((c) => c.endpoint === "/quiz/getQuiz");
    const bookmarks = f.calls.filter((c) => c.endpoint === "/quiz/fetchAllBookmarks");
    assert.equal(questions.length, 1);
    assert.equal(bookmarks.length, 1);
    assert.equal(questions[0].query.get("topicId"), topicId);
    assert.equal(bookmarks[0].query.get("topicId"), topicId);
    // Header and Tabs each retain their own lookup; output-state refetch is removed.
    assert.equal(f.calls.filter((c) => c.endpoint === "/quiz/getTopicId").length, 2);
    assert.deepEqual(f.pageErrors, []);
  } finally { await f.context.close(); }
});

test("successful submission refreshes counters without replacing submitted questions", async () => {
  const f = await fixture();
  try {
    await f.waitForProgress(20);
    await f.page.getByRole("button", { name: "Submit", exact: true }).click();
    await f.waitForProgress(21);
    assert.equal(await f.page.getByText("Quiz Results", { exact: true }).count(), 1);
    assert.equal(await f.page.getByText("Fixture batch 1", { exact: true }).count(), 1);
    assert.equal(f.calls.filter((c) => c.endpoint === "/quiz/getQuiz").length, 1);
    assert.match(await f.heading.innerText(), /Attempted Questions:\s*21/);
    const submission = f.calls.find((c) => c.endpoint === "/quiz/submitQuiz");
    assert.deepEqual(submission.body.attemptedQuestions, [questionId]);
    assert.deepEqual(submission.body.responses, [{ questionId, selected: null }]);
    assert.deepEqual(f.pageErrors, []);
  } finally { await f.context.close(); }
});

test("failed submission leaves counters unchanged and does not trigger progress refresh", async () => {
  const f = await fixture({ failSubmit: true });
  try {
    await f.waitForProgress(20);
    await f.page.getByRole("button", { name: "Submit", exact: true }).click();
    await f.page.getByText("Failed to submit quiz", { exact: true }).waitFor();
    assert.equal(f.calls.filter((c) => c.endpoint.startsWith("/quiz/progress/")).length, 1);
    assert.match(await f.heading.innerText(), /Attempted Questions:\s*20/);
    assert.equal(await f.page.getByText("Quiz Results", { exact: true }).count(), 0);
  } finally { await f.context.close(); }
});

test("progress refresh can retry without losing results or resubmitting the quiz", async () => {
  const f = await fixture({ failProgressOnce: true });
  try {
    await f.page.getByRole("button", { name: "Submit", exact: true }).click();
    await f.page.getByRole("button", { name: "Retry progress", exact: true }).waitFor();
    assert.equal(await f.page.getByText("Quiz Results", { exact: true }).count(), 1);
    await f.page.getByRole("button", { name: "Retry progress", exact: true }).click();
    await f.waitForProgress(21);
    assert.equal(f.submissions, 1);
    assert.equal(f.calls.filter((c) => c.endpoint === "/quiz/getQuiz").length, 1);
    assert.equal(await f.page.getByText("Fixture batch 1", { exact: true }).count(), 1);
  } finally { await f.context.close(); }
});

test("random mode after results starts a fresh quiz; repeats use server coverage", async () => {
  const f = await fixture();
  try {
    await f.page.getByRole("button", { name: "Submit", exact: true }).click();
    await f.waitForProgress(21);
    await f.page.getByText("Random Questions", { exact: true }).click();
    await f.page.getByRole("button", { name: "Submit", exact: true }).waitFor();
    assert.equal(await f.page.getByText("Quiz Results", { exact: true }).count(), 0);
    assert.equal(await f.page.getByText("Fixture batch 2", { exact: true }).count(), 1);
    await f.page.getByRole("button", { name: "Submit", exact: true }).click();
    await f.page.getByText("Quiz Results", { exact: true }).waitFor();
    await f.page.waitForLoadState("networkidle");
    assert.match(await f.heading.innerText(), /Attempted Questions:\s*21/);
    assert.equal(f.calls.filter((c) => c.endpoint.startsWith("/quiz/progress/")).length, 3);
    assert.equal(f.submissions, 2);
    assert.deepEqual(f.pageErrors, []);
  } finally { await f.context.close(); }
});

test("Take Another Quiz loads a new batch with clean active state", async () => {
  const f = await fixture();
  try {
    await f.page.getByRole("button", { name: "Submit", exact: true }).click();
    await f.waitForProgress(21);
    await f.page.getByRole("button", { name: "Take Another Quiz", exact: true }).click();
    await f.page.getByRole("button", { name: "Submit", exact: true }).waitFor();
    assert.equal(await f.page.getByText("Quiz Results", { exact: true }).count(), 0);
    assert.equal(await f.page.getByText("Fixture batch 2", { exact: true }).count(), 1);
    assert.equal(f.submissions, 1);
  } finally { await f.context.close(); }
});

test("unrelated topic/user submission events do not refresh this header", async () => {
  const f = await fixture();
  try {
    await f.waitForProgress(20);
    await f.page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("quiz:submitted", { detail: {
        userId: "another-user", topicId: "222222222222222222222222",
      } }));
      window.dispatchEvent(new CustomEvent("quiz:submitted", { detail: {
        userId: "111111111111111111111111", topicId: "another-topic",
      } }));
    });
    await f.page.waitForLoadState("networkidle");
    assert.equal(f.calls.filter((c) => c.endpoint.startsWith("/quiz/progress/")).length, 1);
  } finally { await f.context.close(); }
});
