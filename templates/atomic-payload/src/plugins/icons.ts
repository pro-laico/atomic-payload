import { iconsPlugin } from '@pro-laico/ap-icons'
import { atomicHook } from '@pro-laico/ap-atomic-hook'
import { generateLivePreviewPath, TestPathField } from '@pro-laico/ap-utils'

export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    atomicHook,
    livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
    extraSettingsFields: [TestPathField],
  },
})
