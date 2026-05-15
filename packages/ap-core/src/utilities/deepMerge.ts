// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export function isObject(item: unknown): item is object {
  return typeof item === 'object' && !Array.isArray(item)
}

export default function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...target }
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] })
        else output[key] = deepMerge(target[key], source[key])
      } else Object.assign(output, { [key]: source[key] })
    })
  }

  return output
}
