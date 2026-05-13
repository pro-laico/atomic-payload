import { z } from '@pro-laico/atomic-payload-zap'
import type { ActionProcessFunction } from '@pro-laico/atomic-payload-types'

const processFunction: ActionProcessFunction<'ActDSTextToDA'> = ({ key, changeKey, initialValuesMap, data }) => {
  const { initialValue, persisted } = initialValuesMap.get(key) || {}
  if (typeof initialValue !== 'string') return

  const Att: z.ap.Type<'AttTextToDA'> = { type: 'AttTextToDA', key: changeKey || key, persisted, initialValue }
  data.attributers.push(Att)
}

export const ActDSTextToDA = { processFunction }
