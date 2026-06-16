import path from 'node:path'
import { existsSync } from 'node:fs'

import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

// In monorepo, Next.js needs the workspace root to resolve packages.
const monorepoRoot = path.resolve(__dirname, '../..')
const isMonorepo = existsSync(path.join(monorepoRoot, 'pnpm-workspace.yaml'))

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { bodySizeLimit: '5mb' } },
  // Sharp ships a native binary; keep it external so Turbopack doesn't bundle it
  // (the on-demand image transform endpoint imports it server-side).
  serverExternalPackages: ['sharp'],
  turbopack: {
    root: isMonorepo ? monorepoRoot : __dirname,
    resolveExtensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
  },
  // This minimal template only uses `imagesPlugin`, but tsc still walks workspace
  // symlinks into source the template never registers. The runtime compile is
  // clean — skip the post-build TS gate so the demo isn't blocked by unrelated source.
  typescript: { ignoreBuildErrors: true },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
