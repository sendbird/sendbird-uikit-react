# E2E tests (Playwright)

End-to-end tests that drive the **real** UIKit against a **real** Sendbird backend in a real
browser. This is the foundation from stabilization ticket 3 (E2E 기반 구조).

## Design principles

- **Reuse `apps/testing`, unmodified.** The app already reads all connection + feature config from
  URL query params (`apps/testing/src/utils/paramsBuilder.ts`), so tests drive it purely via the
  URL (`e2e/utils/env.ts` → `appPath()`). Nothing in `apps/testing` changes, so the Netlify PR
  preview is unaffected.
- **Isolated from the visual suite.** Uses its own `playwright.e2e.config.ts` (testDir `e2e/`);
  the existing `playwright.config.ts` / `yarn test:visual` (apps/visual-test) is untouched.
- **Not a required PR gate.** Runs manually, nightly, or on the `e2e` PR label (`.github/workflows/e2e.yml`).
- **Credentials via env / CI secrets** — never committed. Use a dedicated test App ID / accounts.

## Setup

```bash
# 1. Install the browser once
yarn playwright install chromium

# 2. Provide credentials (dedicated TEST App ID)
cp .env.e2e.sample .env.e2e   # then fill E2E_APP_ID / E2E_USER_ID (+ E2E_ACCESS_TOKEN if needed)
```

## Run

```bash
yarn test:e2e            # starts apps/testing dev server (:5173) and runs the suite
yarn test:e2e:ui         # Playwright UI mode
yarn test:e2e:report     # open the last HTML report
```

Against a deployed preview instead of a local server:

```bash
E2E_BASE_URL=https://deploy-preview-123--<repo>.netlify.app yarn test:e2e
```

Without `E2E_APP_ID` / `E2E_USER_ID`, tests **skip** (they do not fail).

## Environment variables

| Var | Required | Purpose |
|-----|----------|---------|
| `E2E_APP_ID` | yes | Test Sendbird App ID |
| `E2E_USER_ID` | yes | Primary test user |
| `E2E_ACCESS_TOKEN` | no | Only if the App ID enforces tokens |
| `E2E_USER_ID_2` | no | Second user for send/receive scenarios |
| `E2E_BASE_URL` | no | Hit a deployed URL; skips the local dev server |
| `E2E_PORT` | no | Local dev-server port (default 5173) |

## Layout

```
e2e/
  connect.spec.ts   # connect as the configured user + app renders (auth/foundation)
  smoke.spec.ts     # essential flow: open a channel, send a text, see it appear
  utils/env.ts      # credentials + appPath() URL builder
playwright.e2e.config.ts   # E2E Playwright config
tsconfig.node.json         # editor types for the node-side config files (Playwright transpiles at runtime)
```

## Roadmap (ticket 4+)

- Data seeding/teardown (channels + messages via `@sendbird/chat` SDK or Platform API).
- Core scenarios: enter channel → history, send text, receive (2nd user), settings.
- `storageState` / session reuse if login flows are added.
