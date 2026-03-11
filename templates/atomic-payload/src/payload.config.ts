import path from 'path'
import sharp from 'sharp'
import Globals from '@/globals'
import { plugins } from '@/plugins'
import { buildConfig } from 'payload'
import Collections from '@/collections'
import { fileURLToPath } from 'node:url'
import { Users } from '@/collections/users'
import JSONSchemaExtensions from '@/ts/JSONSchema'
import ChildrenBlocks from '@/blocks/children/blocks'
//import { resendAdapter } from '@payloadcms/email-resend'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { AllActionBlocks } from '@/blocks/actions/blocks'
import { getServerSideURL } from '@/utilities/get/getURL'
import { defaultLexical } from '@/blocks/children/richText/defaultLexical'
import { IconPath, LogoPath, SiteTriggersPath, BeforeDashboard } from '@/ui'
import FormSanitationBlocks from '@/blocks/submitForm/form/sanitation/blocks'
import FormValidationBlocks from '@/blocks/submitForm/form/validation/blocks'
import FormRateLimitBlocks from '@/blocks/submitForm/form/rateLimiting/blocks'
import InputSanitationBlocks from '@/blocks/submitForm/input/sanitation/blocks'
import InputValidationBlocks from '@/blocks/submitForm/input/validation/blocks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  sharp,
  plugins: [...plugins],
  globals: [...Globals],
  editor: defaultLexical,
  graphQL: { disable: true },
  serverURL: getServerSideURL(), // Used in csrf white list and live preview.
  collections: [...Collections],
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [getServerSideURL()].filter(Boolean),
  typescript: { schema: [JSONSchemaExtensions], outputFile: path.resolve(dirname, 'ts/types/payload-types.ts') },
  db: mongooseAdapter({ url: process.env.MONGODB_URI || '', collectionsSchemaOptions: { pages: { minimize: true } }, allowAdditionalKeys: false }),
  blocks: [
    ...ChildrenBlocks,
    ...AllActionBlocks,
    ...FormRateLimitBlocks,
    ...FormSanitationBlocks,
    ...FormValidationBlocks,
    ...InputSanitationBlocks,
    ...InputValidationBlocks,
  ],
  /*   email: resendAdapter({
    defaultFromAddress: 'chad@notifications.atomicpayload.com',
    defaultFromName: 'Chad At Atomic Payload',
    apiKey: process.env.RESEND_API_KEY || '',
  }), */
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    components: {
      beforeDashboard: process.env.INCLUDE_SEED === 'true' ? [BeforeDashboard] : [],
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
