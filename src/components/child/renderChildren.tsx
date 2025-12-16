'use server'
import 'server-only' //DO NOT REMOVE

import { BlockSlug } from 'payload'
import { SSRProps } from './SSRProps'
import { RenderChildrenProps, AtomicChild, ChildBySlug, ChildrenWithActions, ChildBlocks, PassThroughs, BlockBySlug } from '@/ts/types'

//Components
import { SVGChild } from '@/blocks/children/svg/component'
import { IconChild } from '@/blocks/children/icon/component'
import { ImageChild } from '@/blocks/children/image/component'
import { VideoChild } from '@/blocks/children/video/component'
import { RichTextChild } from '@/blocks/children/richText/component'

//Simple Text Child
import { SimpleTextChild } from '@/blocks/children/simpleText/component'
import { SimpleTextChildClient } from '@/blocks/children/simpleText/component.client'

// Atomic Components - Direct imports
import { AtomicTag } from '@/blocks/children/atomic/variants/tag/component'
import { AtomicTagClient } from '@/blocks/children/atomic/variants/tag/component.client'
import { AtomicForm } from '@/blocks/children/atomic/variants/form/component'
//Input Variants
import { TextInputClient } from '@/blocks/children/atomic/variants/input/variants/text/component.client'
import { TextInput } from '@/blocks/children/atomic/variants/input/variants/text/component'
import { RadioInputClient } from '@/blocks/children/atomic/variants/input/variants/radio/component.client'
import { RadioInput } from '@/blocks/children/atomic/variants/input/variants/radio/component'
import { NumberInputClient } from '@/blocks/children/atomic/variants/input/variants/number/component.client'
import { NumberInput } from '@/blocks/children/atomic/variants/input/variants/number/component'
import { CheckboxInputClient } from '@/blocks/children/atomic/variants/input/variants/checkBox/component.client'
import { CheckboxInput } from '@/blocks/children/atomic/variants/input/variants/checkBox/component'
//Button Variants
import { AtomicButtonLinkClient } from '@/blocks/children/atomic/variants/button/variants/link/component.client'
import { AtomicButtonLink } from '@/blocks/children/atomic/variants/button/variants/link/component'

import { AtomicButtonRegular } from '@/blocks/children/atomic/variants/button/variants/regular/component'
import { AtomicButtonRegularClient } from '@/blocks/children/atomic/variants/button/variants/regular/component.client'
import { AtomicButtonPortalDialog } from '@/blocks/children/atomic/variants/button/variants/portal/dialog/component'
import { AtomicButtonPortalPopover } from '@/blocks/children/atomic/variants/button/variants/portal/popover/component'

const components = {
  SVGChild,
  IconChild,
  ImageChild,
  VideoChild,
  RichTextChild,
  SimpleTextChild,
}

const clientComponents = {
  SimpleTextChild: SimpleTextChildClient,
}

// Helper function to get the correct atomic component since we dont use layered registries
const getAtomicComponent = (block: AtomicChild, client: boolean) => {
  const { type, buttonType, inputType, portalType } = block

  if (type === 'button') {
    if (buttonType === 'link') return client ? AtomicButtonLinkClient : AtomicButtonLink
    if (buttonType === 'regular') return client ? AtomicButtonRegularClient : AtomicButtonRegular
    if (buttonType === 'portal') {
      if (portalType === 'dialog') return AtomicButtonPortalDialog
      if (portalType === 'popover') return AtomicButtonPortalPopover
    }
  }

  if (type === 'input') {
    switch (inputType) {
      case 'radio':
        return client ? RadioInputClient : RadioInput
      case 'number':
        return client ? NumberInputClient : NumberInput
      case 'checkbox':
        return client ? CheckboxInputClient : CheckboxInput
      case 'text':
      case 'email':
      case 'textarea':
        return client ? TextInputClient : TextInput
    }
  }

  if (type === 'tag') return client ? AtomicTagClient : AtomicTag
  if (type === 'form') return AtomicForm

  return null
}

function is<T extends BlockSlug>(item: BlockBySlug<BlockSlug>, slug: T): item is BlockBySlug<T>
function is<T extends BlockSlug>(item: BlockBySlug<BlockSlug>, slug: T): item is BlockBySlug<Extract<T, BlockSlug>> {
  if ('blockType' in item && typeof item.blockType === 'string') return item.blockType === slug
  return true
}

const hasActions = (block: ChildBlocks[number], passThroughs: PassThroughs): block is ChildBySlug<ChildrenWithActions> => {
  return Boolean(
    ('contentActions' in block && block?.contentActions?.actions && block?.contentActions?.actions.length > 0) ||
    ('triggerActions' in block && block?.triggerActions?.actions && block?.triggerActions?.actions.length > 0) ||
    (is(block, 'SimpleTextChild') && Boolean(Object.keys(passThroughs.c?.da || {}).length > 0)),
  )
}

const hasChildren = <T extends ChildBlocks[number], V extends 'children' | 'trigger' | 'backdrop'>(
  block: T,
  v: V,
): block is T &
  (V extends 'children' ? { children: ChildBlocks } : V extends 'trigger' ? { triggerChildren: ChildBlocks } : { backdropChildren: ChildBlocks }) => {
  if (v === 'children') return Boolean('children' in block && block.children && block.children?.length > 0)
  if (v === 'trigger') return Boolean('triggerChildren' in block && block.triggerChildren && block.triggerChildren?.length > 0)
  if (v === 'backdrop') return Boolean('backdropChildren' in block && block.backdropChildren && block.backdropChildren?.length > 0)
  return false
}

/** Render Children - Renders all payload child blocks. */
export const RenderChildren: RenderChildrenProps = async ({ blocks }) => {
  if (blocks && Array.isArray(blocks) && blocks.length > 0) {
    const renderedBlocks = await Promise.all(
      blocks.map(async (block, index) => {
        if ('blockType' in block) {
          let Component: React.FC<any> | null = null
          const passThroughs = await SSRProps(block)
          const useAction = hasActions(block, passThroughs)

          if (is(block, 'AtomicChild')) Component = getAtomicComponent(block, useAction)
          else Component = useAction ? clientComponents[block.blockType] : components[block.blockType]
          if (!Component) return null

          // Pre-render children conditionally to avoid creating elements unnecessarily
          const contentChildren = hasChildren(block, 'children') ? <RenderChildren blocks={block.children} /> : undefined
          const triggerChildren = hasChildren(block, 'trigger') ? <RenderChildren blocks={block.triggerChildren} /> : undefined
          const backdropChildren = hasChildren(block, 'backdrop') ? <RenderChildren blocks={block.backdropChildren} /> : undefined

          return (
            <Component
              key={index}
              block={block}
              pt={passThroughs}
              contentChildren={contentChildren}
              triggerChildren={triggerChildren}
              backdropChildren={backdropChildren}
            />
          )
        }
      }),
    )
    return <>{renderedBlocks}</>
  }
  return null
}
