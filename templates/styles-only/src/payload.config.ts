import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { getServerSideURL, revalidateTag } from '@pro-laico/core'
import { fontsPlugin } from '@pro-laico/fonts'
import { createCssHook, type CssProcessorGetCached, stylesPlugin } from '@pro-laico/styles'
import { toJSONSchemaExtensions } from '@pro-laico/zap'
import type { CollectionAfterChangeHook, Config, Plugin, SharpDependency } from 'payload'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { createPages } from '@/collections/pages'
import { Users } from '@/collections/users'

/** Builds the live-preview iframe URL. The styles demo has a single rendered
 *  page (`/`), so every designSet / shortcutSet preview points at the home page;
 *  the secret is required by `createPreviewRouteHandler`. */
const stylesLivePreviewUrl = (): string => {
  const params = new URLSearchParams({
    slug: 'designSet',
    path: '/',
    collection: 'designSet',
    previewSecret: process.env.PREVIEW_SECRET || '',
  })
  return `${getServerSideURL()}/next/preview?${params.toString()}`
}

/**
 * The CSS processor (run inside the standalone `cssHook`) needs a getter for the
 * active designSet, the active shortcutSet, the header/footer atomic classes,
 * and the page `atomic-classes`. Our real `getCached` imports `@payload-config`,
 * so we defer loading it with a dynamic import — that avoids a config-load cycle.
 */
const getCached: CssProcessorGetCached = async (tag, draft) => {
  const mod = await import('@/cache/getCached')
  return (mod.default as unknown as CssProcessorGetCached)(tag, draft)
}

/**
 * A standalone `cssHook` for the `pages` collection. `stylesPlugin` attaches its
 * own cssHook to designSet/shortcutSet; this is the same factory, attached to
 * `pages`, so saving a page collects its `*ClassName` values (including those
 * nested in `layout` blocks) and regenerates the stylesheet to include them.
 */
const pagesCssHook = createCssHook(getCached)

/**
 * `stylesPlugin` wires the CSS generation (`beforeChange`) and delete
 * revalidation (`afterDelete`) for its collections, but not change
 * revalidation. This tiny local plugin appends an `afterChange` hook that
 * busts the frontend cache after the stylesheet is regenerated — that's what
 * makes editing a designSet / shortcutSet in the admin flow through to the
 * page (and to live preview). `revalidateTag('designSet' | 'shortcutSet')`
 * cascades to the `site-css` tag automatically.
 */
const revalidateStyles: CollectionAfterChangeHook = async ({ collection, doc }) => {
  const draft = doc?._status === 'draft'
  await revalidateTag(collection.slug as 'designSet' | 'shortcutSet', draft)
}

const revalidateStylesPlugin: Plugin = (config: Config): Config => {
  for (const collection of config.collections ?? []) {
    if (collection.slug === 'designSet' || collection.slug === 'shortcutSet') {
      collection.hooks = { ...collection.hooks, afterChange: [...(collection.hooks?.afterChange ?? []), revalidateStyles] }
    }
  }
  return config
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  sharp: sharp as unknown as SharpDependency,
  serverURL,
  cors: [serverURL],
  collections: [createPages(pagesCssHook), Users],
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  // No `atomicHook` here — passing `getCached` attaches the standalone `cssHook`,
  // so this plugin processes CSS entirely on its own (no `@pro-laico/atomic`).
  // `storageGlobals` (default true) registers the `draftStorage` /
  // `publishedStorage` globals the generated CSS is written to.
  plugins: [
    // The designSet's Fonts tab has `upload` fields pointing at a `font`
    // collection, so it must be registered for the config to sanitize.
    fontsPlugin({ enabled: true }),
    stylesPlugin({
      enabled: true,
      generateLivePreviewPath: stylesLivePreviewUrl,
      getCached,
    }),
    revalidateStylesPlugin,
  ],
  // `toJSONSchemaExtensions` injects every `@pro-laico/zap`-registered schema
  // (e.g. the styles `TokenString` / `TokenStringArray` token shapes that the
  // designSet fields `$ref`) into the JSON schema `payload generate:types` reads.
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts'), schema: [toJSONSchemaExtensions] },
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./styles-only.db' } }),
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    // Custom dashboard component (seed/reset controls + a link back to the site).
    // The path is resolved relative to `importMap.baseDir` (this `src` dir).
    components: { beforeDashboard: ['/components/admin/BeforeDashboard#default'] },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    meta: {
      titleSuffix: ' - Atomic Payload Styles Demo',
      description: 'A minimal showcase of @pro-laico/styles.',
    },
  },
})
