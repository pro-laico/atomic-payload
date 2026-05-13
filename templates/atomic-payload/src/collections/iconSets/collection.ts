import { createIconSetCollection } from '@pro-laico/atomic-payload-icons'
import { TestPathField } from '@/fields/testPath'
import { atomicHook } from '@/hooks/collection/atomicHook/atomicHook'
import { generateLivePreviewPath } from '@/utilities/generatePreviewPath'

export const IconSet = createIconSetCollection({
  atomicHook,
  livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
  extraSettingsFields: [TestPathField],
})
