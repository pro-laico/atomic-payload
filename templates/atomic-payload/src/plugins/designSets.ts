import { atomicHook } from '@pro-laico/atomic/hook'
import { generateLivePreviewPath } from '@pro-laico/core'
import { designSetsPlugin } from '@pro-laico/design-sets'

export const designSetsPluginConfig = designSetsPlugin({
  atomicHook,
  generateLivePreviewPath,
})
