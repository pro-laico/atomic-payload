import { generateBlocksType, toJSONSchemaExtensions } from '@pro-laico/ap-zap'
import { jsonSchemaPlugin } from '@pro-laico/ap-utils'
import CollectionSchemas from '@pro-laico/ap-site/zap'
import { ActionBlockType } from '@pro-laico/ap-actions/zap'
import { Runner, Attributer } from '@pro-laico/ap-child-blocks/useActions/zap'
import { ChildBlockType, BackdropChildSlug } from '@pro-laico/ap-child-blocks/zap'
import { InputValidationBlockType, InputSanitationBlockType } from '@pro-laico/ap-forms/submitForm/input/zap'
import { FormRateLimitBlockType, FormSanitationBlockType, FormValidationBlockType } from '@pro-laico/ap-forms/submitForm/form/zap'

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
