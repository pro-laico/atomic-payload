import type { CollectionConfig, GlobalConfig } from 'payload'

import { mergeHooks } from './mergeHooks'

/**
 * Deep-merge a partial override onto a base `CollectionConfig` without
 * clobbering the nested config a top-level spread would otherwise replace.
 *
 * Top-level keys replace, but:
 * - `access` / `admin` are shallow-merged (override keys win, base keys kept).
 * - `fields` are APPENDED (base fields first, then override fields).
 * - `upload` is shallow-merged when both sides are objects (so a partial
 *   `upload: { staticDir }` keeps the base `mimeTypes` whitelist).
 * - `hooks` are merged per-phase via {@link mergeHooks} (override hooks run
 *   AFTER the base hooks within each phase).
 *
 * When `override` is undefined, `base` is returned unchanged.
 */
export const mergeCollection = (base: CollectionConfig, override?: Partial<CollectionConfig>): CollectionConfig =>
  override
    ? {
        ...base,
        ...override,
        access: { ...base.access, ...override.access },
        admin: { ...base.admin, ...override.admin },
        fields: [...base.fields, ...(override.fields ?? [])],
        upload:
          override.upload && typeof override.upload === 'object' && typeof base.upload === 'object'
            ? { ...base.upload, ...override.upload }
            : (override.upload ?? base.upload),
        hooks: override.hooks ? mergeHooks(base.hooks ?? {}, override.hooks) : base.hooks,
      }
    : base

/**
 * Deep-merge a partial override onto a base `GlobalConfig`, mirroring
 * {@link mergeCollection} (globals have no `upload`).
 *
 * Top-level keys replace, but `access` / `admin` are shallow-merged, `fields`
 * are APPENDED, and `hooks` are merged per-phase via {@link mergeHooks}. When
 * `override` is undefined, `base` is returned unchanged.
 */
export const mergeGlobal = (base: GlobalConfig, override?: Partial<GlobalConfig>): GlobalConfig =>
  override
    ? {
        ...base,
        ...override,
        access: { ...base.access, ...override.access },
        admin: { ...base.admin, ...override.admin },
        fields: [...base.fields, ...(override.fields ?? [])],
        hooks: override.hooks ? mergeHooks(base.hooks ?? {}, override.hooks) : base.hooks,
      }
    : base
