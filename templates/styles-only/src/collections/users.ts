import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { group: 'Admin', useAsTitle: 'email' },
  auth: true,
  fields: [],
}
