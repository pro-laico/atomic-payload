import 'server-only'; //DO NOT REMOVE
import z from 'zod';
import traverse from 'traverse';
//KNOWN ISSUE: Updating past zod 4.1.11 breaks some handling of zod schemas. Need to investigate why and fix.
const rss = z.record(z.string(), z.string()).meta({ id: 'RSS', description: 'Type: {@link RSS} Record<string, string>' });
const sosa = z.union([z.string(), z.array(z.string())]).meta({ id: 'SOSA', description: 'Type: {@link SOSA} String | String[]' });
z.record(z.string(), rss).meta({ id: 'RSRSS', description: 'Type: {@link RSRSS} Record<string, Record<string, string>>' });
z.record(z.string(), sosa).meta({ id: 'RSSOSA', description: 'Type: {@link RSSOSA} Record<string, string | string[]>' });
class AtomicPayloadZodClass {
    /**
     * Adds a schema to the global registry.
     * @param schema - The zod schema to add.
     * @param options - The options for the schema. Always includes the id, and optionally the description. Automatically adds a type link to the schema.
     * @returns The schema.
     */
    add(schema, options) {
        const fullDescription = options.description ? `Type:{@link ${options.id}} ${options.description}` : `Type: {@link ${options.id}}`;
        if (!z.globalRegistry._idmap.has(options.id)) {
            z.globalRegistry.add(schema, { id: options.id, description: fullDescription });
            z.globalRegistry._idmap.set(options.id, schema);
        }
        return schema;
    }
    /**
     * Gets a schema from the global registry.
     * @param id - The id of the zod schema to get.
     * @param schema - Only necessary if the schema is being called before it is added to the global registry. Import and add said schema here to fix.
     * @returns The schema.
     */
    get(id, schema) {
        const result = z.globalRegistry._idmap.get(id);
        if (!result)
            throw new Error(`Schema with id ${id} not found. It is recommended you add the second argument, which is the desired schema.`);
        return result;
    }
    /**
     * Returns a type helper for the given schema ID.
     * Use this in type annotations: `const value: z.ap.Type<'SchemaId'> = ...`
     * @param id - The id of the zod schema type to get.
     * @returns A type that TypeScript can infer from AtomicRegistry.
     */
    type(id) {
        // This method exists for type inference only
        // The actual type is resolved at compile time via the Type helper
        return undefined;
    }
    /** Converts the ZOD global registry to a JSON Schema. */
    toJSONSchema() {
        const entries = Array.from(z.globalRegistry._idmap.entries()).filter(([key]) => typeof key === 'string');
        z.globalRegistry.add(z.object(Object.fromEntries(entries)), { id: 'AtomicRegistry' });
        const jsonSchema = z.toJSONSchema(z.globalRegistry, { target: 'draft-4', uri: (id) => `#/definitions/${id}` }).schemas;
        traverse(jsonSchema).forEach(function () {
            if (this.key === '$id')
                this.remove();
        });
        return jsonSchema;
    }
}
/** {@link AtomicPayloadsZodClass}: Adds methods that enhance Payload's typing. */
export const ap = new AtomicPayloadZodClass();
export { AtomicPayloadZodClass };
export * from 'zod';
//# sourceMappingURL=ap.js.map