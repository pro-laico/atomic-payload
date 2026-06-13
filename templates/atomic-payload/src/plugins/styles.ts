import { stylesPlugin } from '@pro-laico/styles'
import { fontUploadField } from '@pro-laico/fonts'
import { atomicHook } from '@pro-laico/atomic/hook'

// `stylesPlugin` registers the `designSet` + `shortcutSet` collections and the
// draft/published CSS storage globals. `designSet` and `shortcutSet` are each
// individually toggleable (e.g. `designSet: false` or `shortcutSet: { enabled: false }`).
//
// `atomicHook` (the CSS/forms/actions snapshot) is handed to the plugin so it
// runs on `designSet` / `shortcutSet`, generating their stored CSS on save.
// `generateLivePreviewPath` defaults to `@pro-laico/core`'s helper.
export const stylesPluginConfig = stylesPlugin({
  atomicHook,
  // The designSet's font upload fields are opt-in: inject the group from
  // `@pro-laico/fonts` (whose `fontsPlugin` registers the `font` collection the
  // group's `relationTo` points at).
  designSet: { fontField: fontUploadField() },
  // This template's `jsonSchemaPlugin` already appends zap's
  // `toJSONSchemaExtensions` to `typescript.schema`, so skip the plugin's own
  // pass to avoid a redundant one.
  registerTypescriptSchema: false,
})
