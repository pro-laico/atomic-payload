import { generateLivePreviewPath, TestPathField } from '@pro-laico/core'
import { iconsPlugin } from '@pro-laico/icons'

export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
    extraSettingsFields: [TestPathField],
  },
})
