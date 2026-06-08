import type { ActionProcessFunction, ActionSetKeyInitialByAction } from '@pro-laico/atomic/actions'
import type { z } from '@pro-laico/zap'

type TextArrayItem = { id?: string | null; value: string; initialValue?: boolean | null }

const setKeyInitialByAction: ActionSetKeyInitialByAction<'ActDSCycleText'> = (props) => {
  const { key, persisted, textArray } = props.actionBlock as unknown as { key: string; persisted?: boolean | null; textArray: TextArrayItem[] }
  const initialValue = textArray.find((item: TextArrayItem) => item.initialValue)?.value || textArray[0]?.value
  return { key, initialValue, persisted }
}

const processFunction: ActionProcessFunction<'ActDSCycleText'> = (args) => {
  const { key, persisted, setDA, data } = args
  const textArray = (args as unknown as { textArray: TextArrayItem[] }).textArray
  const initialValue = textArray.find((item: TextArrayItem) => item.initialValue)?.value || textArray[0]?.value
  const cleanTextArray = textArray.map(({ id, ...rest }: TextArrayItem) => rest)

  const Run: z.ap.Type<'RunCycleText'> = { type: 'RunCycleText', key, persisted, initialValue, textArray: cleanTextArray }
  data.runners.push(Run)

  if (setDA) {
    const Att: z.ap.Type<'AttTextToDA'> = { type: 'AttTextToDA', key, persisted, initialValue }
    data.attributers.push(Att)
  }
}

export const ActDSCycleText = { setKeyInitialByAction, processFunction }
