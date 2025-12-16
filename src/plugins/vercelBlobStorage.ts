import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export const vercelBlobStoragePluginConfig = vercelBlobStorage({
  enabled: true,
  clientUploads: true,
  token: process.env.BLOB_READ_WRITE_TOKEN,
  collections: { images: true, font: true, icon: true, favicons: true },
})
