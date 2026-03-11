import path from 'path'
import { existsSync } from 'fs'
import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'
import { withPayload } from '@payloadcms/next/withPayload'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

// In monorepo, Next.js needs the workspace root to resolve packages
const monorepoRoot = path.resolve(__dirname, '../..')
const isMonorepo = existsSync(path.join(monorepoRoot, 'pnpm-workspace.yaml'))

const nextConfig: NextConfig = {
  reactStrictMode: true,
  //KNOWN ISSUE: Payload server actions/hooks currently send large payloads, so we need to increase the body size limit.
  experimental: { serverActions: { bodySizeLimit: '5mb' } },
  turbopack: {
    root: isMonorepo ? monorepoRoot : __dirname,
    resolveExtensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
  },
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const { hostname, protocol } = new URL(item)

        return { hostname, protocol: protocol.replace(':', '') as 'http' | 'https' }
      }),
    ],
  },
}

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })

export default withBundleAnalyzer(withPayload(nextConfig, { devBundleServerPackages: false }))
