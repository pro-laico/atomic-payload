'use server'
import { FormFunction } from '@pro-laico/atomic-payload-types'
import type { IvDoesNotContain as IvDoesNotContainType } from '@pro-laico/atomic-payload-types/schema'

export const IvDoesNotContain: FormFunction<{ block: IvDoesNotContainType & { inputName: string } }> = async (args) => {
  const { formData, response, block } = args
  const { doesNotContainValue, validationMessage, inputName } = block

  const inputValue = formData.get(inputName)
  if (typeof inputValue !== 'string') {
    response.success = false
    response.fm = `Input Value is not a string: ${inputName}`
    return args
  }

  if (doesNotContainValue && inputValue.includes(doesNotContainValue)) {
    response.success = false
    response.im[inputName] = validationMessage
    return args
  }

  return args
}
