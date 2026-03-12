import { BlocksField } from 'payload'
import { InputBlocksPath } from '@/ui'
import { useOn } from '@/blocks/submitForm/input/useOn'
import { InputSanitationBlockType, InputValidationBlockType } from '@/ts/types'

type InputFunctionRegistry = {
  Sanitation: InputSanitationBlockType[]
  Validation: InputValidationBlockType[]
}

const inputFunctionRegistry: InputFunctionRegistry = {
  Sanitation: ['IsTrimText'],
  Validation: ['IvContains', 'IvDoesNotContain'],
}

export const inputFunctionsBlockTemplate = (variant: keyof typeof inputFunctionRegistry): BlocksField => {
  return {
    name: `input${variant}Blocks`,
    type: 'blocks',
    blocks: [],
    blockReferences: inputFunctionRegistry[variant],
    typescriptSchema: [() => ({ $ref: `#/definitions/Input${variant}Blocks` })],
    admin: { initCollapsed: true, components: { Field: { path: InputBlocksPath, clientProps: { usedOn: useOn } } } },
  }
}
