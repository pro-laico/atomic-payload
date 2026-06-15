import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const token = process.env.BLOB_READ_WRITE_TOKEN

// Two adapter instances on purpose. `@payloadcms/plugin-cloud-storage` supports
// registering the storage plugin more than once for disjoint collections (it
// suffixes the client-upload route per instance), which lets us split upload
// strategy by collection:
//
// 1. Visual/large assets use fast CLIENT-side direct uploads (browser → Blob),
//    keeping big files off the serverless request body.
// 2. Font weight files (`fontFile`) + their archived originals use SERVER-side
//    uploads, because `@pro-laico/fonts`' optimize-on-upload hook subsets the file
//    server-side — client-side direct uploads bypass the server, so the hook would
//    never see the bytes. (`font` itself is a non-upload typeface — not stored.)
//
// `clientUploads.access` is only an auth gate on the token route (a `false`
// return throws and breaks the upload), NOT a per-collection on/off switch — so
// the split has to be done with separate instances, not one instance.
const clientUploadCollections = vercelBlobStorage({
  enabled: true,
  clientUploads: true,
  token,
  collections: { images: true, icon: true, favicons: true },
})

const serverUploadCollections = vercelBlobStorage({
  enabled: true,
  token,
  collections: { fontFile: true, fontOriginal: true },
})

export const vercelBlobStoragePluginConfigs = [clientUploadCollections, serverUploadCollections]
