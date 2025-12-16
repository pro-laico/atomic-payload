import type { RunFunction } from '@/ts/types'

export const RunResetForm: RunFunction<'RunResetForm'> = async ({ formName, context }) => {
  if (!formName) return { success: false, message: '[RunResetForm] Form name is missing.' }
  context?.atomicStore.setValue(formName, 'setReset', false)
  return { success: true }
}
