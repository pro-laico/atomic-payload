'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { AtomicChild, RenderChild } from '@/ts/types'
import { useActionContext, usePortalActions, useToDa } from '@/hooks/frontEnd/useActions'

const Root = dynamic(() => import('@base-ui-components/react/popover').then((mod) => mod.Popover.Root))
const Trigger = dynamic(() => import('@base-ui-components/react/popover').then((mod) => mod.Popover.Trigger))
const Popup = dynamic(() => import('@base-ui-components/react/popover').then((mod) => mod.Popover.Popup), { ssr: false })
const Arrow = dynamic(() => import('@base-ui-components/react/popover').then((mod) => mod.Popover.Arrow), { ssr: false })
const Portal = dynamic(() => import('@base-ui-components/react/popover').then((mod) => mod.Popover.Portal), { ssr: false })
const Backdrop = dynamic(() => import('@base-ui-components/react/popover').then((mod) => mod.Popover.Backdrop), { ssr: false })
const Positioner = dynamic(() => import('@base-ui-components/react/popover').then((mod) => mod.Popover.Positioner), { ssr: false })

export const AtomicButtonPortalPopover: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { block, pt, triggerChildren, contentChildren, backdropChildren } = props
  const { hasArrow, popPortal, popPositioner, defaultOpen, ...rp } = pt?.po?.pop?.p || {}

  const context = useActionContext()
  const portal = usePortalActions({ block, defaultOpen: Boolean(defaultOpen), context })
  const tda = useToDa({ attributers: block.triggerActions?.attributers, context })
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return (
    <Root {...rp} {...portal}>
      <Trigger {...pt?.t?.p} {...pt?.t?.da} {...tda}>
        {triggerChildren}
        {block?.screenReaderText && <span className="sr-only">{block?.screenReaderText}</span>}
      </Trigger>
      <Portal {...popPortal!}>
        <Backdrop {...pt?.po?.b?.p}>{backdropChildren}</Backdrop>
        <Positioner {...popPositioner!}>
          {hasArrow! && <Arrow />}
          <Popup {...pt?.c?.p} {...pt?.c?.da} {...cda}>
            {contentChildren}
          </Popup>
        </Positioner>
      </Portal>
    </Root>
  )
}
