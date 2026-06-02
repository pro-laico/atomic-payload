import { atomicHook } from '@pro-laico/atomic/hook'
import { generateLivePreviewPath } from '@pro-laico/core'
import { fontUploadField } from '@pro-laico/fonts'
import { stylesPlugin } from '@pro-laico/styles'

// `stylesPlugin` registers the `designSet` + `shortcutSet` collections and the
// draft/published CSS storage globals. `designSet` and `shortcutSet` are each
// individually toggleable (e.g. `designSet: false` or `shortcutSet: { enabled: false }`).
export const stylesPluginConfig = stylesPlugin({
  atomicHook,
  generateLivePreviewPath,
  // The designSet's font upload fields are opt-in: inject the group from
  // `@pro-laico/fonts` (whose `fontsPlugin` registers the `font` collection the
  // group's `relationTo` points at).
  designSet: { fontField: fontUploadField() },
  // This template's `jsonSchemaPlugin` already appends zap's
  // `toJSONSchemaExtensions` to `typescript.schema`, so skip the plugin's own
  // pass to avoid a redundant one.
  registerTypescriptSchema: false,
})
