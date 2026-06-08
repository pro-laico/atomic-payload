import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'
import { fontsPlugin } from '@pro-laico/fonts'

import { Users } from '@/collections/users'
import { FONT_STATIC_DIR } from '@/lib/fontDir'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  serverURL,
  cors: [serverURL],
  collections: [Users],
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  // The Font upload collection + the standalone `fontSet` global (the active
  // sans/serif/mono/display selection — the analog of an iconSet). `fontOptions`
  // keeps the package's default (auth-gated) access and pins a known `staticDir`
  // so the frontend can read the uploaded bytes back. No cache hooks are needed —
  // the home route is `force-dynamic` and reads the global fresh each render.
  plugins: [
    fontsPlugin({
      includeFontSet: true,
      fontOptions: {
        upload: { mimeTypes: ['font/ttf', 'font/woff', 'font/woff2', 'font/otf'], staticDir: FONT_STATIC_DIR },
      },
    }),
  ],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./font-only.db' } }),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    // Dashboard component with the seed/reset controls + a link to the site.
    components: { beforeDashboard: ['/components/admin/BeforeDashboard#default'] },
    meta: {
      titleSuffix: ' - Atomic Payload Fonts Demo',
      description: 'A minimal showcase of @pro-laico/fonts.',
    },
  },
})
