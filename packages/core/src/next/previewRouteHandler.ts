import 'server-only'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import type { CollectionSlug, PayloadRequest, SanitizedConfig } from 'payload'
import { getPayload } from 'payload'

type ConfigPromise = Promise<SanitizedConfig> | SanitizedConfig

/** Factory that returns a Next.js `GET` route handler enabling Payload's draft
 *  mode after validating the `previewSecret` query parameter. Pair with
 *  `exitPreviewRouteHandler` at `/next/exit-preview`. Pass the host project's
 *  Payload config (typically `import configPromise from '@payload-config'`). */
export const createPreviewRouteHandler =
  ({ configPromise }: { configPromise: ConfigPromise }) =>
  async (req: NextRequest): Promise<Response> => {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(req.url)

    const slug = searchParams.get('slug')
    const path = searchParams.get('path')
    const previewSecret = searchParams.get('previewSecret')
    const collection = searchParams.get('collection') as CollectionSlug

    if (previewSecret !== process.env.PREVIEW_SECRET) return new Response('You are not allowed to preview this page', { status: 403 })
    if (!path || !collection || !slug) return new Response('Insufficient search params', { status: 404 })
    if (!path.startsWith('/')) return new Response('This endpoint can only be used for relative previews', { status: 500 })

    let user

    try {
      user = await payload.auth({ req: req as unknown as PayloadRequest, headers: req.headers })
    } catch (error) {
      if (process?.env?.LOGS === 'true') console.log('\x1b[38;5;226m%s\x1b[0m', `[Preview] Error verifying token for live preview: ${error}`)
      return new Response('You are not allowed to preview this page', { status: 403 })
    }

    const draft = await draftMode()

    if (!user) {
      draft.disable()
      if (process?.env?.LOGS === 'true') console.log('\x1b[38;5;226m%s\x1b[0m', '[Preview] Draft Disabled')
      return new Response('You are not allowed to preview this page', { status: 403 })
    }

    if (process?.env?.LOGS === 'true') console.log('\x1b[38;5;226m%s\x1b[0m', '[Preview] Draft Enabled')
    draft.enable()

    redirect(path)
  }
