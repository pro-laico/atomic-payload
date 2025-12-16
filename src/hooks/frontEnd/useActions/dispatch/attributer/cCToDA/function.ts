import { AttFunction } from '@/ts/types'

export const AttCCToDA: AttFunction<'AttCCToDA'> = ({
  listen,
  changeKey,
  context: {
    atomicStore: { preferences, hasConsented, previouslyConsented },
  },
}) => {
  let returns: Record<string, string> | undefined

  switch (listen.listen) {
    case 'preference':
      if (!listen.key) return
      const checked = preferences?.[listen.key]
      if (checked) returns = { [`data-${changeKey || listen.key}`]: '' }
      break
    case 'accept':
      if (hasConsented === true) returns = { [`data-${changeKey || 'accepted'}`]: '' }
      break
    case 'decline':
      if (hasConsented === false) returns = { [`data-${changeKey || 'declined'}`]: '' }
      break
    case 'hasConsented':
      if (changeKey) returns = { [`data-${changeKey}`]: hasConsented ? 'accepted' : 'declined' }
      else returns = { [`data-${hasConsented ? `accepted` : `declined`}`]: '' }
      break
    case 'previouslyConsented':
      if (changeKey) returns = { [`data-${changeKey}`]: previouslyConsented ? 'accepted' : 'declined' }
      else returns = { [`data-${previouslyConsented ? `accepted` : `declined`}`]: '' }
      break
  }
  return returns
}
