import { z } from '@/ts/zap'
import { ActionDefaultFunction, ActionProcessFunction, ActionSetKeyInitialByBlock } from '@/ts/types/actions'

const setKeyInitialByBlock: ActionSetKeyInitialByBlock = ({ block }) => {
  if (block.blockType === 'AtomicChild' && block.buttonType === 'portal' && block.portalName) {
    const { portalName, persisted, pops } = block
    if (block.portalType === 'dialog') return { key: portalName, persisted, initialValue: Boolean(block.ds?.defaultOpen) }
    return { key: portalName, persisted, initialValue: Boolean(pops?.defaultOpen) }
  }
}

const processFunction: ActionProcessFunction<'ActSetPortalOpen'> = ({ setDA, portal, initialValuesMap, usePortal, data }) => {
  const key = portal || usePortal
  if (!key) throw new Error('ActFormError: formName or useForm is required')

  const iv = initialValuesMap.get(key)
  if (!iv) console.warn('ActFormError: No portal found with the key:', key)

  const Run: z.ap.Type<'RunSetBool'> = { type: 'RunSetBool', key, initialValue: Boolean(iv?.initialValue), persisted: Boolean(iv?.persisted) }
  data.runners.push(Run)

  if (setDA) {
    const Att: z.ap.Type<'AttBoolToDA'> = { type: 'AttBoolToDA', key, initialValue: Boolean(iv?.initialValue), persisted: Boolean(iv?.persisted) }
    data.attributers.push(Att)
  }
}

const triggerDefaults: ActionDefaultFunction = ({ block, usePortal, data }) => {
  if (block.blockType !== 'AtomicChild') return
  const { portalType, ds, portalName, type, buttonType, persisted, pops } = block
  const key = portalName || usePortal
  if (!key) return

  if (type === 'button' && buttonType === 'portal' && !data.actions?.includes('ActSetPortalOpen')) {
    data.actions.push('ActSetPortalOpen')
    const initialValue = portalType === 'dialog' ? ds?.defaultOpen : pops?.defaultOpen

    const Run: z.ap.Type<'RunSetBool'> = { type: 'RunSetBool', key, persisted: Boolean(persisted), initialValue: Boolean(initialValue) }
    data.runners.push(Run)
  }
}

export const ActSetPortalOpen = { setKeyInitialByBlock, processFunction, triggerDefaults }
