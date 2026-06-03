'use client'
import type { UIFieldClientComponent } from 'payload'
import type { AtomicChildVariants } from '@pro-laico/atomic/actions/schema'
import { useFormFields } from '@payloadcms/ui'

import './coloredEnd.scss'
export const ColoredEnd: UIFieldClientComponent = ({ path }) => {
  const parentBlockPath = path.split('.').slice(0, -1).join('.')
  const type = useFormFields(([fields]) => fields[`${parentBlockPath}.type`]?.value as AtomicChildVariants | undefined)

  const styleClasses = ['colored-end', type && `colored-end--${type}`].filter(Boolean).join(' ')

  return <div className={styleClasses} />
}

export default ColoredEnd
