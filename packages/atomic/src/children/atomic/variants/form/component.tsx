'use client'
import type { RenderChild } from '@pro-laico/atomic/children'
import type { AtomicChild } from '@pro-laico/atomic/children/schema'
import { FormContextProvider } from '../../../components/providers/formProvider'
import { useForm } from '../../../hooks/useActions/useForm'
import { useToDa } from '../../../hooks/useActions/useToDa'

export const AtomicForm: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { pt, contentChildren, block } = props

  const { formRef, handleSubmit, handleReset, context } = useForm({ block })

  const das = useToDa({ attributers: block.contentActions?.attributers, context })

  return (
    <form ref={formRef} onSubmit={handleSubmit} onReset={handleReset} {...pt?.c?.p} {...pt?.c?.da} {...das}>
      <FormContextProvider {...context.fullFormContext}>{contentChildren}</FormContextProvider>
    </form>
  )
}
