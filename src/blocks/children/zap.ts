import { z } from '@/ts/zap'
import ChildrenBlocks from './blocks'

// Helper function to check if a block has actions with the specified prefix
function hasActions(block: any, prefix: 'trigger' | 'content'): boolean {
  if (!block.fields) return false

  const actionFieldName = `${prefix}Actions`

  // Check if any field has the action field name or if it's in a tab with that action field
  return block.fields.some((field: any) => {
    if (field.name === actionFieldName) return true
    if (field.type === 'tabs' && field.tabs) {
      return field.tabs.some((tab: any) => tab.fields?.some((tabField: any) => tabField.name === actionFieldName))
    }
    return false
  })
}

// All Child Blocks
export const ChildBlockType = z.ap.add(z.enum(ChildrenBlocks.map((block) => block.slug)), { id: 'ChildBlockType' })

// Non Recursive Child Blocks. So all except AtomicChild
export const NonRecursiveChildBlockType = z.ap.add(
  z.enum(ChildrenBlocks.filter((block) => block.slug !== 'AtomicChild').map((block) => block.slug)),
  { id: 'NonRecursiveChildBlockType' },
)

// Portal Backdrop Blocks. Set manually.
export const BackdropChildSlug = z.ap.add(z.enum(['SVGChild']), { id: 'BackdropChildSlug' })

// Blocks that contain triggerActions - automatically determined from ChildrenBlocks
export const TriggerActionsBlockType = z.ap.add(z.enum(ChildrenBlocks.filter((block) => hasActions(block, 'trigger')).map((block) => block.slug)), {
  id: 'ChildrenWithTriggerActions',
})

// Blocks that contain contentActions - automatically determined from ChildrenBlocks
export const ContentActionsBlockType = z.ap.add(z.enum(ChildrenBlocks.filter((block) => hasActions(block, 'content')).map((block) => block.slug)), {
  id: 'ChildrenWithContentActions',
})

export const ChildrenWithActions = z.ap.add(z.enum([...TriggerActionsBlockType.options, ...ContentActionsBlockType.options]), {
  id: 'ChildrenWithActions',
})

const ChildBlocks = [
  ChildBlockType,
  NonRecursiveChildBlockType,
  BackdropChildSlug,
  TriggerActionsBlockType,
  ContentActionsBlockType,
  ChildrenWithActions,
]
export default ChildBlocks
