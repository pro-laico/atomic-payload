export { createSeedEndpoint } from './endpoint'
export type { SeedFn, SeedPluginOptions } from './plugin'
export { default, seedPlugin } from './plugin'
export { seed } from './seed'
// `BeforeDashboard` and `SeedButton` are admin-side React components rendered
// through Payload's import map. Reference them by the component-path constant
// below rather than importing them at config time.
export const BeforeDashboardPath = '@pro-laico/seed/admin/beforeDashboard'
