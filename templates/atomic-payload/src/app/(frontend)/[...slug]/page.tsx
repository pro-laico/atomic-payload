'use server'
import { GenerateMetaData } from '@pro-laico/core'
import getCached from '@pro-laico/core/cache/auto'
import { RenderChildren } from '@pro-laico/atomic/children/render'
import LivePreviewListener from '@pro-laico/core/components/frontend/LivePreviewListener'

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug?: string[] }> }

const slugJoin = (slug: string[] | undefined) => `/${slug?.join('/') || ''}`

export async function generateStaticParams() {
  try {
    const routes = await getCached('pages', false)
    if (!routes || !Array.isArray(routes)) return []
    const returns = routes.filter((href) => href !== '/').map((href) => ({ slug: href.split('/').slice(1) }))
    return returns || []
  } catch {
    // e.g. MongoDB unreachable during `next build` in CI â€” pages are still served dynamically
    return []
  }
}

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const pages = await getCached('pages', draft)
  const page = await getCached('page', slugJoin(slug), draft, pages)
  const siteMetadata = await getCached('site-metadata', draft)
  const metadata = GenerateMetaData({ page, siteMetadata })
  return metadata
}

export default async function Page({ params: paramsPromise }: Props) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  const pages = await getCached('pages', draft)
  const page = await getCached('page', slugJoin(slug), draft, pages)
  if (!page) return notFound()

  return (
    <>
      {draft && <LivePreviewListener />}
      <main className={page.mainClassName || undefined}>
        <RenderChildren blocks={page.children} />
      </main>
    </>
  )
}
