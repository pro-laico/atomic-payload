'use server'
import 'server-only' //DO NOT REMOVE

import type { BlockBySlug, ChildBySlug, PassThroughs, RenderChildrenProps } from '@pro-laico/atomic/children'
import type { AtomicChild, ChildBlocks, ChildrenWithActions } from '@pro-laico/atomic/children/schema'
import type { BlockSlug } from 'payload'

import {
  AtomicButtonLink,
  AtomicButtonLinkClient,
  AtomicButtonPortalDialog,
  AtomicButtonPortalPopover,
  AtomicButtonRegular,
  AtomicButtonRegularClient,
  AtomicForm,
  AtomicTag,
  AtomicTagClient,
  CheckboxInput,
  CheckboxInputClient,
  IconChild,
  ImageChild,
  NumberInput,
  NumberInputClient,
  RadioInput,
  RadioInputClient,
  RichTextChild,
  SimpleTextChild,
  SimpleTextChildClient,
  SVGChild,
  TextInput,
  TextInputClient,
  VideoChild,
} from '../frontend-components'
import { SSRProps } from './SSRProps'

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

          if (block.blockType === 'AtomicChild') {
            Component = getAtomicComponent(block as AtomicChild, useAction)
          } else {
            const slug = (block as { blockType: string }).blockType
            Component = useAction ? clientComponents[slug as keyof typeof clientComponents] : components[slug as keyof typeof components]
          }
          if (!Component) return null

          const blockKey = ('id' in block && typeof block.id === 'string' ? block.id : undefined) ?? `block-${index}`

          // Pre-render children conditionally to avoid creating elements unnecessarily.
          // biome-ignore-start lint/correctness/useJsxKeyInIterable: these elements are passed as single props, not rendered as siblings in an iterable.
          const contentChildren = hasChildren(block, 'children') ? <RenderChildren blocks={block.children} /> : undefined
          const triggerChildren = hasChildren(block, 'trigger') ? <RenderChildren blocks={block.triggerChildren} /> : undefined
          const backdropChildren = hasChildren(block, 'backdrop') ? <RenderChildren blocks={block.backdropChildren} /> : undefined
          // biome-ignore-end lint/correctness/useJsxKeyInIterable: see above.

          return (
            <Component
              key={blockKey}
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
