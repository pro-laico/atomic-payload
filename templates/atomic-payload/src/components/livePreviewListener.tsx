'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { getClientSideURL } from '@/utilities/get/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'

export default function LivePreviewListener() {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}
