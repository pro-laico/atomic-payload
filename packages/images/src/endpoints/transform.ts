/**
 * The on-demand image transform endpoint (Cloudflare-style settings in the URL),
 * plus an authed purge endpoint. Config-level endpoints — registered by the plugin
 * so they mount at `/api/img/...`. Same-origin: the handler STREAMS bytes (it never
 * redirects to the storage host). On a miss it transforms with Sharp, responds
 * immediately, and persists the variant after the response via Next's `after()`.
 *
 * Routing note: a config-level endpoint is only consulted when the first path
 * segment isn't a collection/global slug — so the default `/img` base is safe as
 * long as no collection is named `img`.
 */
import { after } from 'next/server'

import type { CollectionSlug, Endpoint, Payload, PayloadRequest } from 'payload'

import { variantCacheKey } from '../variants/key'
import { getServerSideURL } from '@pro-laico/core'
import { purgeVariantsForSource } from '../hooks/purge'
import { GENERATED_IMAGES_SLUG } from '../collections/generatedImages'
import { transformImage, type TransformOutput } from '../transform/sharp'
import { readBytes, resolveStaticDir, type UploadDocLike } from '../transform/source'
import {
  DEFAULT_CONSTRAINTS,
  extForFormat,
  type Format,
  mimeForFormat,
  negotiateFormat,
  type OutputFormat,
  parseTransformParams,
  type TransformConstraints,
} from '../transform/params'

export interface TransformEndpointConfig extends Partial<TransformConstraints> {
  /** Endpoint base path. Default `/img` (→ `/api/img`). Never name a collection this. */
  path?: string
  /** Source image collection slug. Default `images`. */
  sourceSlug?: string
  /** Generated-images collection slug. Default `generatedImages`. */
  variantSlug?: string
  /** Also emit `CDN-Cache-Control` / `Vercel-CDN-Cache-Control` (edge caching). Default true. */
  cdnCacheControl?: boolean
}

type SourceDoc = UploadDocLike & { id: string | number; focalX?: number | null; focalY?: number | null }

const IMMUTABLE = 'public, max-age=31536000, immutable'
const PRIVATE_IMMUTABLE = 'private, max-age=31536000, immutable'

const toBody = (buf: Buffer): BodyInit => buf as unknown as BodyInit //TODO: replace `as` cast with proper typing

const resolveConstraints = (cfg: TransformEndpointConfig): TransformConstraints => ({
  maxDimension: cfg.maxDimension ?? DEFAULT_CONSTRAINTS.maxDimension,
  qualityRange: cfg.qualityRange ?? DEFAULT_CONSTRAINTS.qualityRange,
  defaultQuality: cfg.defaultQuality ?? DEFAULT_CONSTRAINTS.defaultQuality,
  formats: cfg.formats ?? DEFAULT_CONSTRAINTS.formats,
  defaultFormat: cfg.defaultFormat ?? DEFAULT_CONSTRAINTS.defaultFormat,
})

const buildHeaders = (mime: string, key: string, isAuto: boolean, cdn: boolean, isPublic: boolean): Record<string, string> => {
  const h: Record<string, string> = {
    'Content-Type': mime,
    'Cache-Control': isPublic ? IMMUTABLE : PRIVATE_IMMUTABLE,
    ETag: `"${key}"`,
  }
  if (cdn && isPublic) {
    h['CDN-Cache-Control'] = IMMUTABLE
    h['Vercel-CDN-Cache-Control'] = IMMUTABLE
  }
  if (isAuto) h.Vary = 'Accept'
  return h
}

const routeId = (req: PayloadRequest): string => {
  const raw = req.routeParams?.id
  return raw == null ? '' : String(raw)
}

const isDuplicateKeyError = (err: unknown): boolean => /duplicate|unique/i.test(err instanceof Error ? err.message : String(err))

