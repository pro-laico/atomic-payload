export type { FormsPluginOptions } from './plugin'
export { default, defaultSubmitFormBlocks, formsPlugin } from './plugin'
export type * from './types'
/** Do not re-export `submitForm` / `getSubmitFormProcessor` here: they transitively import `getCached`, which runs during Next/Payload config evaluation and causes circular init. Use the `./submitForm/serverFunction` and `./submitForm/formProcessor` subpaths instead. */
