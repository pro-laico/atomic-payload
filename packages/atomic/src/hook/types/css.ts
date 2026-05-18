/**
 * CSS-processor types â€” owned by `@pro-laico/atomic/hook` because the
 * processor implementation lives here (see `src/cssProcessor.ts`).
 */

import type { Config } from '@pro-laico/core'
import type { PayloadRequest, RequestContext } from 'payload'
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
