import { iconsPlugin } from '@pro-laico/ap-icons'
import { atomicHook } from '@pro-laico/atomic/hook'
import { generateLivePreviewPath, TestPathField } from '@pro-laico/ap-core'

export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    atomicHook,
    livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
    extraSettingsFields: [TestPathField],
  },
})
