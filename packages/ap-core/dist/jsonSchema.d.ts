/**
 * JSON-schema plugin used by Atomic Payload templates to extend
 * `payload generate:types`. Lives in `@pro-laico/ap-core` because the helper
 * factories and the Payload `Plugin` wrapper are foundational utilities used
 * during config build.
 */
import type { JSONSchema4 } from 'json-schema';
import type { Plugin } from 'payload';
export type BlockRefs = (string | undefined)[];
export type GenerateBlocksTypeProps = {
    name: string;
    refs: BlockRefs;
};
export type GenerateBlocksTypeFn = (props: GenerateBlocksTypeProps) => Record<string, JSONSchema4>;
export type ToJSONSchemaExtensionsFn = (args: {
    jsonSchema: JSONSchema4;
}) => JSONSchema4;
export type AtomicPayloadSchemaBlocks = {
    ChildBlocks: BlockRefs;
    BackdropChildren?: BlockRefs;
    ActionBlocks: BlockRefs;
    FormRateLimitBlocks: BlockRefs;
    FormSanitationBlocks: BlockRefs;
    FormValidationBlocks: BlockRefs;
    InputSanitationBlocks: BlockRefs;
    InputValidationBlocks: BlockRefs;
};
export type CreateJSONSchemaExtensionsOptions = {
    toJSONSchemaExtensions: ToJSONSchemaExtensionsFn;
    generateBlocksType: GenerateBlocksTypeFn;
    blocks: AtomicPayloadSchemaBlocks;
    /** Extra per-project definitions merged in last so they can override defaults. */
    extraDefinitions?: Record<string, JSONSchema4>;
};
export declare const atomicPayloadStoredDefinitions: Record<string, JSONSchema4>;
export type JSONSchemaExtensionFn = (args: {
    jsonSchema: JSONSchema4;
}) => JSONSchema4;
export declare const createJSONSchemaExtensions: ({ toJSONSchemaExtensions, generateBlocksType, blocks, extraDefinitions }: CreateJSONSchemaExtensionsOptions) => JSONSchemaExtensionFn;
export type JSONSchemaPluginOptions = CreateJSONSchemaExtensionsOptions & {
    /** When false, the plugin is a no-op. Defaults to true. */
    enabled?: boolean;
};
/**
 * Payload plugin that appends the Atomic Payload JSON schema extension function
 * to `config.typescript.schema`. Equivalent to manually wiring the result of
 * `createJSONSchemaExtensions` into `buildConfig`, but composes with the rest
 * of the template's plugin list.
 */
export declare const jsonSchemaPlugin: ({ enabled, ...opts }: JSONSchemaPluginOptions) => Plugin;
export default jsonSchemaPlugin;
//# sourceMappingURL=jsonSchema.d.ts.map