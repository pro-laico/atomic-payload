import type { Config } from '@/ts/types'
import type { NumberFieldClientProps, RequestContext } from 'payload'
import type { NameKebabOptions } from '@/utilities/format/toKebabCase'
import type {
  TextField,
  SelectField,
  NumberField,
  TextareaField,
  CheckboxField,
  TextFieldClientProps,
  SelectFieldClientProps,
  TextareaFieldClientProps,
  CheckboxFieldClientProps,
} from 'payload'

// /////////////////////////////////////
// General APF Types
// /////////////////////////////////////

/**Expensive Functions that process data on save, therefore must only run when their dependencies change. */
export type APFunction = 'form' | 'classes' | 'page' | 'pages' | 'actions' | 'seo' | 'active' | 'sitemap' | 'siteMetadata'

/** Type for the runAPF function which checks if a document has been marked as changed in the context. */
export type RunAPFProps = { context: RequestContext; id: string | undefined; apf: APFunction; data?: unknown }

// /////////////////////////////////////
// APF Field
// /////////////////////////////////////

export type SupportedAPFFields = TextField | TextareaField | CheckboxField | SelectField | NumberField

export type APFBaseProps = {
  /** On field change, this atomic payload function will run on submit. {@link APFunction}*/
  apf?: APFunction[]
  /** Defaults to 'name' */
  name?: string
  /** Used To Link To Documentation */
  docLink?: string
}

type TextAndTextareaBase = {
  /** Make text kebab case on save. Only runs on client side modification of the field. */
  kebab?: boolean | NameKebabOptions
}

export type APFieldType =
  | { args: SelectField & APFBaseProps; return: SelectField }
  | { args: NumberField & APFBaseProps; return: NumberField }
  | { args: CheckboxField & APFBaseProps; return: CheckboxField }
  | { args: TextField & APFBaseProps & TextAndTextareaBase; return: TextField }
  | { args: TextareaField & APFBaseProps & TextAndTextareaBase; return: TextareaField }

export type APArgs<Type extends SupportedAPFFields['type']> = Extract<APFieldType, { args: { type: Type } }>['args']
export type APReturn<Type extends SupportedAPFFields['type']> = Extract<APFieldType, { args: { type: Type } }>['return']

// /////////////////////////////////////
// APF Field Wrapper
// /////////////////////////////////////

/**
 * Typed so that when using the preset field, you don't need to add certain fields as they are already defined in the preset.
 * @param T - The type of the field.
 * @param Defaults - The defaults to omit from the args.
 * @param AdditionalArgs - Additional args are additionally required args to be passed when using the preset field.
 * @returns The return type of the field.
 */
export type APFieldWrapper<
  T extends SupportedAPFFields['type'],
  Defaults extends keyof APArgs<T>,
  AdditionalArgs extends Record<string, unknown> | void = void,
> = AdditionalArgs extends void
  ? // AdditionalArgs not provided → only base args
    (args?: Omit<APArgs<T>, Defaults>) => Extract<APFieldType, { args: { type: T } }>['return']
  : // AdditionalArgs provided → merged, required
    (args: Omit<APArgs<T>, Defaults> & AdditionalArgs) => Extract<APFieldType, { args: { type: T } }>['return']

// /////////////////////////////////////
// APF Field Component
// /////////////////////////////////////

export type APFComponentBaseProps = {
  docLink?: string
  apf: APFunction[]
}

/** Atomic Payload Fields, Field Component Type. */
export type APFFieldComponentType = (
  props:
    | ({ type: 'number' } & NumberFieldClientProps & APFComponentBaseProps)
    | ({ type: 'select' } & SelectFieldClientProps & APFComponentBaseProps)
    | ({ type: 'checkbox' } & CheckboxFieldClientProps & APFComponentBaseProps)
    | ({ type: 'text' } & TextFieldClientProps & APFComponentBaseProps & TextAndTextareaBase)
    | ({ type: 'textarea' } & TextareaFieldClientProps & APFComponentBaseProps & TextAndTextareaBase),
) => React.ReactNode

// /////////////////////////////////////
// Collections
// /////////////////////////////////////

export type CollectionsWithActive = {
  [K in keyof Config['collections']]: Config['collections'][K] extends { active?: any } ? Config['collections'][K] : never
}[keyof Config['collections']]

export type CollectionsWithoutActive = {
  [K in keyof Config['collections']]: Config['collections'][K] extends { active?: any } ? never : Config['collections'][K]
}[keyof Config['collections']]

export type Collections = Config['collections'][keyof Config['collections']]
