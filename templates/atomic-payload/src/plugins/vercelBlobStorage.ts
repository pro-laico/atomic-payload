import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const token = process.env.BLOB_READ_WRITE_TOKEN
const isProduction = process.env.NODE_ENV === 'production'

// Storage strategy chosen so uploads are SERVER-READABLE whenever something on the
// server needs the bytes back: the on-demand image transform endpoint reads image
// sources, and `@pro-laico/fonts` subsets the raw font originals on the typeface's
// SAVE (not on upload). The file must be retrievable/processable when that happens.
//
// - No Blob token (typical local dev): register nothing → Payload uses local disk
//   storage, which serves files itself on localhost. Everything works offline.
// - Blob token in DEV: client/direct uploads need Vercel to call back to finalize,
//   and that callback can't reach a localhost machine (`onUploadCompleted … no
//   callbackUrl`), leaving the file unservable. So uploads go SERVER-side in dev.
// - PRODUCTION: client-side direct uploads keep large files off the serverless
//   request body; the finalize callback resolves against the real domain, so the
//   stored URL is absolute + public and the server can fetch it back.
//
// Two adapter instances on purpose. `@payloadcms/plugin-cloud-storage` allows
// registering the storage plugin more than once for disjoint collections (it
// suffixes the client-upload route per instance), so we split by strategy:
//
// 1. Client-in-prod, server-in-dev: visual assets (`images` / `icon` / `favicons`)
//    AND the raw font originals (`fontOriginal`). Originals can upload direct-to-Blob
//    now — fonts are no longer optimized on upload, only read back on the typeface
//    save (when the prod URL is finalized + fetchable), so a big TTF stays off the
//    request body.
// 2. Always SERVER-side: derived caches the server itself writes — `generatedImages`
//    (the image-variant cache) and `fontOptimized` (the subsetted WOFF2 the `font`
//    save hook produces). `font` itself is a non-upload typeface, so it isn't stored.
export const vercelBlobStoragePluginConfigs = token
  ? [
      vercelBlobStorage({
        enabled: true,
        clientUploads: isProduction,
        token,
        collections: { images: true, icon: true, favicons: true, fontOriginal: true },
      }),
      vercelBlobStorage({
        enabled: true,
        token,
        collections: { generatedImages: true, fontOptimized: true },
      }),
    ]
  : []
