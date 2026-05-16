# @pro-laico/richtext

> The rich-text child block for Atomic Payload, plus a default Lexical editor preset and a JSX renderer for serialized Lexical content.

## What this package is

A small, focused package with three exports:

- **`RichText`** — the Payload block config. Drop this into a `blocks` field to give editors a Lexical rich-text area.
- **`RichTextChild`** — the React component that walks serialized Lexical state and renders JSX. This is what the front-end uses to display the content.
- **`defaultLexical`** — an opinionated `lexicalEditor({ ... })` preset (features, toolbar groups, etc) tuned for Atomic Payload's use cases. Use it as the editor option on the rich-text field if you don't need anything bespoke.

## Why it exists separately

Rich text is one of the few content types whose admin UI (Lexical editor) and front-end renderer (JSX walker) both need to ship together but have very different runtime requirements. Putting them in a tiny standalone package keeps the dependency on `@payloadcms/richtext-lexical` isolated — bigger packages don't pay that bundle cost unless they actually use rich text.

It also gives us a single place to keep the editor preset and the renderer in sync, so admins and visitors see the same content shape.

## Quick start

```ts
import { RichText, defaultLexical } from '@pro-laico/richtext'

const PageBlocks = {
  name: 'blocks',
  type: 'blocks',
  blocks: [
    RichText({ editor: defaultLexical }),
    // ...
  ],
}
```

Front-end render:

```tsx
import { RichTextChild } from '@pro-laico/richtext'

export function Block({ data }) {
  return <RichTextChild content={data.content} />
}
```

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `blocks/richText/block.ts` | The `RichText` block config factory. |
| `blocks/richText/component.tsx` | The `RichTextChild` JSX renderer. |
| `blocks/richText/defaultLexical.ts` | The `defaultLexical` editor preset. |
| `types/` | Type helpers. |

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./default-lexical` | Import the preset directly without pulling the block config |

## Where it sits in the monorepo

Depends on `core` and `atomic`. Peer-depends on `@payloadcms/richtext-lexical`. Used by the template wherever a page needs editable prose.
