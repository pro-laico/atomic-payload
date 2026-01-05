import type { BlocksFieldClientProps } from 'payload'
import type {
  Config,
  FormSubmission,
  StoredAtomicForm,
  AtomicInputTypes,
  CookiePreferences,
  FormRateLimitBlocks,
  FormSanitationBlocks,
  FormValidationBlocks,
  InputSanitationBlocks,
  InputValidationBlocks,
  FormRateLimitBlockType,
  FormSanitationBlockType,
  FormValidationBlockType,
  InputValidationBlockType,
  InputSanitationBlockType,
} from '@/ts/types'

// /////////////////////////////////////
// Collection Types
// /////////////////////////////////////

/** Collection slugs where the document type includes storedAtomicForms property. E.g., 'pages' | 'footer' | 'header' */
export type CollectionsWithStoredFormsSlugs = {
  [K in keyof Config['collections']]: Config['collections'][K] extends { storedAtomicForms?: unknown } ? K : never
}[keyof Config['collections']]

/** Document types from collections that include storedAtomicForms property. E.g., Page | Footer | Header */
export type CollectionsWithStoredForms = Config['collections'][CollectionsWithStoredFormsSlugs]

// /////////////////////////////////////
// INPUT CLIENT COMPONENT TYPES
// /////////////////////////////////////

export type UsedOn = { block: string; usedOn: AtomicInputTypes }[]
export interface InputBlocksFieldProps extends BlocksFieldClientProps {
  usedOn: { block: string; usedOn: AtomicInputTypes }[]
}

// /////////////////////////////////////
// UTILITY FUNCTION TYPES
// /////////////////////////////////////

export type FilterSubmissionsByFieldAndValue = (args: {
  fieldName: string
  submissions: FormSubmission[]
  fieldValue: FormDataEntryValue | null
}) => FormSubmission[]

// /////////////////////////////////////
// DATA TYPES
// /////////////////////////////////////

/** Data that is collected from the client and passed in. */
type ClientUserData = {
  timezone: string
  preferences: CookiePreferences
}

/** Data that is collected from the server via headers. */
type ServerUserData = {
  userAgent: string
}

type ClientAnalyticsData = {
  screenWidth: string
  screenHeight: string
}

/** Data that is collected from the server via headers. */
type ServerAnalyticsData = {
  referer: string
}

export type UserData = ClientUserData & ServerUserData
export type AnalyticsData = ClientAnalyticsData & ServerAnalyticsData

/* Server Functions Response To Client */
export type FormResponse = {
  /** Whether or not the form submission was/is successful. */
  success: boolean
  /** Input Error Messages. Used for displaying error messages for specific form fields. */
  im: Record<string, string>
  /** Form Message. Used for form error or success messages. */
  fm: string
  /** Submission ID. Used for tracking seperate submissions. */
  submissionID: string
  /** Only contains the actual data submitted by form fields. */
  formData: FormData
}

export type SubmitToPayload = { field: string; value: string }[]

// /////////////////////////////////////
// FORM PROCESSOR TYPES
// /////////////////////////////////////

// /////////////////////////////////////
// Generally Used Types

export type AllFormBlockTypes =
  | FormRateLimitBlockType
  | FormSanitationBlockType
  | FormValidationBlockType
  | InputSanitationBlockType
  | InputValidationBlockType

export type AllFormBlocks =
  | FormRateLimitBlocks[number]
  | FormSanitationBlocks[number]
  | FormValidationBlocks[number]
  | (InputSanitationBlocks[number] & { inputName: string })
  | (InputValidationBlocks[number] & { inputName: string })

/** Contains general context for use in form processor functions. */
export type FormContext = {
  ip: string
  /** The headers of the request. Grabbed By Next.js headers(). */
  headers: Headers
  /** The page the submission was made from. */
  referer: string
  /** The ID of the backend form. Used for submission. */
  backendFormID: string
  /** Data passed in from the client. */
  clientData: ClientUserData & ClientAnalyticsData
  /** Set by rate limiting functions, as the time to wait until the next request can be made.
   * Set in milliseconds.
   */
  waitFor?: number
}

export type ModifiedStoredAtomicForm = {
  /** The ID of the backend form. Used for submitting formData to payload. */
  backendFormID: string
} & StoredAtomicForm

// /////////////////////////////////////
// Input Parameters For Methods & Functions

/** Input Parameters For Submit Form Function */
export interface SubmitFormProps {
  formData: FormData
  submissionID: string
  blockID: string | null | undefined
  clientData: ClientUserData & ClientAnalyticsData
}

/** Base Parameters For All Functions Used In Form Processor */
export interface AFPBase {
  formData: FormData
  context: FormContext
  response: FormResponse
  storedForm: ModifiedStoredAtomicForm
}

/** Base Parameters For Form Processors public process() and private preProcess(). */
export type ProcessMethodArgs = {
  headers: Headers
  storedForm: ModifiedStoredAtomicForm
  submissionData: SubmitFormProps
}

type MessageProcessorArgs = {
  /** Validation Message. */
  vm: string
  /** Time in milliseconds to wait until the next request can be made. */
  waitFor?: number
  formData: FormData
}

type RunBlocksArgs = {
  type: AllFormBlockTypes
  block: AllFormBlocks
  persevere?: true
}

// /////////////////////////////////////
// Return Value Types

/** Return Value for Form Processor */
export type FormProcessorReturn = {
  response: FormResponse
  submitToPayload: SubmitToPayload
}

// /////////////////////////////////////
// Function Types

export type SubmitFormFunction = (args: SubmitFormProps) => Promise<FormResponse>

// /////////////////////////////////////
// Method Types

/** Private Method that modifies the incoming data for use in functions. */
export type PreProcessMethod = (args: ProcessMethodArgs) => void

/** Public Method that actually processes the form.*/
export type ProcessMethod = (args: ProcessMethodArgs) => Promise<FormProcessorReturn>

/** Private Method that modifies the outgoing data for use in storage. */
export type PostProcessMethod = () => FormProcessorReturn

/** Private Method that modifies the response messages. */
export type MessageProcessorMethod = (args: MessageProcessorArgs) => string

/** Private Method that finds and runs a blocks corresponding function.*/
export type RunBlocksMethod = (args: RunBlocksArgs) => Promise<void>

// /////////////////////////////////////
// Block Function Types

export type FormFunction<TArgs extends { block: AllFormBlocks } = { block: AllFormBlocks }> = (args: AFPBase & TArgs) => Promise<AFPBase>
export type FormFunctionsMap = { [K in AllFormBlocks as K['blockType']]: FormFunction<{ block: K }> }
