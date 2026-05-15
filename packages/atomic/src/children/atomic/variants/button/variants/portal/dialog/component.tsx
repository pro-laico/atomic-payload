'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import type { RenderChild } from '@pro-laico/atomic/children'
import type { AtomicChild } from '@pro-laico/atomic/children/schema'
import { useActionContext } from '../../../../../../hooks/useActions/useActionContext'
import { usePortalActions } from '../../../../../../hooks/useActions/usePortal'
import { useToDa } from '../../../../../../hooks/useActions/useToDa'

const Root = dynamic(() => import('@base-ui-components/react/dialog').then((mod) => mod.Dialog.Root))
const Trigger = dynamic(() => import('@base-ui-components/react/dialog').then((mod) => mod.Dialog.Trigger))
const Popup = dynamic(() => import('@base-ui-components/react/dialog').then((mod) => mod.Dialog.Popup), { ssr: false })
const Portal = dynamic(() => import('@base-ui-components/react/dialog').then((mod) => mod.Dialog.Portal), { ssr: false })
const Backdrop = dynamic(() => import('@base-ui-components/react/dialog').then((mod) => mod.Dialog.Backdrop), { ssr: false })

export const AtomicButtonPortalDialog: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { block, pt, triggerChildren, contentChildren, backdropChildren } = props
  const { dialogPortal, defaultOpen, ...rp } = pt?.po?.di?.p || {}

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
      <Portal {...dialogPortal!}>
        <Backdrop {...pt?.po?.b?.p}>{backdropChildren}</Backdrop>
        <Popup {...pt?.c?.p} {...pt?.c?.da} {...cda}>
          {contentChildren}
        </Popup>
      </Portal>
    </Root>
  )
}
