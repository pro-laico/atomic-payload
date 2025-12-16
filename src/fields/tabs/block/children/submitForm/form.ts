import { GroupField } from 'payload'
import { formFunctionsBlockTemplate } from '@/fields/blocks/submitForm/form'

export const formRateLimitTab: GroupField = {
  type: 'group',
  label: false,
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'form') },
  fields: [formFunctionsBlockTemplate('RateLimit')],
}

export const formSanitationTab: GroupField = {
  type: 'group',
  label: false,
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'form') },
  fields: [formFunctionsBlockTemplate('Sanitation')],
}

export const formValidationTab: GroupField = {
  type: 'group',
  label: false,
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'form') },
  fields: [formFunctionsBlockTemplate('Validation')],
}
