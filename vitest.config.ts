import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

// Some package entrypoints import `server-only` (a guard that throws outside an
// RSC server bundle). Under Vitest's node environment that import would throw, so
// alias it to an empty module.
const serverOnlyStub = fileURLToPath(new URL('./tools/test-helpers/src/empty.ts', import.meta.url))

export default defineConfig({
  // SWC transform for JSX/TSX — matches the build's .swcrc so components transform
  // the same way in tests. Harmless for the pure-TS unit suites.
  plugins: [react()],
  resolve: {
    alias: { 'server-only': serverOnlyStub },
  },
  test: {
    // Workspace packages (and payload/payloadcms) ship ESM that imports each other
    // by `exports` → source `.ts`. Inline them so Vite transforms rather than
    // trying to load them as pre-built external ESM.
    server: { deps: { inline: [/^@pro-laico\//, /^@tools\//, /^payload/, /^@payloadcms\//] } },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['packages/**/src/**/*.spec.ts'],
          exclude: ['**/*.int.spec.ts', '**/node_modules/**', '**/dist/**'],
        },
      },
      {
        extends: true,
        test: {
          name: 'int',
          environment: 'node',
          include: ['packages/**/src/**/*.int.spec.ts'],
          exclude: ['**/node_modules/**', '**/dist/**'],
          // Booting a real Payload + sqlite is slower than a unit test, and each
          // suite owns its own in-memory DB, so don't run suites in parallel.
          hookTimeout: 60_000,
          testTimeout: 30_000,
          fileParallelism: false,
        },
      },
    ],
  },
})
