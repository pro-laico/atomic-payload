/** Same behavior as the Atomic Payload template `getServerSideURL` (no `atomic-payload` import). */
export const getServerSideURL = () => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

  // In production, falling back to localhost means form submissions POST to a
  // dead URL and silently fail. Warn loudly rather than throw (throwing would
  // break SSG/build). Set NEXT_PUBLIC_SERVER_URL (or VERCEL_PROJECT_PRODUCTION_URL).
  if (!url && process.env.NODE_ENV === 'production') {
    console.warn(
      '[@pro-laico/atomic] getServerSideURL: no NEXT_PUBLIC_SERVER_URL / VERCEL_PROJECT_PRODUCTION_URL set in production — ' +
        'falling back to http://localhost:3000, so form submissions will fail. Set NEXT_PUBLIC_SERVER_URL.',
    )
  }

  return url || 'http://localhost:3000'
}
