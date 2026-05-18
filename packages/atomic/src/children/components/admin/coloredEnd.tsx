'use client'
import './coloredEnd.scss'
import { useFormFields } from '@payloadcms/ui'
import type { AtomicChildVariants } from '@pro-laico/atomic/actions/schema'
import type { UIFieldClientComponent } from 'payload'
export const ColoredEnd: UIFieldClientComponent = ({ path }) => {
  const parentBlockPath = path.split('.').slice(0, -1).join('.')
  const type = useFormFields(([fields]) => fields[`${parentBlockPath}.type`]?.value as AtomicChildVariants | undefined)

  const styleClasses = ['colored-end', type && `colored-end--${type}`].filter(Boolean).join(' ')

  return <div className={styleClasses} />
}

export default ColoredEnd
