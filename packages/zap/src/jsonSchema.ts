import type { JSONSchema4 } from 'json-schema'

import { ap } from './ap'

export type GenerateBlocksTypeProps = { name: string; refs: (string | undefined)[] }

/**
 * Helper for building JSON schema entries that reference an array of block refs.
 * Used in conjunction with Payload's `typescript.schema` option to define the
 * shape of generated block-union types.
 */
export const generateBlocksType = ({ name, refs }: GenerateBlocksTypeProps) => ({
  [name]: { oneOf: [{ items: { oneOf: refs.filter(Boolean).map((ref) => ({ $ref: `#/definitions/${ref}` })) } }] },
})

/**
 * Builds the base extensions object that adds every schema registered with `z.ap`
 * to the generated JSON schema. Consumers can spread this output into their own
 * Payload `typescript.schema` extension function and add per-project definitions.
 */
export function toJSONSchemaExtensions({ jsonSchema }: { jsonSchema: JSONSchema4 }): JSONSchema4 {
  return {
    ...jsonSchema,
    definitions: {
      ...jsonSchema.definitions,
      ...(ap.toJSONSchema() as Record<string, JSONSchema4>),
    },
  }
}
