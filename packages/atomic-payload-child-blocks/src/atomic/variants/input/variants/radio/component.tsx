'use server'
import { AtomicChild, RenderChild } from 'atomic-payload/child-blocks-types'

export const RadioInput: React.FC<RenderChild<AtomicChild>> = async ({ pt }) => {
  return <input {...pt?.c?.p} {...pt?.c?.da} />
}
