/** Same behavior as the Atomic Payload template `getServerSideURL` (no `atomic-payload` import). */
export const getServerSideURL = () => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

  return url || 'http://localhost:3000'
}
