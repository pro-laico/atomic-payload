'use server'
import type { FormFunction } from '@pro-laico/atomic/forms'
import type { FsCombineTwoFields as FsCombineTwoFieldsType } from '@pro-laico/atomic/forms/schema'
export const FsCombineTwoFields: FormFunction<{ block: FsCombineTwoFieldsType }> = async (args) => {
  const { formData, block } = args
  const { firstFieldName, secondFieldName, outputFieldName } = block

  if (!formData.get(firstFieldName) || !formData.get(secondFieldName)) {
    args.response.success = false
    args.response.fm = `Combine Two Fields Block Needs: ${firstFieldName} and ${secondFieldName}`
    return args
  }

  const firstFieldValue = formData.get(firstFieldName)
  const addBetween = block.addBetween || ' '
  const secondFieldValue = formData.get(secondFieldName)

  formData.set(outputFieldName, `${firstFieldValue}${addBetween}${secondFieldValue}`)

  return args
}
