'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import type { RenderChild } from '@pro-laico/atomic-payload-types'
import type { VideoChild as VideoChildType } from '@pro-laico/atomic-payload-types/schema'

const MuxVideoReact = dynamic(() => import('@mux/mux-video-react'))

export const VideoChild: React.FC<RenderChild<VideoChildType>> = ({ pt }) => {
  return <MuxVideoReact {...pt?.c?.p} {...pt?.c?.da} />
}
