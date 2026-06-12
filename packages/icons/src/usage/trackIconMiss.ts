import 'server-only'

import { after } from 'next/server'
import { getPayload } from 'payload'

import { getPayloadConfig } from '@pro-laico/core/config'

import { recordIconMiss } from './recordMiss'

/** Don't write the same name more than once per this window per process. */
const THROTTLE_MS = 60_000
const lastRecorded = new Map<string, number>()

/**
 * Fire-and-forget runtime recorder for an unresolved icon name. Called by the
 * `<Icon>` server component when a name doesn't resolve. NEVER blocks rendering
 * or throws:
 *
 * - Throttled per name per process (so a hot page doesn't hammer the DB).
 * - Deferred via Next's `after()` so the write runs AFTER the response streams
 *   (and the serverless function stays alive to finish it).
 * - Best-effort: every failure is swallowed, and it's a no-op unless the
 *   `iconRequest` collection is registered (see {@link recordIconMiss}).
 *
 * Force-disable with `ICON_USAGE_TRACKING=false`.
 */
export const trackIconMiss = (name: string): void => {
  if (!name || process.env.ICON_USAGE_TRACKING === 'false') return

  const now = Date.now()
  const last = lastRecorded.get(name)
  if (last !== undefined && now - last < THROTTLE_MS) return
  lastRecorded.set(name, now)

  try {
    after(async () => {
      try {
        const payload = await getPayload({ config: getPayloadConfig() })
        await recordIconMiss(payload, name)
      } catch {
        // Telemetry is best-effort — never surface its failures.
      }
    })
  } catch {
    // `after()` was called outside a request scope (e.g. static prerender) — skip.
  }
}
