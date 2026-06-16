import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const token = process.env.BLOB_READ_WRITE_TOKEN
const isProduction = process.env.NODE_ENV === 'production'

// Storage strategy chosen so uploads are SERVER-READABLE whenever something on the
// server needs the bytes back: the on-demand image transform endpoint reads image
// sources, and `@pro-laico/fonts`' optimize-on-upload hook subsets font files, both
// server-side. The file must actually be retrievable/processable after upload.
//
// - No Blob token (typical local dev): register nothing → Payload uses local disk
//   storage, which serves files itself on localhost. Everything works offline.
// - Blob token in DEV: visual assets upload SERVER-side (no `clientUploads`).
//   Client/direct uploads need Vercel to call back to finalize, and that callback
//   can't reach a localhost machine (`onUploadCompleted … no callbackUrl`), which
//   leaves the file unservable. Server uploads (browser → your server → Blob) avoid
//   the callback entirely and set an absolute, fetchable URL.
// - PRODUCTION: visual assets use client-side direct uploads to keep large files off
//   the serverless request body; the finalize callback resolves against the real
//   domain, so the stored URL is absolute + public and the transform endpoint can
//   fetch it.
//
// Two adapter instances on purpose. `@payloadcms/plugin-cloud-storage` allows
// registering the storage plugin more than once for disjoint collections (it
// suffixes the client-upload route per instance), so we split by strategy:
//
// 1. Visual assets (`images` / `icon` / `favicons`): client-in-prod, server-in-dev.
// 2. Always SERVER-side: `generatedImages` (the variant cache, written by the
//    transform endpoint) and the font weight files + archived originals (`fontFile` /
//    `fontOriginal`, which `@pro-laico/fonts` subsets server-side on upload — a
//    client-side direct upload would bypass the hook). `font` itself is a non-upload
//    typeface, so it isn't stored.
export const vercelBlobStoragePluginConfigs = token
  ? [
      vercelBlobStorage({
        enabled: true,
        clientUploads: isProduction,
        token,
        collections: { images: true, icon: true, favicons: true },
      }),
      vercelBlobStorage({
        enabled: true,
        token,
        collections: { generatedImages: true, fontFile: true, fontOriginal: true },
      }),
    ]
  : []
