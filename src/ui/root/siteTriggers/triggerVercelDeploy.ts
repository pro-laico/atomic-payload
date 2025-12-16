'use server'

export async function triggerVercelDeployServerFunction(): Promise<{
  success: boolean
  message: string
  timestamp: string
}> {
  try {
    const webhookUrl = process.env.VERCEL_DEPLOY_WEBHOOK_URL

    if (!webhookUrl) {
      throw new Error('VERCEL_DEPLOY_WEBHOOK_URL environment variable is not configured')
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`Webhook request failed with status: ${response.status}`)
    }

    return {
      success: true,
      message: 'Vercel deploy webhook triggered successfully',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to trigger Vercel deploy:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to trigger Vercel deploy',
      timestamp: new Date().toISOString(),
    }
  }
}
