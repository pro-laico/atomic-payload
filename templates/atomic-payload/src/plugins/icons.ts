import { iconsPlugin } from '@pro-laico/icons'
import { TestPathField } from '@pro-laico/core'

// `livePreviewUrl` defaults to `@pro-laico/core`'s `generateLivePreviewPath`, so
// it no longer needs to be passed here.
export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    extraSettingsFields: [TestPathField],
  },
})
