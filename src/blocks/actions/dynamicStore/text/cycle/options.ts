import { z } from '@/ts/zap'
import type { ActionProcessFunction, ActionSetKeyInitialByAction } from '@/ts/types'

const setKeyInitialByAction: ActionSetKeyInitialByAction<'ActDSCycleText'> = (props) => {
  const { key, persisted, textArray } = props.actionBlock
  const initialValue = textArray.find((item) => item.initialValue)?.value || textArray[0]?.value
  return { key, initialValue, persisted }
}

const processFunction: ActionProcessFunction<'ActDSCycleText'> = ({ key, persisted, textArray, setDA, data }) => {
  const initialValue = textArray.find((item) => item.initialValue)?.value || textArray[0]?.value
  const cleanTextArray = textArray.map(({ id, ...rest }) => rest)

  const Run: z.ap.Type<'RunCycleText'> = { type: 'RunCycleText', key, persisted, initialValue, textArray: cleanTextArray }
  data.runners.push(Run)

  if (setDA) {
    const Att: z.ap.Type<'AttTextToDA'> = { type: 'AttTextToDA', key, persisted, initialValue }
    data.attributers.push(Att)
  }
}

export const ActDSCycleText = { setKeyInitialByAction, processFunction }
