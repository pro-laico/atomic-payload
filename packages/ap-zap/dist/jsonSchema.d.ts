import type { JSONSchema4 } from 'json-schema';
export type GenerateBlocksTypeProps = {
    name: string;
    refs: (string | undefined)[];
};
/**
 * Helper for building JSON schema entries that reference an array of block refs.
 * Used in conjunction with Payload's `typescript.schema` option to define the
 * shape of generated block-union types.
 */
export declare const generateBlocksType: ({ name, refs }: GenerateBlocksTypeProps) => {
    [x: string]: {
        oneOf: {
            items: {
                oneOf: {
                    $ref: string;
                }[];
            };
        }[];
    };
};
/**
 * Builds the base extensions object that adds every schema registered with `z.ap`
 * to the generated JSON schema. Consumers can spread this output into their own
 * Payload `typescript.schema` extension function and add per-project definitions.
 */
export declare function toJSONSchemaExtensions({ jsonSchema }: {
    jsonSchema: JSONSchema4;
}): JSONSchema4;
//# sourceMappingURL=jsonSchema.d.ts.map