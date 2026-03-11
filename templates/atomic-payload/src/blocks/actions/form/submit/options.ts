import { z } from '@/ts/zap'
import type { ActionProcessFunction, ActionDefaultFunction, ActionSetKeyInitialByBlock } from '@/ts/types'

const setKeyInitialByBlock: ActionSetKeyInitialByBlock = ({ block }) => {
  if (block.blockType === 'AtomicChild' && block.type === 'form' && block.formName) {
    return { key: block.formName, persisted: Boolean(block?.persisted) }
  }
}

const processFunction: ActionProcessFunction<'ActSubmitForm'> = ({ formName, data, useForm, initialValuesMap }) => {
  const key = formName || useForm
  if (!key) throw new Error('ActFormError: formName or useForm is required')

  const hasFormKey = initialValuesMap.get(key)
  if (!hasFormKey) console.warn('ActSubmitForm: No form found with the key:', key)

  const Run: z.ap.Type<'RunSubmitForm'> = { type: 'RunSubmitForm', formName: key }
  data.runners.push(Run)
  const Att: z.ap.Type<'AttFormStatusToDA'> = { type: 'AttFormStatusToDA', key }
  data.attributers.push(Att)
}

const contentDefaults: ActionDefaultFunction = ({ block, data: { actions, attributers } }) => {
  if (block.blockType !== 'AtomicChild') return
  const { formName, type } = block
  if (!formName) return

  if (type === 'form' && !actions?.includes('ActSubmitForm')) {
    actions.push('ActSubmitForm')
    const Att: z.ap.Type<'AttFormStatusToDA'> = { type: 'AttFormStatusToDA', key: formName }
    attributers.push(Att)
  }
}

export const ActSubmitForm = { processFunction, contentDefaults, setKeyInitialByBlock }
