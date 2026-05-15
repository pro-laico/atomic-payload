/**
 * CSS-processor types — owned by `@pro-laico/ap-atomic-hook` because the
 * processor implementation lives here (see `src/cssProcessor.ts`).
 */
import type { RequestContext, PayloadRequest } from 'payload'
import type { Config } from '@pro-laico/ap-types'
import type { CollectionThatUsesCSSProcessorSlug, CollectionWithStoredAtomicClassesSlug } from './payload-augment'

/** Document types from collections that include storedAtomicClasses property. E.g., Page | Footer | Header */
export type CollectionsWithStoredAtomicClasses = Config['collections'][CollectionWithStoredAtomicClassesSlug]

export type CollectionThatUsesCSSProcessor = Config['collections'][CollectionThatUsesCSSProcessorSlug]

export type cssProcessorType = (args: {
  draft: boolean
  req: PayloadRequest
  context: RequestContext
  slug: CollectionThatUsesCSSProcessorSlug
}) => Promise<string>
