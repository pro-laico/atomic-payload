import type { RunFunction, ImplementedStorageTypes } from '@/ts/types'

export const RunSubmitForm: RunFunction<'RunSubmitForm'> = async ({
  formName,
  context: {
    atomicStore: { setValue, getValue },
  },
}) => {
  if (!formName) return { success: false, message: '[RunSubmitForm] Form name is missing.' }

  const ifs = getValue(formName, false)
  if (ifs === 'setPending' || ifs === 'pending') return { success: false, message: '[RunSubmitForm] Form already pending' }

  setValue(formName, 'setPending', false)

  let formStatus: ImplementedStorageTypes = 'setPending'
  const startTime = Date.now()
  const timeout = 20000 // 20 seconds
  while (formStatus === 'setPending' || formStatus === 'pending') {
    await new Promise((resolve) => setTimeout(resolve, 100))
    formStatus = getValue(formName, false)
    if (Date.now() - startTime > timeout) {
      setValue(formName, 'error', false)
      return { success: false, message: '[RunSubmitForm] Form submission timed out' }
    }
  }

  if (formStatus === 'success') return { success: true }
  if (formStatus === 'error') return { success: false, message: 'Form failed' }

  return { success: false, message: `[RunSubmitForm] Unknown form status: ${formStatus}` }
}
