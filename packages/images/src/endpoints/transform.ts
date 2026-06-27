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
import { setTransformConcurrency } from '../transform/limit'
import { createSingleFlight } from '../transform/coalesce'
import { setSharpConcurrency } from '../transform/sharpInstance'
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
  /** Max concurrent Sharp transforms in this process (default `cpus - 1`, or `IMAGES_TRANSFORM_CONCURRENCY`). */
  maxConcurrency?: number
  /** Per-image libvips thread cap (default 1 for serverless safety; `0` = CPU cores, or `IMAGES_SHARP_CONCURRENCY`). */
  sharpConcurrency?: number
}

type SourceDoc = UploadDocLike & { id: string | number; focalX?: number | null; focalY?: number | null }

type GenResult = { ok: true; out: TransformOutput } | { ok: false; status: number; msg: string }

const IMMUTABLE = 'public, max-age=31536000, immutable'
const PRIVATE_IMMUTABLE = 'private, max-age=31536000, immutable'

const toBody = (buf: Buffer): BodyInit => buf as unknown as BodyInit //TODO: replace `as` cast with proper typing

const resolveConstraints = (cfg: TransformEndpointConfig): TransformConstraints => ({
  maxDimension: cfg.maxDimension ?? DEFAULT_CONSTRAINTS.maxDimension,
  qualityRange: cfg.qualityRange ?? DEFAULT_CONSTRAINTS.qualityRange,
  defaultQuality: cfg.defaultQuality ?? DEFAULT_CONSTRAINTS.defaultQuality,
  formats: cfg.formats ?? DEFAULT_CONSTRAINTS.formats,
  defaultFormat: cfg.defaultFormat ?? DEFAULT_CONSTRAINTS.defaultFormat,
  preferAvif: cfg.preferAvif ?? DEFAULT_CONSTRAINTS.preferAvif,
  dimensionStep: cfg.dimensionStep ?? DEFAULT_CONSTRAINTS.dimensionStep,
  maxInputPixels: cfg.maxInputPixels ?? DEFAULT_CONSTRAINTS.maxInputPixels,
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
  setTransformConcurrency(cfg.maxConcurrency)
  setSharpConcurrency(cfg.sharpConcurrency)

  // Per-endpoint single-flight maps: dedupe the source read across one <img>'s srcset
  // widths, and coalesce variant generation under a thundering herd. See ./coalesce.
  const sourceFlight = createSingleFlight<string, SourceDoc | null>()
  const genFlight = createSingleFlight<string, GenResult>()

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
      // The anonymous read is shareable across the concurrent srcset requests for this
      // id, so coalesce it; the per-user fallback (private sources) stays uncoalesced.
      let source = await sourceFlight(id, () => readSource(null))
      const isPublic = source != null
      if (!source && req.user) source = await readSource(req.user)
      if (!source || (!source.url && !source.filename)) return new Response('Not found', { status: 404 })
      const src = source

      const isAuto = p.fmt === 'auto'
      //TODO: replace `as` cast with proper typing
      const format: OutputFormat = isAuto
        ? negotiateFormat(req.headers.get('accept'), constraints.formats, constraints.preferAvif)
        : (p.fmt as Exclude<Format, 'auto'>)
      const key = variantCacheKey({ id: src.id, filename: src.filename, focalX: src.focalX, focalY: src.focalY }, p, format)

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

      // Coalesce generation by cache key: a thundering herd of identical requests reads
      // the original + encodes once. The runner schedules the single persist; awaiters
      // just receive the bytes. Returns a union so the shared promise carries error status.
      const result = await genFlight(key, async (): Promise<GenResult> => {
        const original = await readBytes(src, resolveStaticDir(payload, sourceSlug), base)
        if (!original) {
          payload.logger.warn(`[images] source ${id} unreadable (filename=${src.filename ?? 'none'}, url=${src.url ?? 'none'})`)
          return { ok: false, status: 502, msg: 'Source unavailable' }
        }

        let out: TransformOutput
        try {
          out = await transformImage(original, {
            w: p.w,
            h: p.h,
            fit: p.fit,
            quality: p.q,
            format,
            focalX: src.focalX,
            focalY: src.focalY,
            maxInputPixels: constraints.maxInputPixels,
          })
        } catch (err) {
          payload.logger.error(`[images] transform failed for ${id}: ${String(err)}`)
          return { ok: false, status: 500, msg: 'Transform failed' }
        }

        const persist = async (): Promise<void> => {
          try {
            await payload.create({
              collection: variantSlug,
              file: { data: out.data, mimetype: out.mimeType, name: `${key}.${extForFormat(format)}`, size: out.data.byteLength },
              data: {
                source: src.id as never, //TODO: replace `as` cast with proper typing
                cacheKey: key,
                fit: p.fit,
                format,
                quality: p.q,
                focalX: src.focalX ?? null,
                focalY: src.focalY ?? null,
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

        return { ok: true, out }
      })

      if (!result.ok) return new Response(result.msg, { status: result.status })
      return new Response(toBody(result.out.data), { headers: buildHeaders(result.out.mimeType, key, isAuto, cdn, isPublic) })
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
