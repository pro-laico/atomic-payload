/**
 * JSON-schema plugin used by Atomic Payload templates to extend
 * `payload generate:types`. Lives in `@pro-laico/core` because the helper
 * factories and the Payload `Plugin` wrapper are foundational utilities used
 * during config build.
 */
import type { JSONSchema4 } from 'json-schema'
import type { Config, Plugin } from 'payload'

export type BlockRefs = (string | undefined)[]

export type GenerateBlocksTypeProps = { name: string; refs: BlockRefs }

export type GenerateBlocksTypeFn = (props: GenerateBlocksTypeProps) => Record<string, JSONSchema4>

export type ToJSONSchemaExtensionsFn = (args: { jsonSchema: JSONSchema4 }) => JSONSchema4

export type AtomicPayloadSchemaBlocks = {
  ChildBlocks: BlockRefs
  BackdropChildren?: BlockRefs
  ActionBlocks: BlockRefs
  FormRateLimitBlocks: BlockRefs
  FormSanitationBlocks: BlockRefs
  FormValidationBlocks: BlockRefs
  InputSanitationBlocks: BlockRefs
  InputValidationBlocks: BlockRefs
}

export type CreateJSONSchemaExtensionsOptions = {
  toJSONSchemaExtensions: ToJSONSchemaExtensionsFn
  generateBlocksType: GenerateBlocksTypeFn
  blocks: AtomicPayloadSchemaBlocks
  /** Extra per-project definitions merged in last so they can override defaults. */
  extraDefinitions?: Record<string, JSONSchema4>
}

const StoredAtomicFormInput: JSONSchema4 = {
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
}

const StoredAtomicForm: JSONSchema4 = {
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
}

const StoredAtomicAction: JSONSchema4 = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    runners: { $ref: '#/definitions/Runners' },
    attributers: { $ref: '#/definitions/Attributers' },
    actions: { type: 'array', items: { $ref: '#/definitions/ActionBlockType' } },
  },
  required: ['id', 'actions'],
  additionalProperties: false,
}

const StoredAtomicActions: JSONSchema4 = {
  type: 'object',
  patternProperties: { '^.*$': { $ref: '#/definitions/StoredAtomicAction' } },
  additionalProperties: false,
}

export const atomicPayloadStoredDefinitions: Record<string, JSONSchema4> = {
  StoredAtomicFormInput,
  StoredAtomicForm,
  StoredAtomicAction,
  StoredAtomicActions,
}

export type JSONSchemaExtensionFn = (args: { jsonSchema: JSONSchema4 }) => JSONSchema4

export const createJSONSchemaExtensions =
  ({ toJSONSchemaExtensions, generateBlocksType, blocks, extraDefinitions }: CreateJSONSchemaExtensionsOptions): JSONSchemaExtensionFn =>
  ({ jsonSchema }) => {
    const base = toJSONSchemaExtensions({ jsonSchema })
    return {
      ...base,
      definitions: {
        ...base.definitions,
        ...generateBlocksType({ name: 'ChildBlocks', refs: blocks.ChildBlocks }),
        ...(blocks.BackdropChildren ? generateBlocksType({ name: 'BackdropChildren', refs: blocks.BackdropChildren }) : {}),
        ...generateBlocksType({ name: 'ActionBlocks', refs: blocks.ActionBlocks }),
        ...generateBlocksType({ name: 'FormRateLimitBlocks', refs: blocks.FormRateLimitBlocks }),
        ...generateBlocksType({ name: 'FormSanitationBlocks', refs: blocks.FormSanitationBlocks }),
        ...generateBlocksType({ name: 'FormValidationBlocks', refs: blocks.FormValidationBlocks }),
        ...generateBlocksType({ name: 'InputSanitationBlocks', refs: blocks.InputSanitationBlocks }),
        ...generateBlocksType({ name: 'InputValidationBlocks', refs: blocks.InputValidationBlocks }),
        ...atomicPayloadStoredDefinitions,
        ...extraDefinitions,
      },
    }
  }

export type JSONSchemaPluginOptions = CreateJSONSchemaExtensionsOptions & {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
}

/**
 * Payload plugin that appends the Atomic Payload JSON schema extension function
 * to `config.typescript.schema`. Equivalent to manually wiring the result of
 * `createJSONSchemaExtensions` into `buildConfig`, but composes with the rest
 * of the template's plugin list.
 */
export const jsonSchemaPlugin =
  ({ enabled = true, ...opts }: JSONSchemaPluginOptions): Plugin =>
  (config: Config): Config => {
    if (!enabled) return config
    const extension = createJSONSchemaExtensions(opts)
    const typescript = { ...(config.typescript ?? {}) }
    typescript.schema = [...(typescript.schema ?? []), extension]
    return { ...config, typescript }
  }

export default jsonSchemaPlugin
