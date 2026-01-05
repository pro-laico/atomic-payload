import type { Block } from 'payload'
import { APField } from '@/fields/apf'
import { ValidationMessageField } from '@/fields/validationMessage'

const d = {
  atStart:
    'If true, the rate limit trigger runs before validation. For normal forms its recommended to set this to false, as failed submissions due to validation errors will count towards the rate limit.',
  rateLimit: 'The number of requests allowed per time period.',
  rateLimitPeriod: 'The time period in minutes.',
}

export const FrlSimpleSlidingWindow: Block = {
  slug: 'FrlSimpleSlidingWindow',
  admin: { disableBlockName: true },
  interfaceName: 'FrlSimpleSlidingWindow',
  labels: { singular: 'Simple Sliding Window Rate Limit', plural: 'Simple Sliding Window Rate Limit' },
  fields: [
    APField({ type: 'checkbox', apf: ['form'], name: 'atStart', label: 'At Start', required: true, admin: { description: d.atStart } }),
    APField({ type: 'number', apf: ['form'], name: 'rateLimit', required: true, admin: { description: d.rateLimit } }),
    APField({ type: 'number', apf: ['form'], name: 'rateLimitPeriod', required: true, admin: { description: d.rateLimitPeriod } }),
    ValidationMessageField,
  ],
}
