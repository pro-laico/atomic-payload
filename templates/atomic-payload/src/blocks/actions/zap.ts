import { z } from '@/ts/zap'
import { AllActionBlocks } from '@/blocks/actions/blocks'

export const ActionBlockType = z.ap.add(z.enum(AllActionBlocks.map((block) => block.slug)), { id: 'ActionBlockType' })
