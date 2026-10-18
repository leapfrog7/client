# Exam release — 18 October 2026

This release hardens learner data ownership, Admin-only question writes, account recovery and shared-network limits while preserving existing valid sessions, paid access and the one-time 24-hour trial.

It includes the reviewed registration, public mock and PYQ attempt/recovery work. Topic PDFs remain available in saved results for paid members; full-paper portal printing is paid-only. Public mocks remain free and independent of membership. Ordinary unanswered submitted questions still count as attempted.

The deployed Admin Dashboard source stays unchanged. Pending local Admin recovery/capacity UI is deliberately excluded; protected recovery APIs remain available to a verified Admin. No real mocks are published by this deployment.

Security changes preserve legacy token/version-zero compatibility and accept old answer payloads/receipts. Only a successful password reset revokes that account's old sessions. Credentials/environment settings are not rotated by this release. An unused legacy seed helper has its embedded connection details removed and standalone execution disabled; historical repository copies require a separate coordinated credential rotation.

Validation: 125 automated security, API/database and real-browser checks, frontend production build, plus an isolated actual-app startup/middleware smoke check. Tests use only guarded loopback databases and synthetic/intercepted requests. No live-user login, real email delivery or production write/load testing.

Rollout: backend first, verify /api/v1/health revision and mocksReady, then frontend. Do not clear user storage or rotate the JWT secret. Remaining medium review items (current-affairs races, AI polling, mock opening-time refresh and PYQ storage growth budgets) are follow-up work.
