import 'server-only';
import z from 'zod';
import type { AtomicRegistry } from '@pro-laico/ap-zap/schema'
type ZapSchemaRegistry = {
    id: string;
    description?: string;
};
declare class AtomicPayloadZodClass {
    /**
     * Adds a schema to the global registry.
     * @param schema - The zod schema to add.
     * @param options - The options for the schema. Always includes the id, and optionally the description. Automatically adds a type link to the schema.
     * @returns The schema.
     */
    add<T extends z.ZodType>(schema: T, options: ZapSchemaRegistry): T;
    /**
     * Gets a schema from the global registry.
     * @param id - The id of the zod schema to get.
     * @param schema - Only necessary if the schema is being called before it is added to the global registry. Import and add said schema here to fix.
     * @returns The schema.
     */
    get<T extends keyof AtomicRegistry>(id: T, schema?: z.ZodType): z.ZodType<AtomicRegistry[T]>;
    /**
     * Returns a type helper for the given schema ID.
     * Use this in type annotations: `const value: z.ap.Type<'SchemaId'> = ...`
     * @param id - The id of the zod schema type to get.
     * @returns A type that TypeScript can infer from AtomicRegistry.
     */
    type<T extends keyof AtomicRegistry>(id: T): AtomicRegistry[T];
    /** Converts the ZOD global registry to a JSON Schema. Idempotent — callers
     *  (e.g. Payload's `typescript.schema`) may invoke this more than once per
     *  process, so we only register the aggregate `AtomicRegistry` entry if it
     *  isn't already present in the global registry. */
    toJSONSchema(): Record<string, z.core.JSONSchema.JSONSchema>;
}
/** {@link AtomicPayloadsZodClass}: Adds methods that enhance Payload's typing. */
export declare const ap: AtomicPayloadZodClass;
/**
 * Namespace for type-level helpers that merge with the runtime `ap` instance.
 * This allows `z.ap.Type<'SchemaId'>` to work as a type helper.
 */
export declare namespace ap {
    /**
     * Type helper to get the TypeScript type for a schema ID from AtomicRegistry.
     * Usage: `const value: z.ap.Type<'SchemaId'> = ...`
     */
    type Type<T extends keyof AtomicRegistry> = AtomicRegistry[T];
}
export { AtomicPayloadZodClass };
export * from 'zod';
//# sourceMappingURL=ap.d.ts.map