import { z } from '@pro-laico/zap'
import { AllActionBlocks } from './blocks'

export const ActionBlockType = z.ap.add(z.enum(AllActionBlocks.map((block) => block.slug)), { id: 'ActionBlockType' })
