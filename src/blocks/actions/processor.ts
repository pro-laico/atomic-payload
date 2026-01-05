//Action Options
import { ActSetTheme } from './theme/set/options'
import { ActResetForm } from './form/reset/options'
import { ActSubmitForm } from './form/submit/options'
import { ActSetCC } from './cookieConsent/set/options'
import { ActSetPortalOpen } from './portal/set/options'
import { ActCCToDA } from './cookieConsent/toDA/options'
import { ActFormErrorToDA } from './form/errorToDA/options'
import { ActFormStatusToDA } from './form/statusToDA/options'
import { ActDSTextToDA } from './dynamicStore/text/toDA/options'
import { ActDSSetBool } from './dynamicStore/boolean/set/options'
import { ActDSCycleText } from './dynamicStore/text/cycle/options'
import { ActDSBoolToDA } from './dynamicStore/boolean/toDA/options'

//Other
import { z } from '@/ts/zap'
import { ActionFilters } from './filters'
import {
  AllActions,
  ChildBlocks,
  InitialValue,
  StoredAtomicActions,
  ActionProcessFunction,
  ActionBlockDefaultReturns,
  ActionSetKeyInitialByAction,
} from '@/ts/types'

export const ActionOptions = {
  ActSetCC,
  ActCCToDA,
  ActSetTheme,
  ActDSSetBool,
  ActResetForm,
  ActDSTextToDA,
  ActDSBoolToDA,
  ActSubmitForm,
  ActDSCycleText,
  ActFormErrorToDA,
  ActSetPortalOpen,
  ActFormStatusToDA,
}

// /////////////////////////////////////
// Action Processor
// /////////////////////////////////////

/**
 * Action Block Processor
 *
 * Processes action blocks and manages their execution context.
 * Handles initial values, form mappings, and action processing for atomic components.
 *
 * This class is responsible for processing action blocks within the atomic system.
 * It manages the lifecycle of actions including setting initial values, processing blocks,
 * and coordinating between different action types (runners, attributers).
 */
export class ActionBlockStorageProcessor {
  //Before Storage
  initialValuesMap: Map<string, InitialValue> = new Map()
  formNameMap: Map<string, string> = new Map()
  portalNameMap: Map<string, string> = new Map()

  //Temp Storage
  triggerStore: NonNullableObject<AllActions> = { actionBlocks: [], actions: [], runners: [], attributers: [] }
  contentStore: NonNullableObject<AllActions> = { actionBlocks: [], actions: [], runners: [], attributers: [] }
  processorResult: ActionBlockDefaultReturns = { actions: [], runners: [], attributers: [] }

  //New storage for all block actions
  allBlockActions: StoredAtomicActions = {}

  constructor() {}

  /**
   * @note Stores values in the class instance.
   * @description Grabs All Form/Portal Names and stores a blocks actions initial values for later use.
   */
  before({ node, path }: { node: object; path: string[] }) {
    if (!node || typeof node !== 'object' || !('blockType' in node)) return node
    const block = node as ChildBlocks[number]

    this.setKeyInitialValueByAction({ block })

    //Add FormName & PortalName If They Exist
    if (block.blockType === 'AtomicChild') {
      // Add FormName & PortalName If They Exist
      if (block?.type === 'form' && block.formName) this.formNameMap.set(path.join('.'), block.formName)
      if (block?.type === 'button' && block.buttonType === 'portal' && block.portalName) this.portalNameMap.set(path.join('.'), block.portalName)
    }
  }

  /**
   *  Sets initial values for action keys by actions.
   *  Runs blocks first, as some atomic block variants have values that we want to inherit initial values from.
   *  Then we process the trigger and content actions.
   */
  setKeyInitialValueByAction({ block }: { block: ChildBlocks[number] }) {
    // Get Trigger Action Initial Values
    if ('triggerActions' in block && block?.triggerActions && block.triggerActions.actionBlocks) {
      if (Array.isArray(block.triggerActions.actionBlocks) && block.triggerActions.actionBlocks?.length > 0) {
        block.triggerActions.actionBlocks?.forEach((actionBlock) => {
          const AO = ActionOptions[actionBlock.blockType]
          if ('setKeyInitialByAction' in AO) {
            const setter = AO.setKeyInitialByAction as ActionSetKeyInitialByAction<typeof actionBlock.blockType>
            const value = setter({ block, initialValuesMap: this.initialValuesMap, actionBlock })
            if (value && !this.initialValuesMap.has(value.key)) this.initialValuesMap.set(value.key, value)
          }
        })
      }
    }

    // Get Content Action Initial Values
    if ('contentActions' in block && block?.contentActions && block.contentActions.actionBlocks) {
      if (Array.isArray(block.contentActions.actionBlocks) && block.contentActions.actionBlocks?.length > 0) {
        block.contentActions.actionBlocks?.forEach((actionBlock) => {
          const AO = ActionOptions[actionBlock.blockType]
          if ('setKeyInitialByAction' in AO) {
            const setter = AO.setKeyInitialByAction as ActionSetKeyInitialByAction<typeof actionBlock.blockType>
            const value = setter({ block, initialValuesMap: this.initialValuesMap, actionBlock })
            if (value && !this.initialValuesMap.has(value.key)) this.initialValuesMap.set(value.key, value)
          }
        })
      }
    }
  }

  setKeyInitialValueByBlock({ node }: { node: unknown }) {
    if (!node || typeof node !== 'object' || !('blockType' in node)) return node
    const block = node as ChildBlocks[number]
    //Get initial values from the block itself
    Object.values(ActionOptions).forEach((option) => {
      if ('setKeyInitialByBlock' in option && option.setKeyInitialByBlock) {
        const value = option.setKeyInitialByBlock({ block, initialValuesMap: this.initialValuesMap })
        if (value && !this.initialValuesMap.has(value.key)) this.initialValuesMap.set(value.key, value)
      }
    })
  }

