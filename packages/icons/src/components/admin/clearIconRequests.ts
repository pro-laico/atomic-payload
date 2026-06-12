'use server'

import { headers as nextHeaders } from 'next/headers'
import { type CollectionSlug, getPayload } from 'payload'

import { getPayloadConfig } from '@pro-laico/core/config'

import { ICON_REQUEST_SLUG } from '../../collections/iconRequest'

/**
 * Server action behind the IconSet usage panel's "Clear runtime requests"
 * button: deletes every row in the `iconRequest` collection so the panel's live
 * miss list starts fresh (e.g. after you've added the missing icons).
 *
 * Auth-gated to the logged-in admin via the request headers, and the delete
 * runs with `overrideAccess: false` so the collection's own `authd` access
 * still applies. A no-op (reported as such) when tracking isn't enabled.
 */
export async function clearIconRequests(): Promise<{ success: boolean; message: string }> {
  try {
    const payload = await getPayload({ config: getPayloadConfig() })
    const { user } = await payload.auth({ headers: await nextHeaders() })
    if (!user) return { success: false, message: 'Not authorized to clear icon requests.' }
    if (!(payload.collections as Record<string, unknown>)?.[ICON_REQUEST_SLUG]) {
      return { success: false, message: 'Request tracking is not enabled.' }
    }

    const res = await payload.delete({
      collection: ICON_REQUEST_SLUG as CollectionSlug,
      where: { id: { exists: true } },
      user,
      overrideAccess: false,
    })
    const count = res.docs?.length ?? 0
    return { success: true, message: `Cleared ${count} runtime request${count === 1 ? '' : 's'}.` }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : 'Failed to clear icon requests.' }
  }
}
