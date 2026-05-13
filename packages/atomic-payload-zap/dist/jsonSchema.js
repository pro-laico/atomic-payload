import { ap } from './ap';
/**
 * Helper for building JSON schema entries that reference an array of block refs.
 * Used in conjunction with Payload's `typescript.schema` option to define the
 * shape of generated block-union types.
 */
export const generateBlocksType = ({ name, refs }) => ({
    [name]: { oneOf: [{ items: { oneOf: refs.filter(Boolean).map((ref) => ({ $ref: `#/definitions/${ref}` })) } }] },
});
/**
 * Builds the base extensions object that adds every schema registered with `z.ap`
 * to the generated JSON schema. Consumers can spread this output into their own
 * Payload `typescript.schema` extension function and add per-project definitions.
 */
export function toJSONSchemaExtensions({ jsonSchema }) {
    return {
        ...jsonSchema,
        definitions: {
            ...jsonSchema.definitions,
            ...ap.toJSONSchema(),
        },
    };
}
//# sourceMappingURL=jsonSchema.js.map