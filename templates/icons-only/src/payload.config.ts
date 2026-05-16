import path from 'path'
import sharp from 'sharp'
import type { SharpDependency } from 'payload'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { Users } from '@/collections/users'
import { iconsPlugin } from '@pro-laico/icons'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  sharp: sharp as unknown as SharpDependency,
  serverURL,
  cors: [serverURL],
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  collections: [Users],
  plugins: [
    iconsPlugin({ enabled: true }),
  ],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: process.env.MONGODB_URI || '', allowAdditionalKeys: false }),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' - Atomic Payload Icons Demo',
      description: 'A minimal showcase of @pro-laico/icons.',
    },
  },
})
