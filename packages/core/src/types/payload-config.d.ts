// Ambient declaration of the `@payload-config` alias every Payload + Next.js
// project ships by convention. The consuming bundler (Next webpack/turbopack)
// resolves the alias to the host project's `payload.config.ts`; this stub only
// exists so ap-utils itself type-checks without that alias being available.
declare module '@payload-config' {
  import type { SanitizedConfig } from 'payload'
  const config: SanitizedConfig | Promise<SanitizedConfig>
  export default config
}
