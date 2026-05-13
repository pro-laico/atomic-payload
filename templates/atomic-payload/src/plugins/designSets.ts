import { designSetsPlugin } from '@pro-laico/atomic-payload-design-sets'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'

export const designSetsPluginConfig = designSetsPlugin({
  atomicHook,
  generateLivePreviewPath,
})
