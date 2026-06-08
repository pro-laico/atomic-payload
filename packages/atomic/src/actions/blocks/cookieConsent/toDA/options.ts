import type { z } from '@pro-laico/zap'
import type { ActionProcessFunction } from '@pro-laico/atomic/actions'

const processFunction: ActionProcessFunction<'ActCCToDA'> = ({ listen, key, changeKey, data }) => {
  let value: z.ap.Type<'AttCCToDA'>['listen']

  switch (listen) {
    case 'preference':
      value = { listen: 'preference', key: key || 'functional' }
      break
    default:
      value = { listen: listen }
  }

  const Att: z.ap.Type<'AttCCToDA'> = { type: 'AttCCToDA', listen: value, changeKey }
  data.attributers.push(Att)
}

export const ActCCToDA = { processFunction }
