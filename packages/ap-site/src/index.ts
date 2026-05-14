import './types/payload'

export { sitePlugin, default } from './plugin'
export type { SitePluginOptions } from './plugin'

export { Pages } from './collections/pages/collection'
export { Header } from './collections/headers/collection'
export { Footer } from './collections/footers/collection'
// The React components live at `@pro-laico/ap-site/components/frontend` to
// keep client-component imports out of any consumer that only needs the
// Payload-side collection configs (e.g. payload.config.ts).

export { Settings } from './globals/settings'
export { SiteMetaData } from './globals/siteMetaData'
export { baseStorage } from './globals/storage'

export { SEOTab } from './collections/pages/tabs/SEO'
export { SettingsTab } from './collections/pages/tabs/settings'

export { COLLECTION_SLUGS_WITH_ATOMIC_HOOK } from './collections/pages/atomicHookSlugs'
