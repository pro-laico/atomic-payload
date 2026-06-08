'use server'
import { GenerateMetaData } from '@pro-laico/core'
import { getCachedPageByHref, getCachedPages, getCachedSiteMetadata } from '@pro-laico/site/cache'
import { RenderChildren } from '@pro-laico/atomic/children/render'
import LivePreviewListener from '@pro-laico/core/components/frontend/LivePreviewListener'

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

type Props = { params: Promise<{ slug?: string[] }> }

const slugJoin = (slug: string[] | undefined) => `/${slug?.join('/') || ''}`

export async function generateStaticParams() {
  try {
    const routes = await getCachedPages(false)
    if (!routes || !Array.isArray(routes)) return []
    const returns = routes.filter((href) => href !== '/').map((href) => ({ slug: href.split('/').slice(1) }))
    return returns || []
  } catch {
    // e.g. MongoDB unreachable during `next build` in CI — pages are still served dynamically
    return []
  }
}

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const pages = await getCachedPages(draft)
  const page = await getCachedPageByHref(slugJoin(slug), draft, pages)
  const siteMetadata = await getCachedSiteMetadata(draft)
  const metadata = GenerateMetaData({ page, siteMetadata })
  return metadata
}

export default async function Page({ params: paramsPromise }: Props) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  const pages = await getCachedPages(draft)
  const page = await getCachedPageByHref(slugJoin(slug), draft, pages)
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
