// `@payloadcms/next/css` resolves to a stylesheet (dist/prod/styles.css) with no type
// declarations. The `*.css` ambient glob doesn't match this bare package specifier, so
// declare it explicitly — otherwise the side-effect import in the (payload) layout/route
// fails typecheck under TS 6 with moduleResolution "bundler" (TS2882).
declare module '@payloadcms/next/css'
