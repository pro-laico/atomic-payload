import { z } from '@/ts/zap'
import type { ActionProcessFunction, ActionSetKeyInitialByAction } from '@/ts/types'

const setKeyInitialByAction: ActionSetKeyInitialByAction<'ActDSSetBool'> = (props) => {
  const { key, initialValue, persisted } = props.actionBlock
  return { key, initialValue, persisted }
}

const processFunction: ActionProcessFunction<'ActDSSetBool'> = ({ key, initialValue, persisted, setDA, data }) => {
  const Run: z.ap.Type<'RunSetBool'> = { type: 'RunSetBool', key, initialValue, persisted }
  data.runners.push(Run)
  if (setDA) {
    const Att: z.ap.Type<'AttBoolToDA'> = { type: 'AttBoolToDA', key, initialValue, persisted }
    data.attributers.push(Att)
  }
}

export const ActDSSetBool = { setKeyInitialByAction, processFunction }
