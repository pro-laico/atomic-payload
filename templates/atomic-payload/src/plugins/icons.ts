import { iconsPlugin } from '@pro-laico/atomic-payload-icons'
import { atomicHook } from '@pro-laico/atomic-payload-atomic-hook'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'
import { TestPathField } from '@pro-laico/ap-utils'

export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    atomicHook,
    livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
    extraSettingsFields: [TestPathField],
  },
})
