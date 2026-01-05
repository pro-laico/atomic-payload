import { z } from '@/ts/zap'

export const CycleTextSchema = z.ap.add(
  z.object({
    type: z.literal('RunCycleText'),
    key: z.string(),
    initialValue: z.string().nullable().optional(),
    textArray: z.array(z.object({ value: z.string(), initialValue: z.boolean().nullable().optional() })),
    persisted: z.boolean().nullable().optional(),
  }),
  { id: 'RunCycleText' },
)
