# Atomic Payload Rich Text

The rich-text child block for Atomic Payload, plus a default Lexical editor preset and a JSX renderer for serialized Lexical content. Part of [Atomic Payload](https://atomicpayload.com).

- [Documentation](https://atomicpayload.com/docs/plugins/richtext)
- [Source code](https://github.com/pro-laico/atomic-payload/tree/main/packages/richtext)
- [Documentation source](https://github.com/pro-laico/atomic-payload/tree/main/docs/content/docs/plugins/richtext.mdx)

## Atomic Payload dependencies

- `@pro-laico/core` — primitives the package builds on.
- `@pro-laico/atomic` — the runtime whose children render pipeline `RichTextChild` plugs into.

## Exports

| Import | What's there |
| --- | --- |
| `@pro-laico/richtext` | Root barrel — `RichText` (pre-built `Block`), `createRichTextBlock` factory, the `RichTextChild` renderer, and the `defaultLexical` preset. |
| `@pro-laico/richtext/default-lexical` | The `defaultLexical` preset on its own, plus the `createDefaultLexical(options?)` factory and `DefaultLexicalOptions` (`enabledCollections`) — not re-exported from the barrel. |
