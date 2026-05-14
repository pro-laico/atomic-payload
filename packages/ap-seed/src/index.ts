export { seedPlugin, default } from './plugin'
export type { SeedPluginOptions, SeedFn } from './plugin'
export { createSeedEndpoint } from './endpoint'
export { seed } from './seed'
// `BeforeDashboard` and `SeedButton` are admin-side React components rendered
// through Payload's import map. Reference them by the component-path constant
// below rather than importing them at config time.
export const BeforeDashboardPath = '@pro-laico/ap-seed/admin/beforeDashboard'
