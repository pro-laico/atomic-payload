'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import type { RenderChild } from '@pro-laico/ap-child-blocks'
import type { VideoChild as VideoChildType } from '@pro-laico/ap-child-blocks/schema'
const MuxVideoReact = dynamic(() => import('@mux/mux-video-react'))

export const VideoChild: React.FC<RenderChild<VideoChildType>> = ({ pt }) => {
  return <MuxVideoReact {...pt?.c?.p} {...pt?.c?.da} />
}
