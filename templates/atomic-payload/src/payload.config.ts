import path from 'node:path'
import { fileURLToPath } from 'node:url'

//import { resendAdapter } from '@payloadcms/email-resend'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import type { SharpDependency } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { getServerSideURL } from '@pro-laico/core'
import { defaultLexical } from '@pro-laico/richtext/default-lexical'

import { plugins } from '@/plugins'
import Collections from '@/collections'
import { Users } from '@/collections/users'
import { IconPath, LogoPath, SiteTriggersPath } from '@/ui'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  sharp: sharp as unknown as SharpDependency,
  plugins: [...plugins],
  editor: defaultLexical,
  graphQL: { disable: true },
  serverURL: getServerSideURL(), // Used in csrf white list and live preview.
  collections: [...Collections],
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [getServerSideURL()].filter(Boolean),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: mongooseAdapter({ url: process.env.MONGODB_URI || '', collectionsSchemaOptions: { pages: { minimize: true } }, allowAdditionalKeys: false }),
  blocks: [],
  /*   email: resendAdapter({
    defaultFromAddress: 'chad@notifications.atomicpayload.com',
    defaultFromName: 'Chad At Atomic Payload',
    apiKey: process.env.RESEND_API_KEY || '',
  }), */
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      beforeNavLinks: [SiteTriggersPath],
      graphics: { Icon: IconPath, Logo: LogoPath },
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    meta: {
      titleSuffix: ' - Atomic Payload',
      description: 'A Website Builder Where All You Need To Know Is Tailwind.',
      icons: [{ type: 'image/svg+xml', rel: 'icon', url: '/adminFavicon.svg' }],
      openGraph: {
        title: 'Atomic Payload',
        description: 'A Website Builder Where All You Need To Know Is Tailwind.',
        images: [{ height: 630, width: 1200, url: '/ogImage.webp' }],
      },
    },
  },
})
