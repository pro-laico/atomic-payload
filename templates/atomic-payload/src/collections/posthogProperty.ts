import { authd } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

const d = {
  purpose: 'What this should be used for. e.g marketing, user flow, etc.',
  propertyFormal: 'The formal property name. e.g page_name',
  propertyObfuscated: 'The obfuscated property name. e.g page_name_obfuscated',
  valueFormal: 'The formal value. e.g Home',
  valueObfuscated: 'The obfuscated value. e.g Home_obfuscated',
  location: 'Where this should be used. e.g page, component, global',
}

export const PostHogProperty: CollectionConfig = {
  slug: 'posthogProperty',
  admin: { group: 'Tracking', useAsTitle: 'title' },
  access: { create: authd, delete: authd, read: authd, update: authd },
  defaultPopulate: { propertyObfuscated: true, valueObfuscated: true },
  fields: [
    { name: 'title', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'description', type: 'text', admin: { position: 'sidebar' } },
    { name: 'purpose', type: 'text', required: true, admin: { description: d.purpose } },
    {
      type: 'row',
      fields: [
        { name: 'propertyFormal', type: 'text', required: true, admin: { description: d.propertyFormal } },
        { name: 'propertyObfuscated', type: 'text', required: true, admin: { description: d.propertyObfuscated } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'valueFormal', type: 'text', required: true, admin: { description: d.valueFormal } },
        { name: 'valueObfuscated', type: 'text', required: true, admin: { description: d.valueObfuscated } },
      ],
    },
    {
      name: 'location',
      type: 'radio',
      required: true,
      admin: { position: 'sidebar', layout: 'horizontal', description: d.location },
      options: [
        { label: 'Page', value: 'page' },
        { label: 'Component', value: 'component' },
        { label: 'Global', value: 'global' },
      ],
    },
  ],
}
