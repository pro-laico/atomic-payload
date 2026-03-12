import { anyone } from '@/access/anyone'
import { authd } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const MuxVideo: CollectionConfig = {
  slug: 'mux-video', //Do not change. This slug means this extends the Mux Video plugin.
  admin: { group: 'Assets', enableListViewSelectAPI: true },
  access: { create: authd, delete: authd, read: anyone, update: authd },
  fields: [
    //Add fields here to be appended to the mux video plugins default fields.
    //Existing fields: https://github.com/oversightstudio/payload-plugins/blob/main/packages/mux-video/src/collections/MuxVideo.ts
  ],
}