  /**
   * @note Mutates the passed in node.
   * @description Stores the action blocks to their respective storage fields, and utilizes values stored by the "before" method.
   */
  after({ node, path }: { node: unknown; path: string[] }) {
    if (!node || typeof node !== 'object' || !('blockType' in node)) return node
    const BlockType = z.ap.get('ChildBlockType').safeParse(node.blockType)
    if (!BlockType.success) return node
    const block = node as ChildBlocks[number]

    // Add Defaults For Any Node
    this.runNodeDefaults({ block })

    if ('triggerActions' in block) {
      if (block?.triggerActions?.actionBlocks) {
        this.triggerStore.actionBlocks.push(...block?.triggerActions?.actionBlocks)
        this.processActionBlocks({ placement: 'trigger', AllActions: this.triggerStore, block, path })
        block.triggerActions = this.triggerStore

        this.storeActionBlock({ block, placement: 'trigger' })
        this.resetStore({ placement: 'trigger' })
      } else block.triggerActions = undefined //Remove previously stored actions if no actions are set
    }

    if ('contentActions' in block) {
      if (block?.contentActions?.actionBlocks) {
        this.contentStore.actionBlocks.push(...block?.contentActions?.actionBlocks)
        this.processActionBlocks({ placement: 'content', AllActions: this.contentStore, block, path })
        block.contentActions = this.contentStore

        this.storeActionBlock({ block, placement: 'content' })
        this.resetStore({ placement: 'content' })
      } else block.contentActions = undefined //Remove previously stored actions if no actions are set
    }

    return block
  }

  /**
   *  Checks for defaults on every child block that CAN have actions.
   *  This means if a block has no actions defined, this will still run on it.
   *  The default functions conditionally apply actions depending on context.
   */
  private runNodeDefaults({ block }: { block: ChildBlocks[number] }) {
    if (z.ap.get('ChildrenWithTriggerActions').safeParse(block.blockType).success) {
      Object.values(ActionOptions).forEach((option) => {
        if ('triggerDefaults' in option) {
          option.triggerDefaults({ block, data: this.triggerStore, initialValuesMap: this.initialValuesMap })
          //TODO: Fix typing here.
          //@ts-expect-error zod ensures proper usage.
          if (this.triggerStore.actions.length > 0) block['triggerActions'] = this.triggerStore
        }
      })
    }
    if (z.ap.get('ChildrenWithContentActions').safeParse(block.blockType).success) {
      Object.values(ActionOptions).forEach((option) => {
        if ('contentDefaults' in option) {
          option.contentDefaults({ block, data: this.contentStore, initialValuesMap: this.initialValuesMap })
          //@ts-expect-error zod ensures proper usage.
          if (this.contentStore.actions.length > 0) block['contentActions'] = this.contentStore
        }
      })
    }
  }

  private processActionBlocks({
    placement,
    AllActions,
    block,
    path,
  }: {
    placement: 'trigger' | 'content'
    AllActions: NonNullableObject<AllActions>
    block: ChildBlocks[number]
    path: string[]
  }) {
    AllActions.actions.push(...AllActions.actionBlocks.map((actionBlock) => actionBlock.blockType))
    AllActions.actionBlocks.forEach((actionBlock) => {
      if (ActionFilters[actionBlock.blockType]({ placement, ...block })) {
        const { blockType } = actionBlock
        const closestFormName = this.formNameMap.get(this.findClosestParent(path, this.formNameMap.keys()) || '')
        const closestPortalName = this.portalNameMap.get(this.findClosestParent(path, this.portalNameMap.keys()) || '')
        const PF = ActionOptions[blockType].processFunction as ActionProcessFunction<typeof blockType>
        PF({
          ...actionBlock,
          block,
          data: AllActions,
          initialValuesMap: this.initialValuesMap,
          useForm: ('formName' in block && block?.formName) || closestFormName || undefined,
          usePortal: ('portalName' in block && block?.portalName) || closestPortalName || undefined,
        })
      }
    })
  }

  /** Adds block to the flat storage array on the document. */
  private storeActionBlock({ block, placement }: { block: ChildBlocks[number]; placement: 'trigger' | 'content' }) {
    if (!block.id) throw new Error('Block ID is required for storing an action. In action block storage processors after method.')
    const store = placement === 'trigger' ? this.triggerStore : this.contentStore
    const { actionBlocks, ...rest } = store
    this.allBlockActions[block.id] = { id: block.id, ...rest }
  }

  private resetStore({ placement }: { placement: 'trigger' | 'content' }) {
    if (placement === 'trigger') this.triggerStore = { actionBlocks: [], actions: [], runners: [], attributers: [] }
    if (placement === 'content') this.contentStore = { actionBlocks: [], actions: [], runners: [], attributers: [] }
  }

  /**
   * @description Gets all action blocks that have been stored during processing
   * @returns Array of all block actions with their paths
   */
  getAllActionBlocks(): StoredAtomicActions | undefined {
    return Object.keys(this.allBlockActions).length > 0 ? this.allBlockActions : undefined
  }

  private findClosestParent(inputPath: string[], parentPaths: MapIterator<string>): string | null {
    const inputPathString = inputPath.join('.')
    let bestMatch = { length: 0, path: '' }

    for (const path of Array.from(parentPaths)) {
      if (inputPathString.startsWith(path) && path.length > bestMatch.length) bestMatch = { length: path.length, path }
    }
    return bestMatch.path
  }
}
