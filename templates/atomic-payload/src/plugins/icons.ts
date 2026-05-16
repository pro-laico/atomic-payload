import { iconsPlugin } from '@pro-laico/icons'
import { atomicHook } from '@pro-laico/atomic/hook'
import { generateLivePreviewPath, TestPathField } from '@pro-laico/core'

export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    atomicHook,
    livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
    extraSettingsFields: [TestPathField],
  },
})
