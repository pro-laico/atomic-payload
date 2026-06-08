import { jsonSchemaPlugin } from '@pro-laico/core'
import CollectionSchemas from '@pro-laico/site/zap'
import { ActionBlockType } from '@pro-laico/atomic/actions/zap'
import { generateBlocksType, toJSONSchemaExtensions } from '@pro-laico/zap'
import { Attributer, Runner } from '@pro-laico/atomic/children/useActions/zap'
import { BackdropChildSlug, ChildBlockType } from '@pro-laico/atomic/children/zap'
import { InputSanitationBlockType, InputValidationBlockType } from '@pro-laico/atomic/forms/submitForm/input/zap'
import { FormRateLimitBlockType, FormSanitationBlockType, FormValidationBlockType } from '@pro-laico/atomic/forms/submitForm/form/zap'

const _instantiate = [Runner, Attributer, CollectionSchemas] // Ensure the nested schemas are added to global registry before type generation

export const jsonSchemaPluginConfig = jsonSchemaPlugin({
  toJSONSchemaExtensions,
  generateBlocksType,
  blocks: {
    ChildBlocks: ChildBlockType.options,
    ActionBlocks: ActionBlockType.options,
    BackdropChildren: BackdropChildSlug.options,
    FormRateLimitBlocks: FormRateLimitBlockType.options,
    FormSanitationBlocks: FormSanitationBlockType.options,
    FormValidationBlocks: FormValidationBlockType.options,
    InputSanitationBlocks: InputSanitationBlockType.options,
    InputValidationBlocks: InputValidationBlockType.options,
  },
})
