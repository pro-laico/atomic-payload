'use client'
import { AtomicChild, RenderChild } from '@/ts/types'
import { useForm, useToDa } from '@/hooks/frontEnd/useActions'
import { FormContextProvider } from '@/components/providers/formProvider'

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
