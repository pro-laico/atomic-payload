import type { BlocksField } from 'payload'
import type { InputSanitationBlockType, InputValidationBlockType } from '@pro-laico/atomic/forms/schema'

import { InputBlocksPath } from '../../../components/admin'
import { useOn } from '../../../../forms/submitForm/input/useOn'

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
    blockReferences: inputFunctionRegistry[variant] as BlocksField['blockReferences'],
    typescriptSchema: [() => ({ $ref: `#/definitions/Input${variant}Blocks` })],
    admin: { initCollapsed: true, components: { Field: { path: InputBlocksPath, clientProps: { usedOn: useOn } } } },
  }
}
