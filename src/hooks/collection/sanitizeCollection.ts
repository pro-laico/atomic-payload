import sanitizeData from '@/utilities/sanitizeData'
import type { CollectionAfterReadHook } from 'payload'

// Would not recommend using this hook, as it is expensive. It is provided in case you want to more easily read recursive data from the database for a short while.
export const sanitizeAfterRead: CollectionAfterReadHook = async ({ doc }) => sanitizeData(doc)
