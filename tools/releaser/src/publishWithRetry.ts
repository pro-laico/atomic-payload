import { execFileSync } from 'node:child_process'

// `pnpm`/`npm` are `.cmd` shims on Windows, which Node can only launch via a
// shell. Since args then flow through a shell, validate anything caller-supplied.
const RUN_OPTS = { shell: true } as const

/** Block `ms` milliseconds. The publish loop is synchronous (execFileSync), so we
 *  pause with Atomics.wait rather than `await` — no event loop to yield to. */
function sleep(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

/**
 * Run `pnpm publish` for one package, retrying on failure with backoff. The
 * common transient culprit is `[TLOG_CREATE_ENTRY_ERROR]` — npm's `--provenance`
 * upload to the sigstore transparency log (Rekor) intermittently 500s/times out,
 * unrelated to auth or package contents. Re-publishing is safe: a version already
 * on the registry is rejected as a no-op, and we only reach here for versions
 * `isPublished` said are missing. Returns true on success.
 */
export function publishWithRetry(args: string[], cwd: string, attempts = 3): boolean {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      execFileSync('pnpm', args, { ...RUN_OPTS, cwd, stdio: 'inherit' })
      return true
    } catch {
      if (attempt === attempts) return false
      const backoffMs = 5_000 * attempt
      console.warn(`  publish attempt ${attempt}/${attempts} failed — retrying in ${backoffMs / 1000}s (often a transient sigstore/Rekor tlog error)…`)
      sleep(backoffMs)
    }
  }
  return false
}
