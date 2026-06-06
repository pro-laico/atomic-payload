import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'
import { buildConfig } from 'payload'
import type { SharpDependency } from 'payload'
import { generateLivePreviewPath } from '@pro-laico/core'
import { iconsPlugin } from '@pro-laico/icons'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { Users } from '@/collections/users'

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
  // The iconSet docs have no resolvable href, so `fallbackPath: '/'` points every
  // iconSet preview at the demo's single rendered page.
  plugins: [iconsPlugin({ iconSetOptions: { livePreviewUrl: (args) => generateLivePreviewPath(args, { fallbackPath: '/' }) } })],
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
