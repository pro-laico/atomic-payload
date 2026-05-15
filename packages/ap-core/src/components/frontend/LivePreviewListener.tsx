'use client'
import { useRouter } from 'next/navigation'
import { getClientSideURL } from '../../utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'

export default function LivePreviewListener() {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}
