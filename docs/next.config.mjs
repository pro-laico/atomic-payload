import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();
const monorepoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Pin the workspace root (monorepo root) so Next doesn't mis-infer it from stray lockfiles.
  turbopack: {
    root: monorepoRoot,
  },
};

export default withMDX(config);