/** GET `<path>/:id?w&h&ar&fit&q&fmt` — on-demand transform with focal-aware crop. */
export const createTransformEndpoint = (cfg: TransformEndpointConfig = {}): Endpoint => {
  const path = cfg.path || '/img'
  const sourceSlug = (cfg.sourceSlug || 'images') as CollectionSlug //TODO: replace `as` cast with proper typing
  const variantSlug = (cfg.variantSlug || GENERATED_IMAGES_SLUG) as CollectionSlug //TODO: replace `as` cast with proper typing
  const cdn = cfg.cdnCacheControl !== false
  const constraints = resolveConstraints(cfg)

  return {
    path: `${path}/:id`,
    method: 'get',
    handler: async (req: PayloadRequest): Promise<Response> => {
      const { payload } = req

      const base = getServerSideURL() || req.origin

      const id = routeId(req)
      if (!id) return new Response('Missing id', { status: 400 })

      const parsed = parseTransformParams(req.searchParams ?? new URLSearchParams(), constraints)
      if (!parsed.ok) return new Response(parsed.error, { status: 400 })
      const p = parsed.params

      const readSource = async (user: PayloadRequest['user']): Promise<SourceDoc | null> => {
        try {
          //TODO: replace `as` cast with proper typing
          return (await payload.findByID({ collection: sourceSlug, id, depth: 0, overrideAccess: false, user })) as unknown as SourceDoc
        } catch {
          return null
        }
      }
      let source = await readSource(null)
      const isPublic = source != null
      if (!source && req.user) source = await readSource(req.user)
      if (!source || (!source.url && !source.filename)) return new Response('Not found', { status: 404 })

      const isAuto = p.fmt === 'auto'
      //TODO: replace `as` cast with proper typing
      const format: OutputFormat = isAuto ? negotiateFormat(req.headers.get('accept'), constraints.formats) : (p.fmt as Exclude<Format, 'auto'>)
      const key = variantCacheKey({ id: source.id, filename: source.filename, focalX: source.focalX, focalY: source.focalY }, p, format)

      if (req.headers.get('if-none-match') === `"${key}"`) {
        return new Response(null, { status: 304, headers: buildHeaders(mimeForFormat(format), key, isAuto, cdn, isPublic) })
      }

      try {
        const hit = await payload.find({
          collection: variantSlug,
          where: { cacheKey: { equals: key } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        const variant = hit?.docs?.[0] as (UploadDocLike & { id: string | number }) | undefined //TODO: replace `as` cast with proper typing
        if (variant) {
          const bytes = await readBytes(variant, resolveStaticDir(payload, variantSlug), base)
          if (bytes) return new Response(toBody(bytes), { headers: buildHeaders(mimeForFormat(format), key, isAuto, cdn, isPublic) })
        }
      } catch {}

      const original = await readBytes(source, resolveStaticDir(payload, sourceSlug), base)
      if (!original) {
        payload.logger.warn(`[images] source ${id} unreadable (filename=${source.filename ?? 'none'}, url=${source.url ?? 'none'})`)
        return new Response('Source unavailable', { status: 502 })
      }

      let out: TransformOutput
      try {
        out = await transformImage(original, { w: p.w, h: p.h, fit: p.fit, quality: p.q, format, focalX: source.focalX, focalY: source.focalY })
      } catch (err) {
        payload.logger.error(`[images] transform failed for ${id}: ${String(err)}`)
        return new Response('Transform failed', { status: 500 })
      }

      const persist = async (): Promise<void> => {
        try {
          await payload.create({
            collection: variantSlug,
            file: { data: out.data, mimetype: out.mimeType, name: `${key}.${extForFormat(format)}`, size: out.data.byteLength },
            data: {
              source: source.id as never, //TODO: replace `as` cast with proper typing
              cacheKey: key,
              fit: p.fit,
              format,
              quality: p.q,
              focalX: source.focalX ?? null,
              focalY: source.focalY ?? null,
            },
            overwriteExistingFiles: true,
            overrideAccess: true,
          })
        } catch (err) {
          if (!isDuplicateKeyError(err)) payload.logger.warn(`[images] failed to persist variant ${key} for source ${id}: ${String(err)}`)
        }
      }
      try {
        after(persist)
      } catch {
        void persist()
      }

      return new Response(toBody(out.data), { headers: buildHeaders(out.mimeType, key, isAuto, cdn, isPublic) })
    },
  }
}

export interface PurgeEndpointConfig {
  /** Base path for the purge route. Default `/img/purge` (→ `/api/img/purge/:id`). */
  path?: string
  /** Generated-images collection slug. Default `generatedImages`. */
  variantSlug?: string
  /** Source image collection slug (purge is authorized against read access to it). Default `images`. */
  sourceSlug?: string
}

/**
 * POST `<path>/:id` — delete all generated variants of a source image. Requires a
 * logged-in user who can READ that source (so a user can't purge—and force costly
 * regeneration of—variants for images they can't even see).
 */
export const createPurgeEndpoint = (cfg: PurgeEndpointConfig = {}): Endpoint => {
  const path = cfg.path || '/img/purge'
  const variantSlug = cfg.variantSlug || GENERATED_IMAGES_SLUG
  const sourceSlug = (cfg.sourceSlug || 'images') as CollectionSlug //TODO: replace `as` cast with proper typing

  return {
    path: `${path}/:id`,
    method: 'post',
    handler: async (req: PayloadRequest): Promise<Response> => {
      if (!req.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
      const id = routeId(req)
      if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

      try {
        await req.payload.findByID({ collection: sourceSlug, id, depth: 0, overrideAccess: false, user: req.user })
      } catch {
        return Response.json({ error: 'Not found' }, { status: 404 })
      }

      try {
        const deleted = await purgeVariantsForSource(req.payload as Payload, variantSlug, id, req) //TODO: replace `as` cast with proper typing
        return Response.json({ deleted })
      } catch (err) {
        req.payload.logger.error(`[images] purge failed for ${id}: ${String(err)}`)
        return Response.json({ error: 'Purge failed' }, { status: 500 })
      }
    },
  }
}
