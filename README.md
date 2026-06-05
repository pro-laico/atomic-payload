> [!Important]
> While this project utilizes [Payload CMS](https://payloadcms.com/), Atomic Payload is not affiliated with [Payload CMS](https://payloadcms.com/) in any capacity.

![Atomic Payload](/templates/atomic-payload/public/ogImage.webp)

# Atomic Payload

Originally built as a website builder utilizing recursive atomic blocks, Atomic Payload is now a collection of plugins that together create a powerful website builder in Payload CMS. With the pluginifcation of the project, several aspects can now be used as standalone plugins.

The atomic-payload template is the fastest way to see everything at once — and a cool demo of what the plugins can do composed. The resulting websites built with Atomic Payload have excellent performance.

<img width="521" height="173" alt="100" src="https://github.com/user-attachments/assets/b3998740-6bd3-4980-b7d7-e2d3f7d0b782" />

## Getting Started

- **Start With A Full Template Or Example Repo** — see the [Quick Start guide](https://atomicpayload.com/docs/getting-started/quick-start).
- **Add a Plugin** — see the [Existing Project guide](https://atomicpayload.com/docs/getting-started/existing-project).

## Features

### `@pro-laico/styles`

Everything CSS, authored straight in the Payload admin.

#### Tailwind Styles

Write Tailwind directly in the Payload admin dashboard, so you can have custom styled blocks wherever you need them.

![styles](https://github.com/user-attachments/assets/6ccc46be-5431-4191-97c8-d070fb4969ff)

#### UnoCSS Shortcuts

UnoCSS powers our style generation, so we can leverage the built in Shortcut functionality to group our styles for reuse across your website.

![shortcuts](https://github.com/user-attachments/assets/decf0194-1523-46dd-b8d0-ba82e7d7970e)

#### Design Tokens

Create reusable values related to your website design. Including colors, sizings, screen sizes, animations and more!

![tokens](https://github.com/user-attachments/assets/b9344462-adf9-40f6-b96e-773a627a1058)

#### Design Sets

Design Sets are the equivalent of a complete Tailwind config file and can completely alter the appearance of your website. Only one design set can be active at a time, meaning you can build new concept designs and easily swap back and forth to see which you prefer.

![designsets](https://github.com/user-attachments/assets/882fcb15-2f22-479d-95cd-89b479b9b54d)

### `@pro-laico/atomic`

Recursive content blocks, interactivity, and forms.

#### Recursive Structure + Copy Paste Duplicate

Build entire custom components using Atomic Child Blocks. Combined with Payload's CPD functionality, you can reuse components with ease.

![duplicate](https://github.com/user-attachments/assets/f9a6580b-ab82-4e7b-8815-9fbed20e576b)

> [!NOTE]
> Once Payload CMS implements Sanity Style CPD, you will be able to reuse components across projects.

#### Actions

Actions create interactivity and reactivity for your application for all atomic blocks. Including functionality such as opening/closing dialogs/popovers, toggling dark mode, converting stateful values to data attributes, or just submitting a form.

![actions](https://github.com/user-attachments/assets/109a6f47-3f35-4a3d-af7f-f340bfdfb23d)

> [!NOTE]
> Actions utilize a block structure so you can extend them by adding a new action block.

#### Custom Forms With SVR

All of the above functionality meshes with the additional Sanitation, Validation and Rate Limiting for forms and their inputs. Allowing you to build fully customizable forms.

![forms](https://github.com/user-attachments/assets/61a4fd29-0d0b-40ab-a2f0-1cfa698b5997)

> [!NOTE]
> SVR's utilize a block structure so you can extend them by adding a new SVR block.


## Packages

Atomic Payload is split into three kinds of packages, all published under `@pro-laico/*`. Full options and setup for each live in the [plugin docs](https://atomicpayload.com/docs/plugins).

### Foundation

Required by every other package — the shared kernel everything builds on.

| Package | What it does |
| ------- | ------------ |
| [`core`](https://atomicpayload.com/docs/plugins/core) | Typed schema augmentation (`Get<>` / `PayloadAugment`), cache + revalidation hooks, and the APF runtime. |

### Standalones

Self-contained plugins you can drop into any Payload + Next.js project on their own (alongside `@pro-laico/core`).

| Plugin | What it does |
| ------ | ------------ |
| [`styles`](https://atomicpayload.com/docs/plugins/styles) | Author Tailwind/UnoCSS directly in the Payload admin — design tokens, swappable design sets, reusable shortcuts, and per-block class fields. |
| [`icons`](https://atomicpayload.com/docs/plugins/icons) | Upload and auto-optimize SVG icons, group them into icon sets, and render them on the frontend. |
| [`fonts`](https://atomicpayload.com/docs/plugins/fonts) | Manage `next/font` local fonts from the admin, with a font-download CLI. |
| [`tracking`](https://atomicpayload.com/docs/plugins/tracking) | Toggle Google Tag Manager, PostHog, and Vercel Analytics from the admin. |

### Tools

Building blocks consumed by the other packages and by the full [demo template](#the-demo-template). They're split into their own packages to keep maintenance and updates manageable — you _can_ use them directly, but most projects pull them in transitively rather than installing them alone.

| Package | What it does |
| ------- | ------------ |
| [`atomic`](https://atomicpayload.com/docs/plugins/atomic) | Recursive "atomic" content blocks, interactive actions (dialogs, popovers, dark mode, form submit), and custom forms with sanitation / validation / rate limiting — the runtime behind the template's builder. |
| [`site`](https://atomicpayload.com/docs/plugins/site) | An opinionated "site shape" — Pages, Header, Footer collections plus Settings and SEO/metadata globals. |
| [`images`](https://atomicpayload.com/docs/plugins/images) | Image upload collections with favicons and blur-up placeholders. |
| [`mux-video`](https://atomicpayload.com/docs/plugins/mux-video) | Mux-backed video upload and playback. |
| [`richtext`](https://atomicpayload.com/docs/plugins/richtext) | A Lexical rich-text block with a JSX renderer for the frontend. |
| [`seed`](https://atomicpayload.com/docs/plugins/seed) | One-click database seeding via an admin banner and a `POST /api/seed` endpoint. |
| [`zap`](https://atomicpayload.com/docs/plugins/zap) | A Zod schema registry and a Zod-schema-to-Payload-types helper. |
| [`create-atomic-payload`](#getting-started) | CLI that scaffolds the full demo template and examples. |

## Documentation

Full documentation lives at [atomicpayload.com](https://atomicpayload.com).

## Contributing

Contributions are welcome! See [MONOREPO.md](MONOREPO.md) for repo structure, local development, publishing, and how to add a plugin.
