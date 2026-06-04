# @pro-laico/richtext

> The rich-text child block for Atomic Payload, plus a default Lexical editor preset and a JSX renderer for serialized Lexical content.

## What this package is

A small, focused package. From the root barrel:

- **`RichText`** — the Payload block config (a pre-built `Block` value). Drop this into a `blocks` field to give editors a Lexical rich-text area.
- **`createRichTextBlock(options?)`** — the factory behind `RichText`. Pass `prependFields` / `appendFields` (the **`RichTextBlockOptions`** type) to spread extra fields at the start / end of the Content tab — e.g. a `ClassNameField` — without forking the block.
- **`RichTextChild`** — the React child-block renderer used inside the children render pipeline. It receives a `block` (with `.richText`) and a `pt` pass-through and renders JSX for the serialized Lexical state.
- **`defaultLexical`** — an opinionated `lexicalEditor({ ... })` preset (features, toolbar groups, etc) tuned for Atomic Payload's use cases. Use it as the editor option on the rich-text field if you don't need anything bespoke.

A matching **`createDefaultLexical(options?)`** factory (whose `DefaultLexicalOptions` accept an `enabledCollections` array — the collections the internal-link feature can target, defaulting to `['pages']`) is available from the `./default-lexical` subpath — it is **not** re-exported from the root barrel. See [Subpath imports](#subpath-imports).

## Why it exists separately

Rich text is one of the few content types whose admin UI (Lexical editor) and front-end renderer (JSX walker) both need to ship together but have very different runtime requirements. Putting them in a tiny standalone package keeps the dependency on `@payloadcms/richtext-lexical` isolated — bigger packages don't pay that bundle cost unless they actually use rich text.

It also gives us a single place to keep the editor preset and the renderer in sync, so admins and visitors see the same content shape.

## Quick start

```ts
import { RichText } from '@pro-laico/richtext'

const PageBlocks = {
  name: 'blocks',
  type: 'blocks',
  blocks: [
    RichText, // pre-built `Block` — the Lexical editor preset is baked in
    // ...
  ],
}
```

Need extra fields (e.g. a `ClassNameField`) at the start or end of the Content tab? Use the factory instead of the pre-built block:

```ts
import { createRichTextBlock } from '@pro-laico/richtext'

const RichTextWithClassName = createRichTextBlock({
  appendFields: [ClassNameField],
})
```

Front-end render. `RichTextChild` is a child-block renderer wired into the children render pipeline — it isn't a standalone `content`-prop component. It receives a `RenderChild<RichTextChild>`: a `block` (whose `.richText` holds the serialized Lexical state) plus the `pt` pass-through, and renders the JSX:

```tsx
import { RichTextChild } from '@pro-laico/richtext'

// Registered as the renderer for the `RichTextChild` block; the children
// pipeline supplies `block` and `pt`.
const childRenderers = {
  RichTextChild,
  // ...other child-block renderers
}
```

The component itself is essentially:

```tsx
const RichTextChild = ({ block: { richText }, pt }) => (
  <div {...pt.c.p}>{richText && <RichText data={richText} />}</div>
)
```

(the inner `RichText` is the package's internal Lexical-to-JSX renderer, which wraps `@payloadcms/richtext-lexical/react`.)

## What lives in `src/`

| Path | What's there |
| --- | --- |
| `blocks/richText/block.ts` | `createRichTextBlock` factory + the pre-built `RichText` block, and the `RichTextBlockOptions` type. |
| `blocks/richText/component.tsx` | The `RichTextChild` child-block renderer (the exported React component). |
| `blocks/richText/component/index.tsx` | The internal Lexical-to-JSX `RichText` renderer, wrapping `@payloadcms/richtext-lexical/react`. |
| `blocks/richText/component/converters/` | JSX converters, including an internal-link `internalDocToHref` that degrades to `#` for missing/unpopulated docs. |
| `blocks/richText/defaultLexical.ts` | `createDefaultLexical` factory + the `defaultLexical` preset, and the `DefaultLexicalOptions` type. |

## Subpath imports

| Subpath | What's there |
| --- | --- |
| `./default-lexical` | Import the `defaultLexical` preset directly without pulling in the block config. Also the only place to reach the `createDefaultLexical(options?)` factory and its `DefaultLexicalOptions` (`enabledCollections`) — these are not re-exported from the root barrel. |

## Where it sits in the monorepo

Depends on `core` and `atomic`. Peer-depends on `@payloadcms/richtext-lexical` (`>=3.0.0`), `payload` (`>=3.0.0`), and `react` (`>=19.0.0`). Used by the template wherever a page needs editable prose.
