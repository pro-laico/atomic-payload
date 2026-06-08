import { z } from '@pro-laico/zap'

import validationBlocks from './validation/blocks'
import sanitationBlocks from './sanitation/blocks'

export const InputSanitationBlockType = z.ap.add(z.enum(sanitationBlocks.map((block) => block.slug)), { id: 'InputSanitationBlockType' })
export const InputValidationBlockType = z.ap.add(z.enum(validationBlocks.map((block) => block.slug)), { id: 'InputValidationBlockType' })
