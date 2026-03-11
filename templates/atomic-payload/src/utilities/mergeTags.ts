/** Merge Tags */
export function mt(stringArray: (string | undefined)[]): string {
  let returnString = ''
  if (stringArray.length === 0) return returnString
  else returnString = stringArray.filter((part) => part).join(':')
  return returnString
}
