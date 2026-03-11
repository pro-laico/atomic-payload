export const getServerSideURL = () => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

  return url || 'http://localhost:3000'
}

export const getClientSideURL = () => {
  if (!!(typeof window !== 'undefined' && window.document && window.document.createElement)) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port
    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
