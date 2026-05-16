import type { CollectionConfig, Access } from 'payload'

const authd: Access = ({ req }) => Boolean(req.user)
const anyone: Access = () => true

export const MuxVideo: CollectionConfig = {
  slug: 'mux-video',
  admin: { group: 'Assets', enableListViewSelectAPI: true },
  access: { create: authd, delete: authd, read: anyone, update: authd },
  fields: [],
}
