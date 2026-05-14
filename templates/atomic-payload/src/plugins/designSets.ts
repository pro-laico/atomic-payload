import { designSetsPlugin } from '@pro-laico/ap-design-sets'
import { atomicHook } from '@pro-laico/ap-atomic-hook'
import { generateLivePreviewPath } from '@pro-laico/ap-utils'

export const designSetsPluginConfig = designSetsPlugin({
  atomicHook,
  generateLivePreviewPath,
})
