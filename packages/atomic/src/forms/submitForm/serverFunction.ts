'use server'

import type { SubmitFormFunction } from '@pro-laico/atomic/forms'
import getCached from '@pro-laico/core/cache/auto'
import { draftMode, headers as nextHeaders } from 'next/headers'
import { getServerSideURL } from '../utilities/getServerSideURL'
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
      const req = await fetch(`${getServerSideURL()}/api/form-submissions`, {
        body: JSON.stringify({ form: storedForm.backendFormID, submissionData: submitToPayload }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!req.ok) return { success: false, formData, submissionID, fm: 'Failed to store form submission.', im: {} }
    }

    return response
  } catch (err: unknown) {
    console.error(err)
    return { success: false, formData, submissionID, fm: 'Unknown Error. Please try again later.', im: {} }
  }
}
