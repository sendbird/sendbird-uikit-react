# AGENTS.md

This file is the source of truth for coding-agent instructions in this repository.

## General Agent Guidance

- Follow existing repository instructions first.
- Preserve existing `AGENTS.md`, `CLAUDE.md`, README, CI, release, and owner guidance.
- Do not overwrite repository-specific conventions with generic defaults.

## Safety Rules

- Do not make destructive or irreversible changes without explicit approval.
- Do not bypass branch protection, required checks, required reviewers, scanners, or tests.
- Do not force-push to protected branches or someone else's branch.
- Do not commit secrets, tokens, credentials, customer data, or private keys.
- Do not weaken authentication, authorization, IAM/RBAC, TLS, crypto, network exposure, or data-access controls without explicit approval.
- Do not disable TLS verification except in clearly dev-only code with a written rationale.
- Do not log secrets, auth headers, cookies, payment data, or customer PII.
- Use synthetic test data; do not add real customer data to tests, fixtures, or seed files.

## Review And Escalation

Stop and ask before changing:

- production data, infra, deploy, or config
- secrets, auth, IAM, network exposure, or crypto
- public APIs or compatibility-sensitive behavior
- dependency/security scanner configuration
- anything destructive or hard to roll back

<!-- Add repository-specific coding-agent instructions below this line. -->

## SendbirdChat Instance Model

`SendbirdProvider` is designed to be mounted **once per web application**, at the app root.
It does not pass `newInstance` to `SendbirdChat.init()`, so it uses the cached singleton.

An application that needs more than one instance — several providers, or more than one
`appId` on a page — must opt in explicitly:

```tsx
<SendbirdProvider appId={appId} userId={userId} sdkInitParams={{ newInstance: true }} />
```

Consequences of that model, all expected rather than defects:

- Mounting several providers on one `appId` without `newInstance` shares one instance and one
  WebSocket. State that lives on the instance is therefore shared: the session handler, the
  SDK extensions, and the connected user are whatever the most recent provider set. One
  provider unmounting disconnects the shared socket, and the others do not reconnect.
- Calling `init()` with a different `appId` replaces the singleton: the previous instance is
  released, and anything still holding it — another provider, `SendbirdDesk`, application
  code — will throw once it touches the released instance. A singleton cannot serve two
  appIds; use `newInstance` for the one that should be separate.

So before treating any of the above as a bug, check whether the scenario mounts more than one
provider or uses more than one `appId` without `newInstance`. If it does, it is outside the
model. Deriving `newInstance` inside UIKit is not an acceptable fix — it was the cause of
CLNP-8809, where one provider mount per route navigation produced one SDK instance and one
WebSocket each.