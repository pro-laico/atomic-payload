'use client'
import { useMemo } from 'react'
import { toKebabCase } from '@/utilities/format/toKebabCase'

export type UseDaToTextProps = {
  text: string
  /** State Data Attributes */
  sda?: Record<string, string>
  /** SSR Data Attributes */
  ssrda?: Record<string, string>
}

export type UseDaToTextReturns = string | undefined

/** Use Data Attributes to Text Parsing Hook */
export function useDaToText(props: UseDaToTextProps): UseDaToTextReturns {
  const { text, sda, ssrda } = props

  // Parses {{key}} patterns in text and replace with data attribute values
  const parsedText = useMemo(() => {
    if (typeof text === 'string') {
      const parsedText = text.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const stateValue = sda?.[`data-${toKebabCase(key)}`] as string
        const ssrValue = ssrda?.[`data-${toKebabCase(key)}`] as string
        const value = stateValue || ssrValue || match
        return value
      })
      return parsedText
    }
    return undefined
  }, [text, sda, ssrda])

  return parsedText
}
