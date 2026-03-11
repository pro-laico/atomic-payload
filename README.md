> [!Important]
> While this project utilizes [Payload CMS](https://payloadcms.com/), Atomic Payload is not affiliated with [Payload CMS](https://payloadcms.com/) in any capacity.

![Atomic Payload](public/ogImage.webp)

A website builder that creates a hard separation between front-end development and the backend. Build your website directly in Payload CMS's dashboard, without ever having to touch real code.

This separation makes it easy to enforce best practices and achieve great performance out the box.

<img width="521" height="173" alt="100" src="https://github.com/user-attachments/assets/b3998740-6bd3-4980-b7d7-e2d3f7d0b782" />

> [!IMPORTANT]
> Our [Discord](https://discord.gg/EPHgjrQBxY) is the best place to get quick answers to questions.
>
> For documentation check out [Atomic Payload](https://atomicpayload.com).
>
> We are also looking for contributors!

# Features

## Tailwind Styles

Write Tailwind directly in the Payload admin dashboard, so you can have custom styled blocks wherever you need them.

![styles](https://github.com/user-attachments/assets/6ccc46be-5431-4191-97c8-d070fb4969ff)

## Recursive Structure + Copy Paste Duplicate

Build entire custom components using Atomic Child Blocks. Combined with Payload's CPD functionality, you can reuse components with ease.

![duplicate](https://github.com/user-attachments/assets/f9a6580b-ab82-4e7b-8815-9fbed20e576b)

> [!NOTE]
> Once Payload CMS implements Sanity Style CPD, you will be able to reuse components across projects.

## UnoCSS Shortcuts

UnoCSS powers our style generation, so we can leverage the built in Shortcut functionality to group our styles for reuse across your website.

![shortcuts](https://github.com/user-attachments/assets/decf0194-1523-46dd-b8d0-ba82e7d7970e)

## Design Tokens

Create reusable values related to your website design. Including colors, sizings, screen sizes, animations and more!

![tokens](https://github.com/user-attachments/assets/b9344462-adf9-40f6-b96e-773a627a1058)

## Design Sets

Design Sets are the equivalent of a complete Tailwind config file and can completely alter the appearance of your website. Only one design set can be active at a time, meaning you can build new concept designs and easily swap back and forth to see which you prefer.

![designsets](https://github.com/user-attachments/assets/882fcb15-2f22-479d-95cd-89b479b9b54d)

## Actions

Actions create interactivity and reactivity for your application for all atomic blocks. Including functionality such as opening/closing dialogs/popovers, toggling dark mode, converting stateful values to data attributes, or just submitting a form.

![actions](https://github.com/user-attachments/assets/109a6f47-3f35-4a3d-af7f-f340bfdfb23d)

> [!NOTE]
> Actions utilize a block structure so you can extend them by adding a new action block.

## Custom Forms With SVR

All of the above functionality meshes with the additional Sanitation, Validation and Rate Limiting for forms and their inputs. Allowing you to build fully customizable forms.

![forms](https://github.com/user-attachments/assets/61a4fd29-0d0b-40ab-a2f0-1cfa698b5997)

> [!NOTE]
> SVR's utilize a block structure so you can extend them by adding a new SVR block.

## Feature List

### Implemented

- UnoCSS Tailwind Classes Processor
- Forms (Sanitation/Validation/Rate Limiting)
- Actions
- Design Sets & Tokens
- UnoCSS Shortcuts
- Image Upload & Display
- Mux Video Integration For Upload & Display
- Next.JS Local Fonts
- Custom SVG Icon Upload & Optimization
- Icon Sets
- Tracking (Vercel/Google/PostHog)
- Persistent Zustand Store
- Zod Schema Registry
- Zod Schema To Payload Types

### Planned

- Tailwind Styled Emails
- Version Routes
- Component Library
- UnoCSS Autocomplete
- Convert To Plugin(s)

---

## Getting Started

**Create a new project** (recommended):

```bash
npx create-atomic-payload my-project
cd my-project
```

Then follow the [template setup guide](templates/atomic-payload/README.md) for MongoDB, Vercel Blob, deployment, and optional integrations (Mux, Resend).

**Contributing to the monorepo?** See [MONOREPO.md](MONOREPO.md) for structure, local development, publishing the CLI, and adding plugins.

---

> [!IMPORTANT]
> Our [Discord](https://discord.gg/EPHgjrQBxY) is the best place to get quick answers to questions.
>
> For documentation check out [Atomic Payload](https://atomicpayload.com).
>
> We are also looking for contributors!
