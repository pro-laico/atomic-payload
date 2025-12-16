import { z } from '@/ts/zap'
import { SetCCSchema } from './setCCs/zap'
import { SetThemeSchema } from './setThemes/zap'
import { ResetFormSchema } from './resetForm/zap'
import { SetBoolSchema } from './setBool/zap'
import { RunSubmitFormSchema } from './submitForm/zap'
import { CycleTextSchema } from './cycleText/zap'
export { SetCCSchema, SetThemeSchema, CycleTextSchema, SetBoolSchema, ResetFormSchema, RunSubmitFormSchema }

const Runners = [SetCCSchema, SetThemeSchema, CycleTextSchema, SetBoolSchema, ResetFormSchema, RunSubmitFormSchema] as const

export const RunnerRefs = z.ap.add(z.discriminatedUnion('type', Runners), { id: 'Runner' })
export const RunnerRefsArray = z.ap.add(z.array(RunnerRefs), { id: 'Runners' })
export const RunnerTypes = z.ap.add(z.union(Runners.map((runner) => runner.shape.type)), { id: 'RunnerType' })

export const Runner = { ref: RunnerRefs, refs: RunnerRefsArray, types: RunnerTypes }
