# create-atomic-payload

Scaffold a new [Atomic Payload](https://atomicpayload.com) project — the Payload CMS starter where all you need to know is Tailwind.

> Atomic Payload creates a hard separation between front-end development and the backend. Build your website directly in Payload CMS's dashboard, without ever having to touch real code.

## Prerequisites

- **Node.js** 18 or later
- **pnpm** (recommended) — install with `npm install -g pnpm`

## Quick Start

```bash
npx @pro-laico/create-atomic-payload my-project
cd my-project
cp .env.example .env
# Edit .env with your MongoDB URI, Payload secret, etc.
pnpm dev
```

To create in the current directory instead of a subfolder:

```bash
npx @pro-laico/create-atomic-payload .
cp .env.example .env
pnpm dev
```

## What It Does

The CLI will:

1. Copy the Atomic Payload template to your project folder
2. Install dependencies with pnpm
3. Build sharp (image processing)
4. Download fonts

Then you configure `.env` and run `pnpm dev`.

## Options

| Option | Description |
|-------|-------------|
| `--help`, `-h` | Show help message |

## Next Steps

After creating your project, see the project's `README.md` for:

- MongoDB setup
- Vercel Blob (file storage)
- Deployment
- Optional integrations (Mux, Resend)

## Troubleshooting

**Sharp / image errors on Windows?**  
Run `pnpm rebuild sharp` in your project directory.

**Fonts not loading?**  
Run `pnpm download:fonts` in your project directory.

## Links

- [Atomic Payload Documentation](https://atomicpayload.com)
- [Discord](https://discord.gg/EPHgjrQBxY)
- [Payload CMS](https://payloadcms.com)

---

> While this project utilizes Payload CMS, Atomic Payload is not affiliated with Payload CMS.
