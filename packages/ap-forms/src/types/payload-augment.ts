/**
 * Schema stubs owned by `@pro-laico/ap-forms`.
 */
import type { Get, DefaultRecord, DefaultBlock } from '@pro-laico/ap-types'

// /////////////////////////////////////
// Document / record shapes
// /////////////////////////////////////

export type Form = Get<'Form', DefaultRecord>
export type FormSubmission = Get<'FormSubmission', DefaultRecord>
export type StoredAtomicForm = Get<'StoredAtomicForm', DefaultRecord>
export type StoredAtomicFormInput = Get<'StoredAtomicFormInput', DefaultRecord>

// /////////////////////////////////////
// Tuple / array shapes
// /////////////////////////////////////

export type FormRateLimitBlocks = Get<'FormRateLimitBlocks', DefaultBlock[]>
export type FormSanitationBlocks = Get<'FormSanitationBlocks', DefaultBlock[]>
export type FormValidationBlocks = Get<'FormValidationBlocks', DefaultBlock[]>
export type InputSanitationBlocks = Get<'InputSanitationBlocks', DefaultBlock[]>
export type InputValidationBlocks = Get<'InputValidationBlocks', DefaultBlock[]>

/** Form / input SVR block payloads (definitions in generated `payload-types.ts`). */
export type FrlSimpleSlidingWindow = Get<'FrlSimpleSlidingWindow', DefaultBlock>
export type FsCombineTwoFields = Get<'FsCombineTwoFields', DefaultBlock>
export type FvIsUnique = Get<'FvIsUnique', DefaultBlock>
export type IsTrimText = Get<'IsTrimText', DefaultBlock>
export type IvContains = Get<'IvContains', DefaultBlock>
export type IvDoesNotContain = Get<'IvDoesNotContain', DefaultBlock>

// /////////////////////////////////////
// String-literal union types
// /////////////////////////////////////

export type FormRateLimitBlockType = Get<'FormRateLimitBlockType', string>
export type FormSanitationBlockType = Get<'FormSanitationBlockType', string>
export type FormValidationBlockType = Get<'FormValidationBlockType', string>
export type InputValidationBlockType = Get<'InputValidationBlockType', string>
export type InputSanitationBlockType = Get<'InputSanitationBlockType', string>
