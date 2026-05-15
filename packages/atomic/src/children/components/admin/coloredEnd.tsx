'use client'
import './coloredEnd.scss'
import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import type { AtomicChildVariants } from '@pro-laico/atomic/actions/schema'
export const ColoredEnd: UIFieldClientComponent = ({ path }) => {
  const parentBlockPath = path.split('.').slice(0, -1).join('.')
  const type = useFormFields(([fields]) => fields[`${parentBlockPath}.type`]?.value as AtomicChildVariants | undefined)

  const styleClasses = ['colored-end', type && `colored-end--${type}`].filter(Boolean).join(' ')

  return <div className={styleClasses} />
}

export default ColoredEnd
