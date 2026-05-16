import { iconsPlugin } from '@pro-laico/icons'
import { generateLivePreviewPath, TestPathField } from '@pro-laico/core'

export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
    extraSettingsFields: [TestPathField],
  },
})
