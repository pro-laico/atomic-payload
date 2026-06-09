import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

// Some package entrypoints import `server-only` (a guard that throws outside an
// RSC server bundle). Under Vitest's node environment that import would throw, so
// alias it to an empty module.
const serverOnlyStub = fileURLToPath(new URL('./tools/test-helpers/src/empty.ts', import.meta.url))

// The template and each example app import their own modules via the `@/` alias
// (tsconfig `paths`). A seed suite that boots one of those real configs needs
// `@/…` resolved to THAT app's src — and they differ per app — so the alias is
// applied per project (below), not globally. `src(...)` builds the absolute path.
const src = (appDir: string) => fileURLToPath(new URL(`./${appDir}/src`, import.meta.url))

// Per-project resolve for a suite that boots a real app config: stub `server-only`
// and map the app's own `@/` prefix. (Trailing slash in the regex avoids matching
// scoped pkgs like `@payloadcms/…`.)
const appResolve = (appDir: string) => ({
  alias: [
    { find: 'server-only', replacement: serverOnlyStub },
    { find: /^@\//, replacement: `${src(appDir)}/` },
  ],
})

export default defineConfig({
  // SWC transform for JSX/TSX — matches the build's .swcrc so components transform
  // the same way in tests. Harmless for the pure-TS unit suites.
  plugins: [react()],
  resolve: {
    alias: [{ find: 'server-only', replacement: serverOnlyStub }],
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
        resolve: appResolve('templates/atomic-payload'),
        test: {
          name: 'template-seed',
          environment: 'node',
          // Boots the FULL atomic-payload template config against a real MongoDB
          // (mongodb-memory-server replica set) and runs the real seed. Kept under
          // tests/ (not inside the template) so it never gets scaffolded into user
          // projects, and is Mongo-backed — unlike the SQLite `int` suites — so it
          // catches Mongo-specific seed failures.
          include: ['tests/template-seed/**/*.int.spec.ts'],
          exclude: ['**/node_modules/**', '**/dist/**'],
          // Spinning up a replica set + booting the whole template is slow.
          hookTimeout: 180_000,
          testTimeout: 120_000,
          fileParallelism: false,
        },
      },
      // One project per example app: each boots that example's REAL Payload config
      // (on in-memory SQLite) and runs its extracted seed function. Separate
      // projects because each needs its own `@/` → its own src.
      ...(['fonts-only', 'icons-only', 'styles-only'] as const).map((example) => ({
        extends: true as const,
        resolve: appResolve(`examples/${example}`),
        test: {
          name: `example-seed:${example}`,
          environment: 'node' as const,
          include: [`tests/examples/${example}/**/*.int.spec.ts`],
          exclude: ['**/node_modules/**', '**/dist/**'],
          hookTimeout: 60_000,
          testTimeout: 30_000,
          fileParallelism: false,
        },
      })),
    ],
  },
})
