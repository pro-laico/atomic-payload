import { designSetsPlugin } from '@pro-laico/ap-design-sets'
import { atomicHook } from '@pro-laico/ap-atomic-hook'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'

export const designSetsPluginConfig = designSetsPlugin({
  atomicHook,
  generateLivePreviewPath,
})
