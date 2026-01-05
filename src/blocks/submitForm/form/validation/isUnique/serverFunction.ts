'use server'
import getCached from '@/utilities/get/cache/react'
import { FvIsUnique as FvIsUniqueType } from '@/ts/types'
import { FilterSubmissionsByFieldAndValue, FormFunction } from '@/ts/types'

/** Filters form submissions based on field and value inputs. */
const filterSubmissionsByFieldAndValue: FilterSubmissionsByFieldAndValue = ({ submissions, fieldName, fieldValue }) => {
  return submissions.filter((submission) => {
    if (!submission.submissionData || !Array.isArray(submission.submissionData)) return false
    return submission.submissionData.some((data) => data.field === fieldName && data.value === String(fieldValue))
  })
}

export const FvIsUnique: FormFunction<{ block: FvIsUniqueType }> = async (args) => {
  const { formData, storedForm, response, block } = args
  const { fieldName, validationMessage } = block

  if (!formData.get(fieldName)) {
    response.success = false
    response.fm = `This form is missing a field named: ${fieldName}`
    return args
  }

  const cachedSubmissions = await getCached('form-submissions', storedForm.backendForm)
  const submissions = filterSubmissionsByFieldAndValue({ submissions: cachedSubmissions, fieldName, fieldValue: formData.get(fieldName) })

  if (submissions.length > 0) {
    if (!formData.get(fieldName)) {
      response.success = false
      response.fm = `Field '${fieldName}' not found in form data.`
      return args
    }

    response.success = false
    response.fm = validationMessage
    return args
  }

  return args
}
