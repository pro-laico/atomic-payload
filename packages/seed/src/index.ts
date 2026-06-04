export { seed } from './seed'
export type { SeedSlugConfig } from './seed'
export { createSeedEndpoint } from './endpoint'
export { default, seedPlugin } from './plugin'
export type { SeedAuthorize, SeedFn, SeedPluginOptions } from './plugin'

// `BeforeDashboard` and `SeedButton` are admin-side React components rendered
// through Payload's import map. Reference them by the `BeforeDashboardPath`
// component-path constant (defined in `./plugin`) rather than importing them
// at config time.
export { BeforeDashboardPath } from './plugin'
