import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'
import { buildConfig } from 'payload'
import type { CollectionAfterChangeHook, Config, Plugin, SharpDependency } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { generateLivePreviewPath, revalidateTag } from '@pro-laico/core'
import { createCssHook, stylesPlugin } from '@pro-laico/styles'
import { createCssGetCached } from '@pro-laico/styles/cache'

import { createPages } from '@/collections/pages'
import { Users } from '@/collections/users'

/**
 * The standalone `cssHook` needs a `(tag, draft)` getter for the active
 * designSet / shortcutSet and the page `atomic-classes`. `createCssGetCached`
 * builds it from `@pro-laico/styles`'s own cache getters — this demo has no
 * header/footer collections, so none are injected. The getters resolve the
 * Payload config registered in `src/instrumentation.ts`.
 */
const getCached = createCssGetCached()

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

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:42150'

export default buildConfig({
  sharp: sharp as unknown as SharpDependency,
  serverURL,
  cors: [serverURL],
  collections: [createPages(pagesCssHook), Users],
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  // No `atomicHook` here — passing `getCached` attaches the standalone `cssHook`,
  // so this plugin processes CSS entirely on its own (no `@pro-laico/atomic`).
  // `includeStorageGlobals` (default true) registers the `draftStorage` /
  // `publishedStorage` globals the generated CSS is written to.
  plugins: [
    // Only `styles` + `core` are needed. We pass no `fontField`, so the
    // designSet's Fonts tab carries no `font`-collection upload fields — add
    // `@pro-laico/fonts` and `designSet: { fontField: fontUploadField() }` if
    // you want them. `stylesPlugin` also auto-wires the zap schema extension
    // into `typescript.schema`, so `generate:types` works without importing zap.
    stylesPlugin({
      // designSet / shortcutSet docs have no resolvable href, so `fallbackPath: '/'`
      // points every preview at the demo's single rendered page.
      generateLivePreviewPath: (args) => generateLivePreviewPath(args, { fallbackPath: '/' }),
      getCached,
    }),
    revalidateStylesPlugin,
  ],
  // The zap schema extension that `generate:types` needs is appended by
  // `stylesPlugin` itself (see `registerTypescriptSchema`), so nothing to wire here.
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
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
