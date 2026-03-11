'use server'
import { FormFunction } from '@/ts/types'
import { IsTrimText as IsTrimTextType } from '@/ts/types'

export const IsTrimText: FormFunction<{ block: IsTrimTextType & { inputName: string } }> = async (args) => {
  const { formData, response, block } = args
  const { trimCharacters, trimType, inputName } = block

  //Get the input value
  const inputValue = formData.get(inputName)
  if (typeof inputValue !== 'string') {
    response.success = false
    response.fm = `Input Value is not a string: ${inputName}`
    return args
  }

  //Get the characters we can trim
  const trimCharactersArray = trimCharacters
    ?.split(',')
    .map((char: string) => char.trim())
    .filter((char: string) => char.length > 0)
  if (!trimCharactersArray) {
    response.success = false
    response.fm = `Trim Characters is required: ${inputName}`
    return args
  }

  //Trim the input value based on the trim type
  switch (trimType) {
    case 'beginning':
      for (const char of trimCharactersArray) {
        if (char.length === 0) continue
        const escapedChar = escapeRegex(char)
        formData.set(inputName, inputValue.replace(new RegExp(`^${escapedChar}+`, 'g'), ''))
      }
      break
    case 'end':
      for (const char of trimCharactersArray) {
        if (char.length === 0) continue
        const escapedChar = escapeRegex(char)
        formData.set(inputName, inputValue.replace(new RegExp(`${escapedChar}+$`, 'g'), ''))
      }
      break
    case 'both':
      for (const char of trimCharactersArray) {
        if (char.length === 0) continue
        const escapedChar = escapeRegex(char)
        const regexPattern = `^${escapedChar}+|${escapedChar}+$`
        formData.set(inputName, inputValue.replace(new RegExp(regexPattern, 'g'), ''))
      }
      break
    default:
      // If no valid trim type, return original value
      break
  }

  return args
}

// Helper function to escape regex special characters (for the trim characters)
const escapeRegex = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
