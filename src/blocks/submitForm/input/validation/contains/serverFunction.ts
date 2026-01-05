'use server'
import { FormFunction } from '@/ts/types'
import { IvContains as IvContainsType } from '@/ts/types'

export const IvContains: FormFunction<{ block: IvContainsType & { inputName: string } }> = async (args) => {
  const { formData, response, block } = args
  const { containsValue, validationMessage, inputName } = block

  const inputValue = formData.get(inputName)
  if (typeof inputValue !== 'string') {
    response.success = false
    response.fm = `Input Value is not a string: ${inputName}`
    return args
  }

  if (!inputValue.includes(containsValue)) {
    response.success = false
    response.im[inputName] = validationMessage
    return args
  }

  return args
}
