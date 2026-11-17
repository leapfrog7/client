const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path");
const pw = require(process.env.PLAYWRIGHT_MODULE_PATH || "playwright"),
  base = process.env.TEST_BASE_URL || "http://127.0.0.1:5245";
assert.match(base, /^http:\/\/(localhost|127\.0\.0\.1):[0-9]+$/);
const startBrowser = () =>
  process.env.TEST_BROWSER_ENGINE === "webkit"
    ? pw.webkit.launch({ headless: true })
    : pw.chromium.launch({ headless: true, channel: "msedge" });
async function open(
  browser,
  {
    width = 390,
    height = 844,
    startPath = "/",
    member = null,
    mock = false,
    touch = false,
    accessResponse = null,
    storageBlocked = false,
    reviewStatus = 200, reviewDelay = 0, reviewPaidRequired = false, resultRejectMember = false,
  } = {},
) {
  const context = await browser.newContext({
      viewport: { width, height },
      serviceWorkers: "block",
      hasTouch: touch,
      isMobile: touch,
    }),
    page = await context.newPage(),
    errors = [],
    calls = [],
    unexpected = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await context.addInitScript(
    ({ member, mock, storageBlocked, expiry }) => {
      const token = (claims) =>
        "e30." +
        btoa(
          JSON.stringify({
            ...claims,
            exp: expiry,
          }),
        ) +
        ".synthetic";
      if (member)
        localStorage.setItem(
          "jwtToken",
          token({
            userId: "111111111111111111111111",
            name: "Synthetic Participant With A Long Name",
            mobile: "9000000001",
            userType: member === "admin" ? "admin" : "ordinary",
            paymentMade: member === "paid",
          }),
        );
      if (storageBlocked) {
        const set = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          if (key === "undersigned:study-text:v1")
            throw new DOMException(
              "Synthetic storage unavailable",
              "QuotaExceededError",
            );
          return set.call(this, key, value);
        };
      }
      if (mock)
        sessionStorage.setItem(
          "undersigned:mock-session:v1",
          JSON.stringify({
            token: token({}),
            account: {
              id: "synthetic-mock",
              username: "Synthetic Mock",
              mobile: "9000000001",
            },
          }),
        );
    },
    {
      member,
      mock,
      storageBlocked,
      expiry: Math.floor(Date.now() / 1000) + 3600,
    },
  );
  const deadline = new Date(Date.now() + 1800000).toISOString();
  await context.route("**/*", (route) => {
    const req = route.request(),
      u = new URL(req.url()),
      p = u.pathname;
    if (p.startsWith("/api/")) {
      calls.push({ path: p, method: req.method(), authorization: req.headers().authorization || null });
      const reply = (data) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(data),
        });
      if (p.endsWith("/review") && p.startsWith("/api/v1/mocks/tests/")) {
        const response = () => !reviewPaidRequired && reviewStatus === 200 ? reply({success:true,data:{mockTest:{_id:"222222222222222222222222",title:"Synthetic closed paper"},questions:[{_id:"q1",questionText:"Synthetic archive question " + "longword".repeat(20),options:[{optionText:"First choice"},{optionText:"Second choice"}],correctOptionIndex:1,explanation:"Synthetic archive explanation"}]}}) : route.fulfill({status:reviewPaidRequired ? 403 : reviewStatus,contentType:"application/json",body:JSON.stringify({message:"Synthetic review unavailable",code:reviewPaidRequired ? "PAID_REVIEW_REQUIRED" : ""})});
        return reviewDelay ? new Promise(resolve=>setTimeout(()=>resolve(response()),reviewDelay)) : response();
      }
      if (p.endsWith("/result")) {
        const memberHeader = req.headers().authorization;
        if(resultRejectMember && memberHeader) return route.fulfill({status:401,contentType:"application/json",body:"{}"});
        return reply({success:true,data:{attemptId:"222222222222222222222222",isFinal:true,status:"submitted",score:10,scoreAvailable:true,correctCount:1,wrongCount:0,unattemptedCount:0,accuracy:100,reviewRequiresMember:false,mockTest:{title:"Synthetic submitted mock",endAt:new Date(Date.now()-10000).toISOString()},...{review:[{question:{_id:"q1",questionText:"Synthetic personal review",options:[{optionText:"First choice"},{optionText:"Second choice"}],correctOptionIndex:1,explanation:"Synthetic personal explanation"},userAnswer:{selectedOptionIndex:1}}]}}});
      }
      if (p === "/api/v1/auth/access")
        return accessResponse === "failure"
          ? route.fulfill({
              status: 503,
              contentType: "application/json",
              body: "{}",
            })
          : reply(
              accessResponse || {
                tier:
                  member === "trial"
                    ? "trial_active"
                    : member === "paid"
                      ? "paid"
                      : member === "admin"
                        ? "admin"
                        : "trial_expired",
                paymentMade: member === "paid",
                userType: member === "admin" ? "admin" : "ordinary",
              },
            );
      if (p === "/api/v1/quiz/getUserStats") return reply(null);
      if (p === "/api/v1/mocks/tests")
        return reply({
          success: true,
          data: [{_id:"222222222222222222222222",title:"Synthetic closed paper",computedStatus:"closed",startAt:new Date(Date.now()-86400000).toISOString(),endAt:new Date(Date.now()-10000).toISOString(),totalQuestions:1},{_id:"333333333333333333333333",title:"Synthetic upcoming paper",computedStatus:"upcoming",startAt:new Date(Date.now()+86400000).toISOString(),endAt:new Date(Date.now()+2*86400000).toISOString()}],
          serverNow: new Date().toISOString(),
        });
      if (p === "/api/v1/public/resources") return reply([]);
      if (mock && p.endsWith("/resume"))
        return reply({
          success: true,
          data: {
            attempt: {
              _id: "222222222222222222222222",
              isFinal: false,
              status: "in_progress",
              answerRevision: 0,
              deadlineAt: deadline,
              serverNow: new Date().toISOString(),
              currentQuestionIndex: 0,
              answers: [
                {
                  questionId: "q1",
                  selectedOptionIndex: null,
                  isVisited: true,
                },
                {
                  questionId: "q2",
                  selectedOptionIndex: null,
                  isVisited: false,
                },
              ],
            },
            mockTest: {
              title: "Synthetic timed mock",
              durationMinutes: 30,
              totalQuestions: 2,
              correctMarks: 1,
              negativeMarks: 0,
            },
            questions: [
              {
                _id: "q1",
                questionText: "Synthetic mock question",
                options: [
                  { optionText: "Synthetic option A" },
                  { optionText: "Synthetic option B" },
                ],
              },
              {
                _id: "q2",
                questionText: "Second synthetic question",
                options: [
                  { optionText: "Choice A" },
                  { optionText: "Choice B" },
                ],
              },
            ],
          },
        });
      if (mock && p.endsWith("/clock"))
        return reply({
          success: true,
          data: {
            deadlineAt: deadline,
            serverNow: new Date().toISOString(),
            isFinal: false,
          },
        });
      if (mock && p.endsWith("/save")) {
        const data = req.postDataJSON();
        return reply({
          success: true,
          data: {
            attempt: {
              isFinal: false,
              answerRevision: (data.revision || 0) + 1,
            },
          },
        });
      }
      if (req.method() !== "GET") {
        unexpected.push(p);
        return route.fulfill({
          status: 403,
          contentType: "application/json",
          body: "{}",
        });
      }
      return reply({});
    }
    if (u.origin === base && ["GET", "HEAD"].includes(req.method()))
      return route.continue();
    return route.fulfill({ status: 204, body: "" });
  });
  await page.goto(base + startPath, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page
    .locator("nav").first()
    .waitFor()
    .catch((error) => {
      console.error({ errors, body: "Navigation shell did not render" });
      throw error;
    });
  return { page, context, errors, calls, unexpected, deadline };
}
const drawer = (p) =>
  p.getByRole("dialog", { name: "Mobile navigation", exact: true });
async function show(p) {
  await p.getByRole("button", { name: "Open menu", exact: true }).click();
  await drawer(p).waitFor();
}
async function closed(p) {
  await drawer(p).waitFor({ state: "hidden" });
  await p.waitForFunction(
    () =>
      !document.documentElement.classList.contains("overflow-hidden") &&
      !document.body.classList.contains("overflow-hidden"),
  );
}
function clean(b) {
  assert.deepEqual(b.errors, []);
  assert.deepEqual(b.unexpected, []);
}
async function shot(p, name) {
  if (!process.env.NAV_SCREENSHOT_DIR) return;
  fs.mkdirSync(process.env.NAV_SCREENSHOT_DIR, { recursive: true });
  await p.screenshot({
    path: path.join(process.env.NAV_SCREENSHOT_DIR, name + ".png"),
  });
}
module.exports = { startBrowser, open, drawer, show, closed, clean, shot };
