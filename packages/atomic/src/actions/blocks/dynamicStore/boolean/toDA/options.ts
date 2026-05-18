import type { ActionProcessFunction } from '@pro-laico/atomic/actions'
import type { z } from '@pro-laico/zap'

const processFunction: ActionProcessFunction<'ActDSBoolToDA'> = ({ key, changeKey, initialValuesMap, data }) => {
  const { initialValue, persisted } = initialValuesMap.get(key) || {}
  if (typeof initialValue !== 'boolean') return

  const Att: z.ap.Type<'AttBoolToDA'> = { type: 'AttBoolToDA', key, changeKey, initialValue, persisted }
  data.attributers.push(Att)
}

export const ActDSBoolToDA = { processFunction }
