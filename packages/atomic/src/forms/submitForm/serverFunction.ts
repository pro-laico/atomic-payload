'use server'

import type { SubmitFormFunction } from '@pro-laico/atomic/forms'
import getCached from '@pro-laico/core/cache/auto'
import { getPayloadInstance } from '@pro-laico/core/payload'
import { draftMode, headers as nextHeaders } from 'next/headers'

import { getSubmitFormProcessor } from './formProcessor'

export const submitForm: SubmitFormFunction = async (submissionData) => {
  const headers = await nextHeaders()
  const { isEnabled: draft } = await draftMode()
  const { blockID, submissionID, formData } = submissionData

  try {
    // Get the stored form
    const backendForms = await getCached('backend-forms')
    if (!backendForms) return { success: false, formData, submissionID, fm: 'No backend forms found.', im: {} }
    const atomicForms = await getCached('atomic-forms', draft)
    if (!atomicForms) return { success: false, formData, submissionID, fm: 'No stored atomic forms found.', im: {} }
    const allForms = await getCached('all-forms', draft, atomicForms, backendForms)
    if (!allForms) return { success: false, formData, submissionID, fm: 'No all forms found.', im: {} }
    const storedForm = allForms.find((form) => form.id === blockID)
    if (!storedForm?.id) return { success: false, formData, submissionID, fm: 'No backend form found for this atomic form.', im: {} }

    const formProcessor = await getSubmitFormProcessor()
    const { response, submitToPayload } = await formProcessor.process({ submissionData, headers, storedForm })

    if (response.success) {
      // Write via the Local API rather than POSTing to the public
      // `/api/form-submissions` REST endpoint. The validated SVR pipeline above
      // must be the ONLY path to a stored submission, so the submission
      // collection locks `create` to deny — hence `overrideAccess: true` here.
      const payload = await getPayloadInstance()
      try {
        await payload.create({
          collection: 'form-submissions',
          data: { form: storedForm.backendFormID, submissionData: submitToPayload },
          overrideAccess: true,
        })
      } catch (err) {
        payload.logger.error({ err, msg: 'Failed to store form submission' })
        return { success: false, formData, submissionID, fm: 'Failed to store form submission.', im: {} }
      }
    }

    return response
  } catch (err: unknown) {
    console.error(err)
    return { success: false, formData, submissionID, fm: 'Unknown Error. Please try again later.', im: {} }
  }
}
