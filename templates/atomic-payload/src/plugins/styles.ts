import { stylesPlugin } from '@pro-laico/styles'
import { fontUploadField } from '@pro-laico/fonts'

// `stylesPlugin` registers the `designSet` + `shortcutSet` collections and the
// draft/published CSS storage globals. `designSet` and `shortcutSet` are each
// individually toggleable (e.g. `designSet: false` or `shortcutSet: { enabled: false }`).
//
// The `atomicHook` (CSS/forms/actions snapshot) is wired by `pluginComposer` (see
// ./index), and `generateLivePreviewPath` defaults to `@pro-laico/core`'s helper,
// so neither is passed here anymore.
export const stylesPluginConfig = stylesPlugin({
  // The designSet's font upload fields are opt-in: inject the group from
  // `@pro-laico/fonts` (whose `fontsPlugin` registers the `font` collection the
  // group's `relationTo` points at).
  designSet: { fontField: fontUploadField() },
  // This template's `jsonSchemaPlugin` already appends zap's
  // `toJSONSchemaExtensions` to `typescript.schema`, so skip the plugin's own
  // pass to avoid a redundant one.
  registerTypescriptSchema: false,
})
