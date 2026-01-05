import type { RequestContext, PayloadRequest } from 'payload'
import type { Config, CollectionThatUsesCSSProcessorSlug, CollectionWithStoredAtomicClassesSlug } from '@/ts/types'

/** Document types from collections that include storedAtomicClasses property. E.g., Page | Footer | Header */
export type CollectionsWithStoredAtomicClasses = Config['collections'][CollectionWithStoredAtomicClassesSlug]

export type CollectionThatUsesCSSProcessor = Config['collections'][CollectionThatUsesCSSProcessorSlug]

export type cssProcessorType = (args: {
  draft: boolean
  req: PayloadRequest
  context: RequestContext
  slug: CollectionThatUsesCSSProcessorSlug
}) => Promise<string>
