'use client'
import type { RenderChild } from '@pro-laico/atomic/children'
import type { VideoChild as VideoChildType } from '@pro-laico/atomic/children/schema'
import dynamic from 'next/dynamic'
import type React from 'react'

const MuxVideoReact = dynamic(() => import('@mux/mux-video-react'))

export const VideoChild: React.FC<RenderChild<VideoChildType>> = ({ pt }) => {
  return <MuxVideoReact {...pt?.c?.p} {...pt?.c?.da} />
}
