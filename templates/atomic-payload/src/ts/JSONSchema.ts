import { z } from '@/ts/zap'
import type { JSONSchema4 } from 'json-schema'
import CollectionSchemas from '@/collections/zap'
import { ActionBlockType } from '@/blocks/actions/zap'
import { Runner, Attributer } from '@/hooks/frontEnd/useActions/dispatch/zap'
import { ChildBlockType, BackdropChildSlug } from '@/blocks/children/zap'
import { InputValidationBlockType, InputSanitationBlockType } from '@/blocks/submitForm/input/zap'
import { FormRateLimitBlockType, FormSanitationBlockType, FormValidationBlockType } from '@/blocks/submitForm/form/zap'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const instantiate = [Runner, Attributer, CollectionSchemas] //Ensure the nested schemas are added to global registry before type generation

type GenerateProps = { name: string; refs: (string | undefined)[] }

const generateBlocksType = ({ name, refs }: GenerateProps) => ({
  [name]: { oneOf: [{ items: { oneOf: refs.filter(Boolean).map((ref) => ({ $ref: `#/definitions/${ref}` })) } }] },
})

/**
 * This function is used to add custom type definitions to the JSON schema.
 * Which can be used as a normal type, or referenced in other JSON schema.
 */
const JSONSchemaExtensions = ({ jsonSchema }: { jsonSchema: JSONSchema4 }): JSONSchema4 => ({
  ...jsonSchema,
  definitions: {
    ...jsonSchema.definitions,
    //Add type definitions as needed here
    ...z.ap.toJSONSchema(),

    // Child Blocks
    ...generateBlocksType({ name: 'ChildBlocks', refs: ChildBlockType.options }),
    ...generateBlocksType({ name: 'BackdropChildren', refs: BackdropChildSlug.options }),

    // Action Blocks
    ...generateBlocksType({ name: 'ActionBlocks', refs: ActionBlockType.options }),

    // Form Function Blocks
    ...generateBlocksType({ name: 'FormRateLimitBlocks', refs: FormRateLimitBlockType.options }),
    ...generateBlocksType({ name: 'FormSanitationBlocks', refs: FormSanitationBlockType.options }),
    ...generateBlocksType({ name: 'FormValidationBlocks', refs: FormValidationBlockType.options }),

    //Input Function Blocks
    ...generateBlocksType({ name: 'InputSanitationBlocks', refs: InputSanitationBlockType.options }),
    ...generateBlocksType({ name: 'InputValidationBlocks', refs: InputValidationBlockType.options }),

    //Atomic Forms - Dynamically generated from imported arrays
    StoredAtomicFormInput: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string' },
        inputName: { type: 'string' },
        sanitationBlocks: { $ref: '#/definitions/InputSanitationBlocks' },
        validationBlocks: { $ref: '#/definitions/InputValidationBlocks' },
      },
      required: ['id', 'type', 'inputName'],
      additionalProperties: false,
    },
    StoredAtomicForm: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        sm: { type: 'string' },
        em: { type: 'string' },
        backendForm: { type: 'string' },
        sanitation: { $ref: '#/definitions/FormSanitationBlocks' },
        validation: { $ref: '#/definitions/FormValidationBlocks' },
        rateLimiting: { $ref: '#/definitions/FormRateLimitBlocks' },
        inputs: { type: 'array', items: { $ref: '#/definitions/StoredAtomicFormInput' } },
      },
      required: ['id', 'backendForm'],
      additionalProperties: false,
    },
    StoredAtomicAction: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        runners: { $ref: '#/definitions/Runners' },
        attributers: { $ref: '#/definitions/Attributers' },
        actions: { type: 'array', items: { $ref: '#/definitions/ActionBlockType' } },
      },
      required: ['id', 'actions'],
      additionalProperties: false,
    },
    StoredAtomicActions: {
      type: 'object',
      patternProperties: { '^.*$': { $ref: '#/definitions/StoredAtomicAction' } },
      additionalProperties: false,
    },
  },
})

export default JSONSchemaExtensions
