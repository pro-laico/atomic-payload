import { designSetsPlugin } from '@pro-laico/atomic-payload-design-sets'
import { atomicHook } from '@pro-laico/atomic-payload-atomic-hook'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'

export const designSetsPluginConfig = designSetsPlugin({
  atomicHook,
  generateLivePreviewPath,
})
