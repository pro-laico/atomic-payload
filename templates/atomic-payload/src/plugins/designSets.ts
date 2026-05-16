import { designSetsPlugin } from '@pro-laico/design-sets'
import { atomicHook } from '@pro-laico/atomic/hook'
import { generateLivePreviewPath } from '@pro-laico/core'

export const designSetsPluginConfig = designSetsPlugin({
  atomicHook,
  generateLivePreviewPath,
})
