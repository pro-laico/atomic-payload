import { z } from '@/ts/zap'
import sanitationBlocks from './sanitation/blocks'
import validationBlocks from './validation/blocks'
import rateLimitBlocks from './rateLimiting/blocks'

export const FormRateLimitBlockType = z.ap.add(z.enum(rateLimitBlocks.map((block) => block.slug)), { id: 'FormRateLimitBlockType' })
export const FormSanitationBlockType = z.ap.add(z.enum(sanitationBlocks.map((block) => block.slug)), { id: 'FormSanitationBlockType' })
export const FormValidationBlockType = z.ap.add(z.enum(validationBlocks.map((block) => block.slug)), { id: 'FormValidationBlockType' })
