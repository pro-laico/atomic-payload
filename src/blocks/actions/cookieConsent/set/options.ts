import { z } from '@/ts/zap'
import { ActionProcessFunction } from '@/ts/types'

const processFunction: ActionProcessFunction<'ActSetCC'> = ({ perform, acceptAll, key, setDA, changeKey, data }) => {
  let values: z.ap.Type<'RunSetCC'>['values']

  if (perform === 'preference' && key) {
    values = { perform: 'preference', key }
  } else if (perform === 'accept') {
    values = acceptAll ? { perform: 'accept', acceptAll } : { perform: 'accept' }
  } else {
    values = { perform: 'decline' }
  }

  const Run: z.ap.Type<'RunSetCC'> = { type: 'RunSetCC', values }
  data.runners.push(Run)

  if (setDA) {
    let listen: z.ap.Type<'AttCCToDA'>['listen']

    switch (perform) {
      case 'preference':
        listen = { listen: 'preference', key: key || 'functional' }
        break
      default:
        listen = { listen: perform }
        break
    }

    const Att: z.ap.Type<'AttCCToDA'> = { type: 'AttCCToDA', listen, changeKey }
    data.attributers.push(Att)
  }
}

export const ActSetCC = { processFunction }
