import './types/payload'

export { Footer } from './collections/footers/collection'
export { Header } from './collections/headers/collection'
export { Pages } from './collections/pages/collection'
export type { SitePluginOptions } from './plugin'
export { default, sitePlugin } from './plugin'

// The React components live at `@pro-laico/site/components/frontend` to
// keep client-component imports out of any consumer that only needs the
// Payload-side collection configs (e.g. payload.config.ts).

export { COLLECTION_SLUGS_WITH_ATOMIC_HOOK } from './collections/pages/atomicHookSlugs'
export { SEOTab } from './collections/pages/tabs/SEO'
export { SettingsTab } from './collections/pages/tabs/settings'
export { Settings } from './globals/settings'
export { SiteMetaData } from './globals/siteMetaData'
