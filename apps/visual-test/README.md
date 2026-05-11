# Visual and e2e testing

This workspace serves the UIKit visual-test app used by the root Playwright suite.
Run commands from the repository root unless a command explicitly says otherwise.

## Local workflow

1. Install dependencies with `yarn install --immutable`.
2. Start the visual-test app with `yarn workspace @sendbird/visual-test dev`.
3. In another shell, run `yarn test:visual`.

The root `yarn test:visual` command runs `npx playwright test`, which reads `playwright.config.ts` and tests under `__visual_tests__`.

## Updating snapshots

Use Playwright's update flag from the repository root:

```sh
npx playwright test --update-snapshots
```

For a narrower update, pass the spec path:

```sh
npx playwright test __visual_tests__/ui/ui-components.spec.ts --update-snapshots
```

Review changed PNG snapshots before committing. Snapshot files live next to each spec in `*-snapshots` directories.

## Test layout

- `apps/visual-test` contains the dev app and fixtures exposed to Playwright.
- `__visual_tests__/ui` contains reusable UIKit visual cases.
- `__visual_tests__/form` contains form-message visual coverage.
- `playwright.config.ts` defines browser projects, web-server behavior, and snapshot settings.

## CI notes

Visual tests require Playwright browsers. If CI images do not have them cached, install them with:

```sh
yarn playwright install
```

Keep visual-test cases deterministic. Avoid network-only assets, current-time rendering, and random IDs unless the test normalizes them.


