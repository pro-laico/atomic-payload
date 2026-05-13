'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { RenderChild } from 'atomic-payload/child-blocks-types'
import type { VideoChild as VideoChildType } from 'atomic-payload/child-blocks-types'

const MuxVideoReact = dynamic(() => import('@mux/mux-video-react'))

export const VideoChild: React.FC<RenderChild<VideoChildType>> = ({ pt }) => {
  return <MuxVideoReact {...pt?.c?.p} {...pt?.c?.da} />
}
