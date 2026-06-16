import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

const token = process.env.BLOB_READ_WRITE_TOKEN
const isProduction = process.env.NODE_ENV === 'production'

// Storage strategy chosen so uploads are always SERVER-READABLE — the on-demand
// image transform endpoint (and Payload's own processing) read the source bytes
// back on the server, so the file must actually be retrievable after upload.
//
// - No Blob token (typical local dev): register nothing → Payload uses local disk
//   storage, which serves files itself on localhost. Everything works offline.
// - Blob token in DEV: use Blob but with SERVER-side uploads (no `clientUploads`).
//   Client/direct uploads need Vercel to call back to finalize, and that callback
//   can't reach a localhost machine (`onUploadCompleted … no callbackUrl`) — which
//   leaves the file unservable. Server uploads (browser → your server → Blob) avoid
//   the callback entirely and set an absolute, fetchable URL.
// - PRODUCTION: client-side direct uploads keep large files off the serverless
//   request body. There the finalize callback resolves against the real domain, so
//   the stored URL is absolute + public and the transform endpoint can fetch it.
//
// `generatedImages` (the variant cache) is always written SERVER-side by the
// transform endpoint, so it stays in its own server-upload instance.
export const vercelBlobStoragePluginConfigs = token
  ? [
      vercelBlobStorage({
        enabled: true,
        clientUploads: isProduction,
        token,
        collections: { images: true, font: true, icon: true, favicons: true },
      }),
      vercelBlobStorage({
        enabled: true,
        token,
        collections: { generatedImages: true },
      }),
    ]
  : []
