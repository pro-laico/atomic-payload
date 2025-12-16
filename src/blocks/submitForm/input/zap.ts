import { z } from '@/ts/zap'
import sanitationBlocks from './sanitation/blocks'
import validationBlocks from './validation/blocks'

export const InputSanitationBlockType = z.ap.add(z.enum(sanitationBlocks.map((block) => block.slug)), { id: 'InputSanitationBlockType' })
export const InputValidationBlockType = z.ap.add(z.enum(validationBlocks.map((block) => block.slug)), { id: 'InputValidationBlockType' })
