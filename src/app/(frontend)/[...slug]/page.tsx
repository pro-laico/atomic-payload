'use server'
import React from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import getCached from '@/utilities/get/cache'
import { GenerateMetaData } from '@/utilities/generateMetaData'
import { RenderChildren } from '@/components/child/renderChildren'
import LivePreviewListener from '@/components/livePreviewListener'

type Props = { params: Promise<{ slug?: string[] }> }

const slugJoin = (slug: string[] | undefined) => '/' + (slug?.join('/') || '')

export async function generateStaticParams() {
  const routes = await getCached({ tag: 'pages', draft: false })
  if (!routes || !Array.isArray(routes)) return []
  const returns = routes.filter((href) => href !== '/').map((href) => ({ slug: href.split('/').slice(1) }))
  return returns || []
}

export async function generateMetadata({ params: paramsPromise }: Props): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const pages = await getCached({ tag: 'pages', draft })
  const page = await getCached({ tag: 'page', draft, pages, tid: slugJoin(slug) })
  const siteMetadata = await getCached({ tag: 'site-metadata', draft })
  const metadata = GenerateMetaData({ page, siteMetadata })
  return metadata
}

export default async function Page({ params: paramsPromise }: Props) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise

  const pages = await getCached({ tag: 'pages', draft })
  const page = await getCached({ tag: 'page', draft, pages, tid: slugJoin(slug) })
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
