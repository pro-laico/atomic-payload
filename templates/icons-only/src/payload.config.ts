import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { getServerSideURL } from '@pro-laico/core'
import { iconsPlugin } from '@pro-laico/icons'
import type { SharpDependency } from 'payload'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from '@/collections/users'

/** Builds the live-preview iframe URL for IconSet edits. The icons demo has a
 *  single rendered page (`/`), so all iconSet previews point at the home page;
 *  the secret is required by `createPreviewRouteHandler`. */
const iconSetLivePreviewUrl = (): string => {
  const params = new URLSearchParams({
    slug: 'iconSet',
    path: '/',
    collection: 'iconSet',
    previewSecret: process.env.PREVIEW_SECRET || '',
  })
  return `${getServerSideURL()}/next/preview?${params.toString()}`
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  sharp: sharp as unknown as SharpDependency,
  serverURL,
  cors: [serverURL],
  collections: [Users],
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  plugins: [iconsPlugin({ enabled: true, iconSetOptions: { livePreviewUrl: iconSetLivePreviewUrl } })],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./icons-only.db' } }),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    meta: {
      titleSuffix: ' - Atomic Payload Icons Demo',
      description: 'A minimal showcase of @pro-laico/icons.',
    },
  },
})
