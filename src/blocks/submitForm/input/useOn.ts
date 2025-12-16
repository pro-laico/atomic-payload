import sanitationBlocks from './sanitation/blocks'
import validationBlocks from './validation/blocks'

/**
 * Pre-computed mapping of block slugs to their usedOn field types.
 * This is calculated once at module load time to avoid runtime recalculation.
 */
export const useOn = [...sanitationBlocks, ...validationBlocks].map((block) => ({ block: block.slug, usedOn: block.custom?.usedOn }))
