import { BlocksField } from 'payload'
import type { FormRateLimitBlockType, FormSanitationBlockType, FormValidationBlockType } from '@pro-laico/atomic-payload-types/schema'

type formFunctionRegistry = {
  RateLimit: FormRateLimitBlockType[]
  Sanitation: FormSanitationBlockType[]
  Validation: FormValidationBlockType[]
}

const formFunctionRegistry: formFunctionRegistry = {
  RateLimit: ['FrlSimpleSlidingWindow'],
  Sanitation: ['FsCombineTwoFields'],
  Validation: ['FvIsUnique'],
}

export const formFunctionsBlockTemplate = (variant: keyof typeof formFunctionRegistry): BlocksField => {
  return {
    name: `form${variant}Blocks`,
    type: 'blocks',
    blocks: [],
    blockReferences: formFunctionRegistry[variant],
    typescriptSchema: [() => ({ $ref: `#/definitions/Form${variant}Blocks` })],
  }
}
