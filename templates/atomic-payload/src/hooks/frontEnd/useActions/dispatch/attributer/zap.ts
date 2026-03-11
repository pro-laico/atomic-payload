import { z } from '@/ts/zap'
import { CCtoDASchema } from './cCToDA/zap'
import { BoolToDASchema } from './boolToDA/zap'
import { TextToDASchema } from './textToDA/zap'
import { FormErrorToDASchema } from './errorToDA/zap'
import { FormStatusToDASchema } from './statusToDA/zap'
export { CCtoDASchema, BoolToDASchema, TextToDASchema, FormErrorToDASchema, FormStatusToDASchema }

const Attributers = [CCtoDASchema, BoolToDASchema, TextToDASchema, FormErrorToDASchema, FormStatusToDASchema] as const

export const AttributerRefs = z.ap.add(z.discriminatedUnion('type', Attributers), { id: 'Attributer' })
export const AttributerRefsArray = z.ap.add(z.array(AttributerRefs), { id: 'Attributers' })
export const AttributerTypes = z.ap.add(z.union(Attributers.map((runner) => runner.shape.type)), { id: 'AttributerType' })

export const Attributer = { ref: AttributerRefs, refs: AttributerRefsArray, types: AttributerTypes }
