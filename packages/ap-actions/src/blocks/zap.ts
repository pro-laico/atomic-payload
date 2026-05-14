import { z } from '@pro-laico/ap-zap'
import { AllActionBlocks } from './blocks'

export const ActionBlockType = z.ap.add(z.enum(AllActionBlocks.map((block) => block.slug)), { id: 'ActionBlockType' })
