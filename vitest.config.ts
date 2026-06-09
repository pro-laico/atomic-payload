import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

// Some package entrypoints import `server-only` (a guard that throws outside an
// RSC server bundle). Under Vitest's node environment that import would throw, so
// alias it to an empty module.
const serverOnlyStub = fileURLToPath(new URL('./tools/test-helpers/src/empty.ts', import.meta.url))

// The atomic-payload template imports its own modules via the `@/` alias
// (tsconfig `paths`). The `template-seed` suite imports the real template config,
// so resolve `@/…` to the template's src. Only the template uses this prefix, so
// the alias is inert for the other suites.
const templateSrc = fileURLToPath(new URL('./templates/atomic-payload/src', import.meta.url))

export default defineConfig({
  // SWC transform for JSX/TSX — matches the build's .swcrc so components transform
  // the same way in tests. Harmless for the pure-TS unit suites.
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'server-only', replacement: serverOnlyStub },
      // Trailing slash in the regex avoids matching scoped pkgs like `@payloadcms/…`.
      { find: /^@\//, replacement: `${templateSrc}/` },
    ],
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
      {
        extends: true,
        test: {
          name: 'template-seed',
          environment: 'node',
          // Boots the FULL atomic-payload template config against a real MongoDB
          // (mongodb-memory-server replica set) and runs the real seed. Kept under
          // tests/ (not inside the template) so it never gets scaffolded into user
          // projects, and is Mongo-backed — unlike the SQLite `int` suites — so it
          // catches Mongo-specific seed failures.
          include: ['tests/**/*.int.spec.ts'],
          exclude: ['**/node_modules/**', '**/dist/**'],
          // Spinning up a replica set + booting the whole template is slow.
          hookTimeout: 180_000,
          testTimeout: 120_000,
          fileParallelism: false,
        },
      },
    ],
  },
})
