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
  //
  // `usagePanel: true` adds the "Requested icons" panel to the IconSet edit view.
  // `pnpm generate:icons` scans the frontend for the app's icon component
  // (`IconChildTile`, see package.json) and writes the names it requests into a
  // manifest; the panel diffs that against the set's icons. The seeded set
  // defines `arrow-right/check/cog/heart/star/x`, while the demo page requests a
  // `y` tile — so `y` shows as missing until you rename `x` to `y` (the live
  // preview walkthrough below).
  plugins: [
    iconsPlugin({
      iconSetOptions: {
        livePreviewUrl: (args) => generateLivePreviewPath(args, { fallbackPath: '/' }),
        usagePanel: true,
      },
      // Registers the `iconRequest` collection and makes `<Icon>` record names
      // that fail to resolve at runtime (throttled, fire-and-forget). The demo
      // page renders `<IconChildTile name="y" />`, which the seeded set doesn't
      // define — so visiting the page logs `y` as a live miss, and the usage
      // panel's "Missing from this set" list flags it with a live count.
      trackRequests: true,
    }),
  ],
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
