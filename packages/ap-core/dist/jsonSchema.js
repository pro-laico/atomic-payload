const StoredAtomicFormInput = {
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
};
const StoredAtomicForm = {
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
};
const StoredAtomicAction = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        runners: { $ref: '#/definitions/Runners' },
        attributers: { $ref: '#/definitions/Attributers' },
        actions: { type: 'array', items: { $ref: '#/definitions/ActionBlockType' } },
    },
    required: ['id', 'actions'],
    additionalProperties: false,
};
const StoredAtomicActions = {
    type: 'object',
    patternProperties: { '^.*$': { $ref: '#/definitions/StoredAtomicAction' } },
    additionalProperties: false,
};
export const atomicPayloadStoredDefinitions = {
    StoredAtomicFormInput,
    StoredAtomicForm,
    StoredAtomicAction,
    StoredAtomicActions,
};
export const createJSONSchemaExtensions = ({ toJSONSchemaExtensions, generateBlocksType, blocks, extraDefinitions }) => ({ jsonSchema }) => {
    const base = toJSONSchemaExtensions({ jsonSchema });
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
    };
};
/**
 * Payload plugin that appends the Atomic Payload JSON schema extension function
 * to `config.typescript.schema`. Equivalent to manually wiring the result of
 * `createJSONSchemaExtensions` into `buildConfig`, but composes with the rest
 * of the template's plugin list.
 */
export const jsonSchemaPlugin = ({ enabled = true, ...opts }) => (config) => {
    if (!enabled)
        return config;
    const extension = createJSONSchemaExtensions(opts);
    const typescript = { ...(config.typescript ?? {}) };
    typescript.schema = [...(typescript.schema ?? []), extension];
    return { ...config, typescript };
};
export default jsonSchemaPlugin;
//# sourceMappingURL=jsonSchema.js.map