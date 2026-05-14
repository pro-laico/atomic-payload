import { generateBlocksType, toJSONSchemaExtensions } from '@pro-laico/atomic-payload-zap'
import { jsonSchemaPlugin } from '@pro-laico/atomic-payload-types'
import CollectionSchemas from '@/collections/zap'
import { ActionBlockType } from '@pro-laico/atomic-payload-actions/zap'
import { Runner, Attributer } from '@pro-laico/atomic-payload-child-blocks/useActions/zap'
import { ChildBlockType, BackdropChildSlug } from '@pro-laico/atomic-payload-child-blocks/zap'
import { InputValidationBlockType, InputSanitationBlockType } from '@pro-laico/atomic-payload-forms/submitForm/input/zap'
import { FormRateLimitBlockType, FormSanitationBlockType, FormValidationBlockType } from '@pro-laico/atomic-payload-forms/submitForm/form/zap'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const instantiate = [Runner, Attributer, CollectionSchemas] //Ensure the nested schemas are added to global registry before type generation

export const jsonSchemaPluginConfig = jsonSchemaPlugin({
  enabled: true,
  toJSONSchemaExtensions,
  generateBlocksType,
  blocks: {
    ChildBlocks: ChildBlockType.options,
    BackdropChildren: BackdropChildSlug.options,
    ActionBlocks: ActionBlockType.options,
    FormRateLimitBlocks: FormRateLimitBlockType.options,
    FormSanitationBlocks: FormSanitationBlockType.options,
    FormValidationBlocks: FormValidationBlockType.options,
    InputSanitationBlocks: InputSanitationBlockType.options,
    InputValidationBlocks: InputValidationBlockType.options,
  },
})
