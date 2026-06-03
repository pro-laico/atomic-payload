# @pro-laico/atomic — Planned Features & Deferred Work

Forward-looking backlog distilled from `AUDIT.md`. These items are intentionally **not** done today — each needs a design decision, a backing-service choice, or a larger focused pass. The corresponding `AUDIT.md` checkbox stays `[ ]` with an inline annotation; this file is the consolidated roadmap.

## Forms security

### Shared-store rate limiting
- **What:** Back the sliding-window rate limiter with a shared store instead of the module-level `memoryStore`/`lastCleanup` objects.
- **Why deferred:** Needs a backing-service decision. The current in-memory store is per-Lambda — ineffective on Vercel/serverless or any multi-instance deploy (each instance has its own store; cold starts reset it). The single-instance limitation is now documented in code.
- **Options:** Redis/Upstash, or a Payload collection keyed by `backendFormID` + `ip`. Pick the store, then key the sliding window on `backendFormID`+`ip`.
- **Source:** `src/forms/submitForm/form/rateLimiting/simpleSlidingWindow/serverFunction.ts` · AUDIT.md → High.

### Spam protection (honeypot / CAPTCHA / origin)
- **What:** Add spam/abuse defenses to the submission pipeline. None exist today (`grep honeypot|captcha|csrf` finds nothing under `src/`).
- **Why deferred:** Needs product decisions — which defenses, and whether they should be editor-toggleable SVR blocks per form. The public REST bypass is already closed (the server action is now the only write path), so these would live in the SVR pipeline.
- **Options:** (1) honeypot field check — cheap, no deps; (2) `Origin`/`Referer` check against `serverURL`; (3) CAPTCHA/Turnstile SVR block — needs a provider choice + keys.
- **Source:** `src/forms/submitForm/serverFunction.ts` · AUDIT.md → High.

## Hook performance & correctness

### CSS double-pass change-detection
- **What:** Skip the draft CSS pass on publish when the draft CSS is unchanged, instead of always running two full UnoCSS generations serially.
- **Why deferred:** `Promise.all` is **not** a safe fix — both passes write through the same `req` DB transaction (concurrent queries break on Postgres/Mongo). The sound optimization is change-detection, a larger change for a focused perf pass.
- **Source:** `src/hook/createAtomicHook.ts:217-221` · AUDIT.md → Medium.

### Error-failure semantics in `beforeChange`
- **What:** Wrap the CSS-processing and traversal sections in try/catch, log via `payload.logger.error`, and decide the failure mode.
- **Why deferred:** The real question is a product call: should a CSS-generation/traversal failure **abort the save** or let it **proceed with stale stored CSS** (usually safer for editors)? Has correctness implications, so not a drive-by.
- **Source:** `src/hook/createAtomicHook.ts:169` · AUDIT.md → Medium.

### Logger standardization
- **What:** Route remaining `console.*` error/warn sites through a structured logger.
- **Why deferred:** The load-bearing case (`unsetActive`) already moved to `payload.logger.error`. The remaining sites are pure server actions / render helpers with no `req.payload` in scope (`serverFunction.ts`, `SSRProps.ts`) — a clean fix means introducing a shared logger or threading payload, best done alongside the error-semantics decision above.
- **Source:** `src/forms/submitForm/serverFunction.ts:40`, `src/children/render/SSRProps.ts:351-352` · AUDIT.md → Medium.

## Code quality (safe, parked for size)

### Correlated-union refactor in the form processor
- **What:** Replace `fn(augmentedArgs as any)` with a discriminated `switch (type)` calling each form function with its specific arg type.
- **Why deferred:** The `as any` is the classic correlated-union limitation (`formFunctions[type]` is a union of functions, `augmentedArgs` a union of params). The honest fix is a real refactor in a security-sensitive validated path, not a cast swap.
- **Source:** `src/forms/submitForm/formProcessor.ts:194` · AUDIT.md → Low.

## Deprecations

### Remove deprecated `blocks` / `extra` plugin options
- **What:** Drop the `@deprecated` `blocks`/`extra` aliases retained alongside the new options.
- **Why deferred:** Kept for migration so existing configs don't break. Schedule for the next major + CHANGELOG note.
- **Source:** `actions/plugin.ts:15`, `forms/plugin.ts:27`, `children/plugin.ts:43` · AUDIT.md → Low.
