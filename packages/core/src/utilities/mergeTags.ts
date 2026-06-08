/** Merge Tags */
export function mt(stringArray: (string | number | undefined)[]): string {
  let returnString = ''
  if (stringArray.length === 0) return returnString
  else returnString = stringArray.filter((part) => part != null && part !== '').join(':')
  return returnString
}
