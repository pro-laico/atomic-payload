# Atomic Payload Zap

Zod with Atomic Payload extensions — a registry-aware schema layer (`z.ap`) shared across every `@pro-laico/*` package and the starter template. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/zap)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/zap)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/zap.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — the `AtomicRegistry` type resolves through the core kernel's `Get<>` helper.

## Exports

| Import | What's there |
| --- | --- |
| `@pro-laico/zap` | The barrel: `z` (Zod with `z.ap` attached, also the default export), `AtomicPayloadZodClass`, `toJSONSchemaExtensions`, `generateBlocksType`, and `GenerateBlocksTypeProps`. |
| `@pro-laico/zap/schema` | The `AtomicRegistry` type alias (`Get<'AtomicRegistry', Record<string, any>>`), kept separate so packages can reference the registry type without pulling in the `server-only` runtime barrel. |
