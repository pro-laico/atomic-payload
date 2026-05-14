'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { getClientSideURL } from '@pro-laico/ap-utils'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'

export default function LivePreviewListener() {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}
