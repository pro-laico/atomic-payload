'use server'
import React from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import getCached from '@/utilities/get/cache/react'
import { GenerateMetaData } from '@/utilities/generateMetaData'
import { RenderChildren } from '@/components/child/renderChildren'
import LivePreviewListener from '@/components/livePreviewListener'

type Props = { params: Promise<{ slug?: string[] }> }

const slugJoin = (slug: string[] | undefined) => '/' + (slug?.join('/') || '')

export async function generateStaticParams() {
  const routes = await getCached('pages', false)
  if (!routes || !Array.isArray(routes)) return []
  const returns = routes.filter((href) => href !== '/').map((href) => ({ slug: href.split('/').slice(1) }))
  return returns || []
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
