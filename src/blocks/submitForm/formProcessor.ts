'use server'
//Function Imports
import { FvIsUnique } from '@/blocks/submitForm/form/validation/functions'
import { IsTrimText } from '@/blocks/submitForm/input/sanitation/functions'
import { FsCombineTwoFields } from '@/blocks/submitForm/form/sanitation/functions'
import { FrlSimpleSlidingWindow } from '@/blocks/submitForm/form/rateLimiting/functions'
import { IvContains, IvDoesNotContain } from '@/blocks/submitForm/input/validation/functions'

//Other Imports
import { CookiePreferences } from '@/ts/types/actions'
import {
  AFPBase,
  RunBlocksMethod,
  FormFunction,
  ProcessMethod,
  FormFunctionsMap,
  PreProcessMethod,
  PostProcessMethod,
  MessageProcessorMethod,
} from '@/ts/types/forms'
import type {
  FormRateLimitBlocks,
  FormSanitationBlocks,
  FormValidationBlocks,
  InputSanitationBlocks,
  InputValidationBlocks,
  StoredAtomicFormInput,
} from '@/ts/types'
import { formatDurationString } from '@/utilities/formatDurationWithTokens'

const formFunctions: FormFunctionsMap = {
  FrlSimpleSlidingWindow,
  FsCombineTwoFields,
  FvIsUnique,
  IsTrimText,
  IvContains,
  IvDoesNotContain,
}

class SubmitFormProcessor {
  //Context
  private success: boolean = true
  private args: AFPBase | undefined
  private CCPreferences: CookiePreferences | undefined

  //Form Level Values
  private formRateLimitBlocks: FormRateLimitBlocks | undefined
  private formSanitationBlocks: FormSanitationBlocks | undefined
  private formValidationBlocks: FormValidationBlocks | undefined
  private formInputBlocks: StoredAtomicFormInput[] | undefined

  //Input Level Values
  private inputSanitationBlocks: InputSanitationBlocks | undefined
  private inputValidationBlocks: InputValidationBlocks | undefined

  private reset(target: 'context' | 'form' | 'input' | 'all') {
    if (target === 'context') {
      this.args = undefined
      this.success = true
      this.CCPreferences = undefined
    }
    if (target === 'form') {
      this.formRateLimitBlocks = undefined
      this.formSanitationBlocks = undefined
      this.formValidationBlocks = undefined
      this.formInputBlocks = undefined
    }
    if (target === 'input') {
      this.inputSanitationBlocks = undefined
      this.inputValidationBlocks = undefined
    }
    if (target === 'all') {
      this.reset('context')
      this.reset('form')
      this.reset('input')
    }
  }

  private preProcess: PreProcessMethod = (args) => {
    const { submissionData, headers, storedForm } = args
    const { formData, clientData, submissionID } = submissionData
    this.formInputBlocks = storedForm.inputs
    this.CCPreferences = clientData.preferences
    this.formSanitationBlocks = storedForm.sanitation
    this.formValidationBlocks = storedForm.validation
    this.formRateLimitBlocks = storedForm.rateLimiting
    this.args = {
      formData,
      storedForm,
      response: { success: true, submissionID, formData: new FormData(), fm: '', im: {} },
      context: {
        headers,
        clientData,
        backendFormID: storedForm.id,
        referer: headers.get('referer') || 'unknown',
        ip: headers.get('x-forwarded-for') || headers.get('x-real-ip') || headers.get('cf-connecting-ip') || 'unknown',
      },
    }
  }

  process: ProcessMethod = async (args) => {
    this.preProcess(args)

    //DO NOT CHANGE ORDER.
    await this.formRateLimitProcessor(true)
    await this.inputProcessor()
    await this.formSanitationProcessor()
    await this.formValidationProcessor()
    await this.formRateLimitProcessor(false)

    return this.postProcess()
  }

  private async formRateLimitProcessor(start: boolean) {
    if (!this.formRateLimitBlocks || !this.success) return
    const rateLimitArray = this.formRateLimitBlocks.filter((rateLimit) => rateLimit.atStart === start)
    for (const block of rateLimitArray) if (this.success) await this.runBlocks({ block, type: block.blockType })
  }

  private async formSanitationProcessor() {
    if (!this.formSanitationBlocks || !this.success) return
    for (const block of this.formSanitationBlocks) if (this.success) await this.runBlocks({ block, type: block.blockType })
  }

