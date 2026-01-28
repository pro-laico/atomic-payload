import path from 'path'
import type { NextConfig } from 'next'
import bundleAnalyzer from '@next/bundle-analyzer'
import { withPayload } from '@payloadcms/next/withPayload'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  //KNOWN ISSUE: Payload server actions/hooks currently send large payloads, so we need to increase the body size limit.
  experimental: { serverActions: { bodySizeLimit: '5mb' } },
  turbopack: {
    root: path.join(__dirname),
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
