import { atomicHook } from '@pro-laico/atomic/hook'
import { generateLivePreviewPath } from '@pro-laico/core'
import { stylesPlugin } from '@pro-laico/styles'

// `stylesPlugin` registers the `designSet` + `shortcutSet` collections and the
// draft/published CSS storage globals. `designSet` and `shortcutSet` are each
// individually toggleable (e.g. `designSet: false` or `shortcutSet: { enabled: false }`).
export const stylesPluginConfig = stylesPlugin({
  atomicHook,
  generateLivePreviewPath,
})
