import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import configPromise from '@payload-config'
import manualLogger from '@/utilities/log/manual'
import type { CollectionSlug, PayloadRequest } from 'payload'

export async function GET(req: NextRequest): Promise<Response> {
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
    manualLogger(`[Preview] Error verifying token for live preview: ${error}`)
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  const draft = await draftMode()

  if (!user) {
    draft.disable()
    manualLogger('[Preview] Draft Disabled')
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  // You can add additional checks here to see if the user is allowed to preview this page

  manualLogger('[Preview] Draft Enabled')
  draft.enable()

  redirect(path)
}
