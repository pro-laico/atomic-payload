import type { Block, Config, Plugin } from 'payload'
import FormRateLimitBlocks from './submitForm/form/rateLimiting/blocks'
import FormSanitationBlocks from './submitForm/form/sanitation/blocks'
import FormValidationBlocks from './submitForm/form/validation/blocks'
import InputSanitationBlocks from './submitForm/input/sanitation/blocks'
import InputValidationBlocks from './submitForm/input/validation/blocks'

const defaultSubmitFormBlocks: Block[] = [
  ...FormRateLimitBlocks,
  ...FormSanitationBlocks,
  ...FormValidationBlocks,
  ...InputSanitationBlocks,
  ...InputValidationBlocks,
]

export interface FormsPluginOptions {
  enabled?: boolean
  /**
   * Extra form / input processing blocks merged after the package defaults and
   * before any blocks already on `config.blocks`.
   */
  formBlocks?: Block[]
  /**
   * @deprecated Use {@link FormsPluginOptions.formBlocks} instead.
   */
  blocks?: Block[]
}

/**
 * Prepends default submit-form blocks (rate limiting, sanitation, validation).
 * Run this plugin **before** `actionsPlugin` and `childBlocksPlugin` so the
 * final order stays: child blocks → action blocks → form blocks → …
 */
export const formsPlugin =
  (opts: FormsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, formBlocks: more, blocks: legacy } = opts
    if (!enabled) return config
    const additional = [...(more ?? []), ...(legacy ?? [])]
    return {
      ...config,
      blocks: [...defaultSubmitFormBlocks, ...additional, ...(config.blocks ?? [])],
    }
  }

export default formsPlugin

export { defaultSubmitFormBlocks }
