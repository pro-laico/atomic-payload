import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'
import { buildConfig } from 'payload'
import type { SharpDependency } from 'payload'
import { imagesPlugin } from '@pro-laico/images'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { Users } from '@/collections/users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:42140'

export default buildConfig({
  // Required for the on-demand transform endpoint (and Payload's own processing).
  sharp: sharp as unknown as SharpDependency,
  serverURL,
  cors: [serverURL],
  collections: [Users],
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  plugins: [
    // Registers the `images` (source) + hidden `generatedImages` (variant cache)
    // collections and the on-demand transform endpoint at `/api/img/:id`. LQIP blur
    // placeholders are generated on upload out of the box (tune via the `blur`
    // option). No storage adapter is configured, so uploads use local disk — fully
    // self-serving on localhost. (Add a cloud storage adapter for production.)
    imagesPlugin(),
  ],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./images-only.db' } }),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    // Dashboard component with the seed/reset controls + a link to the site.
    components: { beforeDashboard: ['/components/admin/BeforeDashboard#default'] },
    meta: {
      titleSuffix: ' - Atomic Payload Images Demo',
      description: 'A minimal showcase of @pro-laico/images.',
    },
  },
})
