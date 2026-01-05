'use server'
import { FormFunction } from '@/ts/types'
import { FrlSimpleSlidingWindow as FrlSimpleSlidingWindowType } from '@/ts/types'

const lastCleanup: Record<string, number> = {}
const memoryStore: Record<string, Record<string, number[]>> = {}

export const FrlSimpleSlidingWindow: FormFunction<{ block: FrlSimpleSlidingWindowType }> = async (args) => {
  const { context, response, block } = args
  const { backendFormID, ip } = context
  const { rateLimit, rateLimitPeriod, validationMessage } = block

  // Ensure store for this formID exists. (The store unifies all front end forms rate limiting to the backend form.)
  if (!memoryStore[backendFormID]) memoryStore[backendFormID] = {}
  if (!lastCleanup[backendFormID]) lastCleanup[backendFormID] = 0

  const now = Date.now()
  const windowStart = now - rateLimitPeriod * 60000

  const timestamps = memoryStore[backendFormID][ip] || []
  const recentRequests = timestamps.filter((ts) => ts > windowStart)

  // Add the current request to the store.
  memoryStore[backendFormID][ip] = [...recentRequests, now]

  // Only run cleanup for this formID if rateLimitPeriod has passed since last cleanup
  if (now - lastCleanup[backendFormID] > rateLimitPeriod * 60000) {
    Object.keys(memoryStore[backendFormID]).forEach((ipKey) => {
      const filtered = memoryStore[backendFormID][ipKey].filter((ts) => ts > windowStart)
      if (filtered.length === 0) delete memoryStore[backendFormID][ipKey]
      else memoryStore[backendFormID][ipKey] = filtered
    })
    lastCleanup[backendFormID] = now
  }

  if (recentRequests.length >= rateLimit) {
    const earliest = Math.min(...recentRequests)
    const durationMs = earliest + rateLimitPeriod * 60000 - now
    response.success = false
    context.waitFor = durationMs
    response.fm = validationMessage
    return args
  }

  return args
}
