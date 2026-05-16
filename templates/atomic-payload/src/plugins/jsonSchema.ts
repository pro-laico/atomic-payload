import { generateBlocksType, toJSONSchemaExtensions } from '@pro-laico/zap'
import { jsonSchemaPlugin } from '@pro-laico/core'
import CollectionSchemas from '@pro-laico/site/zap'
import { ActionBlockType } from '@pro-laico/atomic/actions/zap'
import { Runner, Attributer } from '@pro-laico/atomic/children/useActions/zap'
import { ChildBlockType, BackdropChildSlug } from '@pro-laico/atomic/children/zap'
import { InputValidationBlockType, InputSanitationBlockType } from '@pro-laico/atomic/forms/submitForm/input/zap'
import { FormRateLimitBlockType, FormSanitationBlockType, FormValidationBlockType } from '@pro-laico/atomic/forms/submitForm/form/zap'

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
