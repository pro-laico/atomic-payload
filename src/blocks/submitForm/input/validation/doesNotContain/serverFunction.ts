'use server'
import { FormFunction } from '@/ts/types'
import { IvDoesNotContain as IvDoesNotContainType } from '@/ts/types'

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
