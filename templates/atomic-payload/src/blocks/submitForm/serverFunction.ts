'use server'
import getCached from '@/utilities/get/cache/react'
import { SubmitFormFunction } from '@/ts/types'
import { getSubmitFormProcessor } from './formProcessor'
import { getServerSideURL } from '@/utilities/get/getURL'
import { draftMode, headers as nextHeaders } from 'next/headers'

const formProcessor = await getSubmitFormProcessor()

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
    if (!storedForm || !storedForm.id) return { success: false, formData, submissionID, fm: 'No backend form found for this atomic form.', im: {} }

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
