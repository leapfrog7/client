# Quiz-flow browser regression tests

Requires Node 22, Playwright and an installed Chromium browser.
No application dependency or lockfile changes are needed for this laptop: an isolated Playwright installation is under workspace tools/browser.

From C:\Users\HP\Documents\GitHub\Undersigned, start a separate local Vite instance in terminal 1:

.\tools\node\node-v22.23.3-win-x64\node.exe .\undersigned\client\node_modules\vite\bin\vite.js .\undersigned\client --host 127.0.0.1 --port 5181 --strictPort

Or start Vite from the client directory with Node 22 and those host/port options.

In terminal 2, from the workspace root:

$env:PLAYWRIGHT_MODULE_PATH = "$PWD\tools\browser\node_modules\playwright"
$env:TEST_BASE_URL = "http://127.0.0.1:5181"
.\tools\node\node-v22.23.3-win-x64\node.exe --test .\undersigned\client\tests\quiz-flow.test.cjs

For another machine, install/use Playwright separately and set PLAYWRIGHT_MODULE_PATH to its module path, or make playwright resolvable normally.
The default browser channel is msedge. Set BROWSER_CHANNEL to another installed Chromium channel if needed.
TEST_BASE_URL must use localhost/loopback. All API responses are intercepted with synthetic fixtures. External requests are blocked and service workers are disabled in temporary browser contexts.

Coverage:
- One question batch and one bookmark fetch after topic identity resolves.
- Successful submission updates progress without replacing results.
- Failed submission does not refresh progress.
- Failed progress refresh retries without another submission.
- Random mode after results starts a fresh quiz; repeated questions use authoritative coverage.
- Take Another Quiz starts with clean active state.
- Events for a different user/topic do not refresh this header.
- Unanswered questions remain included in submission payloads.

These tests verify frontend behavior and the API contract shape, not real database persistence, scoring implementation or concurrency.
## Mock-test schedule regression tests

The frontend suite also includes tests/mock-schedule.test.cjs.
With the same local Vite server and PLAYWRIGHT_MODULE_PATH described above:
node --test tests/quiz-flow.test.cjs tests/mock-schedule.test.cjs

The schedule suite covers guest/paid/unpaid banners, API-failure/mobile rendering and IST-correct Admin draft creation in a non-Indian browser timezone.
Backend and integrated browser checks are in server/tests/mock-flow.test.cjs; see the workspace MOCK-TEST-RESTART.md for safe local-only database setup and commands.
