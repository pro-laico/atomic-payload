'use client'
import { Toast } from '@base-ui-components/react/toast'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useActionContext } from '@/hooks/frontEnd/useActions/useActionContext'
import { submitForm as submitFormSF } from '@/blocks/submitForm/serverFunction'
import { FormResponse, AtomicChild, FullFormContext, ActionContext } from '@/ts/types'

export type UseFormProps = { block: AtomicChild }

export type UseFormReturns = {
  context: ActionContext
  handleReset: () => void
  formRef: React.RefObject<HTMLFormElement | null>
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function useForm(props: UseFormProps): UseFormReturns {
  const { block } = props
  const { formName } = block

  const toastManager = Toast.useToastManager()

  const formRef = useRef<HTMLFormElement | null>(null)

  const [formStatus, setFormStatus] = useState<string | null>(null)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [formResponse, setFormResponse] = useState<FormResponse | null>(null)

  const fullFormContext: FullFormContext = useMemo(() => ({ formRef, formResponse, submissionId }), [formRef, formResponse, submissionId])
  const context = useActionContext({ fullFormContext })

  useEffect(() => {
    if (!formName) return
    const formStatus = context.atomicStore.getValue(formName, false)
    setFormStatus(formStatus as string | null)
  }, [formName, context])

  function setStatus(status: 'pending' | 'success' | 'error' | 'reset', response?: FormResponse) {
    switch (status) {
      case 'reset':
        setSubmissionId(null)
      case 'pending':
        setFormResponse(null)
      case 'error':
      case 'success':
        if (formName) context.atomicStore.setValue(formName, status, false)
        if (response) context.atomicStore.setValue(`${formName}-response`, { form: response.fm, ...response.im }, false)
    }
  }

  useEffect(() => {
    if (!formName) return
    switch (formStatus) {
      case 'setPending': {
        if (formRef.current && !formRef.current.checkValidity()) {
          formRef.current.reportValidity()
          setStatus('error')
          return
        }
        formRef.current?.requestSubmit()
        break
      }
      case 'setReset': {
        formRef.current?.reset()
        break
      }
    }
    //KNOWN ISSUE: Need to update to next 16+ to properly remove setStatus as a dep with useEffectEvent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formName, formStatus])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formRef?.current) {
      setStatus('error')
      console.error('useForm handleSubmit: formRef is null')
      return
    }

    const formData = new FormData(formRef.current)

    setStatus('pending')

    const submissionID = Date.now().toString()
    setSubmissionId(submissionID)

    const clientData = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
      screenWidth: `${window.screen.width}`,
      screenHeight: `${window.screen.height}`,
      preferences: context.atomicStore.preferences,
    }

    try {
      let toastID
      if (block.formToastEnabled) toastID = toastManager.add({ type: 'loading', description: block.lm || 'Submitting form...' })

      const response = await submitFormSF({ blockID: block.id, formData, submissionID, clientData })

      if (response.success && toastID) toastManager.update(toastID, { type: 'success', description: response.fm })
      else if (toastID) toastManager.update(toastID, { type: 'error', description: response.fm })
      if (toastID) setTimeout(() => toastManager.close(toastID), 5000)

      setFormResponse(response)
      setStatus(response.success ? 'success' : 'error', response)
    } catch (error: unknown) {
      setStatus('error', error as FormResponse)
    }
  }

  const handleReset = () => setStatus('reset')

  return { handleSubmit, handleReset, context, formRef }
}