  private async formValidationProcessor() {
    if (!this.formValidationBlocks || !this.success) return
    for (const block of this.formValidationBlocks) if (this.success) await this.runBlocks({ block, type: block.blockType })
  }

  private async inputProcessor() {
    if (!this.formInputBlocks || !this.success) return
    for (const input of this.formInputBlocks) {
      if ((!input.sanitationBlocks && !input.validationBlocks) || !input.inputName) continue
      this.inputSanitationBlocks = input.sanitationBlocks
      this.inputValidationBlocks = input.validationBlocks
      await this.inputSanitationProcessor(input.inputName)
      await this.inputValidationProcessor(input.inputName)
      this.reset('input')
    }
  }

  private async inputSanitationProcessor(inputName: string) {
    if (!this.inputSanitationBlocks) return
    for (const block of this.inputSanitationBlocks) await this.runBlocks({ block: { ...block, inputName }, type: block.blockType, persevere: true })
  }

  private async inputValidationProcessor(inputName: string) {
    if (!this.inputValidationBlocks) return
    for (const block of this.inputValidationBlocks) await this.runBlocks({ block: { ...block, inputName }, type: block.blockType, persevere: true })
  }

  private runBlocks: RunBlocksMethod = async ({ type, block, persevere }) => {
    if (!this.args) throw new Error('Args is not defined in form processor.')
    if (!this.args.response.success) if (!persevere) return
    const augmentedArgs: Parameters<FormFunction>[0] = { ...this.args, block }

    const fn = formFunctions[type]
    if (!fn) throw new Error(`Unknown Server Function: ${type} in form processor runBlocksFunction`)

    //TODO: Fix typing
    this.args = await fn(augmentedArgs as any)
    if (!this.args.response.success) this.success = false
  }

  private postProcess: PostProcessMethod = () => {
    if (!this.args?.formData) throw new Error('Form data is not defined in form processor postProcess')
    if (!this.CCPreferences) throw new Error('CCPreferences is not defined in form processor postProcess')
    const { response, storedForm, context, formData } = this.args
    const { clientData, referer, headers, ip, waitFor } = context
    const submitToPayload = Array.from(this.args.formData.entries())
      //Only accepts string values currently
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
      .map(([key, value]) => ({ field: key, value }))

    //Handle Data Collection
    if (this.CCPreferences.userData) {
      submitToPayload.push({ field: 'ip', value: ip })
      submitToPayload.push({ field: 'timezone', value: clientData.timezone })
      submitToPayload.push({ field: 'userAgent', value: headers.get('user-agent') || 'unknown' })
    }
    if (this.CCPreferences.analytics) {
      submitToPayload.push({ field: 'referer', value: referer })
      submitToPayload.push({ field: 'screenWidth', value: clientData.screenWidth })
      submitToPayload.push({ field: 'screenHeight', value: clientData.screenHeight })
    }

    // Process Form & Input Messages
    let fm
    if (response.fm) fm = response.fm
    else if (this.success) fm = storedForm.sm || 'Form submitted successfully!'
    else fm = storedForm.em || 'Failed to submit form.'
    fm = this.messageProcessor({ vm: fm, formData, waitFor })
    if (Object.keys(response.im).length > 0) {
      for (const [key, vm] of Object.entries(response.im)) response.im[key] = this.messageProcessor({ vm, formData, waitFor })
    }

    //Submit Form Processor Response
    const fps = { response: { ...response, fm }, submitToPayload }
    this.reset('all')
    return fps
  }

  private messageProcessor: MessageProcessorMethod = ({ vm, formData, waitFor }) => {
    if (vm?.includes('{{') && vm?.includes('}}')) {
      if (waitFor) vm = formatDurationString(waitFor, vm)
      vm = vm.replace(/\{\{([^}]+)\}\}/g, (match: string, fieldKey: string) => {
        // Check if the field exists in formData
        if (formData.get(fieldKey) !== undefined) return String(formData.get(fieldKey))
        // If field doesn't exist, return the original placeholder
        return match
      })
    }

    return vm
  }
}

const submitFormProcessor = new SubmitFormProcessor()

export async function getSubmitFormProcessor() {
  return submitFormProcessor
}
