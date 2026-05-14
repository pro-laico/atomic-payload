import { iconsPlugin } from '@pro-laico/atomic-payload-icons'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'
import { TestPathField } from '@pro-laico/ap-utils'

export const iconsPluginConfig = iconsPlugin({
  iconSetOptions: {
    atomicHook,
    livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
    extraSettingsFields: [TestPathField],
  },
})
