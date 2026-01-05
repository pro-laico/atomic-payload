import { RunnerType } from '@/ts/types'
import { RunSetCC } from './setCCs/function'
import { RunSetBool } from './setBool/function'
import { RunFunction } from '@/ts/types/actions'
import { RunSetTheme } from './setThemes/function'
import { RunResetForm } from './resetForm/function'
import { RunCycleText } from './cycleText/function'
import { RunSubmitForm } from './submitForm/function'

const RunnerRegistry = { RunCycleText, RunSetBool, RunSetCC, RunSetTheme, RunSubmitForm, RunResetForm }

export const handleRunnerActions: RunFunction<RunnerType[]> = async ({ actions, context }) => {
  const result: ReturnType<RunFunction<RunnerType[]>> = { success: true }
  if (!actions) return { success: false, message: 'No actions to run' }
  for (const action of actions) {
    const runner = RunnerRegistry[action.type] as RunFunction<typeof action.type>
    const result = await runner({ ...action, context })
    if (!result.success) return { success: false, message: result.message }
  }
  return result
}
