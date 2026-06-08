import type { APFunction } from '@pro-laico/core'
import type { CollectionConfig, Field, PayloadRequest } from 'payload'
import {
  ActiveField,
  APFControlsPath,
  APField,
  generateAPFFields,
  generateLivePreviewPath,
  mergeHooks,
  revalidateCacheCollectionAfterChange,
  revalidateCacheOnDelete,
} from '@pro-laico/core'

import { authd } from '../access/authenticated'

const APFunctions: APFunction[] = ['active']

const d = {
  icon: 'Select an icon',
  name: 'The name of the icon',
}

/** Inline `UniqueTitleField` so the collection has no template dependency. */
const titleField = (defaultValue = 'New Icon Set'): Field => ({
  name: 'title',
  type: 'text',
  required: true,
  unique: true,
  defaultValue,
})

type Hooks = NonNullable<CollectionConfig['hooks']>

/**
 * Options for {@link createIconSetCollection} — the `IconSet` collection that
 * groups Icons under a named bucket with versions, drafts, APF `active`
 * support, and optional live preview wiring.
 *
 * Built-in revalidation hooks come from `@pro-laico/core`
 * (`revalidateCacheCollectionAfterChange` on `afterChange`, `revalidateCacheOnDelete`
 * on `afterDelete`); the icons package has no runtime dependency on
 * `@pro-laico/atomic`. If you need the atomicHook snapshot behavior, attach
 * it yourself via {@link hooks}.
 *
 * Field-injection options land at different locations in the admin UI; pick
 * the one that matches the field's natural shape:
 *
 * - {@link extraSettingsFields} — compact, packed into the title/active row.
 * - {@link fields} — full-width, below the title/active row in Settings.
 * - {@link iconRowFields} — per-icon, inside each `iconsArray` entry.
 *
 * @example
 * ```ts
 * createIconSetCollection({
 *   livePreviewUrl,
 *   fields: [{ name: 'description', type: 'textarea' }],
 *   iconRowFields: [{ name: 'aliases', type: 'text', hasMany: true }],
 * })
 * ```
 */
export interface IconSetCollectionOptions {
  /**
   * Live preview URL generator. Wires both `admin.preview` (legacy iframe
   * preview) and `admin.livePreview.url` (Payload 3 live preview). Optional:
   * defaults to `@pro-laico/core`'s `generateLivePreviewPath` (built from
   * `PREVIEW_SECRET` + `NEXT_PUBLIC_SERVER_URL`). Pass your own to override.
   *
   * @example
   * ```ts
   * livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req })
   * ```
   */
  livePreviewUrl?: (args: { data: Record<string, unknown>; req: PayloadRequest }) => string | Promise<string>
  /**
   * Extra fields packed INTO the Settings tab row alongside `title` and
   * `active`. Compact horizontal layout — appropriate for narrow,
   * width-constrained fields (booleans, short selects, slug-style text).
   *
   * For full-width set-level metadata (textareas, relationships, arrays),
   * prefer {@link fields}.
   *
   * @example
   * ```ts
   * extraSettingsFields: [TestPathField]
   * ```
   */
  extraSettingsFields?: Field[]
  /**
   * Override the `admin.useAsTitle` setting.
   *
   * @default 'title'
   */
  useAsTitle?: string
  /**
   * Override the `admin.group` label shown in the Payload sidebar.
   *
   * @default 'Sets'
   */
  group?: string
  /**
   * Additional Payload hooks merged ADDITIVELY into the built-ins — user
   * hooks run AFTER the defaults within their phase:
   *
   * - `afterChange`: `[revalidateCacheCollectionAfterChange, ...yours]`
   * - `afterDelete`: `[revalidateCacheOnDelete, ...yours]`
   * - Any other phase (`afterChange`, `beforeRead`, `afterRead`, …): just
   *   your hooks, no built-ins.
   *
   * This is also the opt-in point for `@pro-laico/atomic`'s `atomicHook` —
   * attach it via `hooks.beforeChange` if you want this collection in the
   * atomic-data snapshot.
   *
   * @example
   * ```ts
   * import { atomicHook } from '@pro-laico/atomic/hook'
   * createIconSetCollection({ hooks: { beforeChange: [atomicHook] } })
   * ```
   */
  hooks?: CollectionConfig['hooks']
  /**
   * Extra set-level fields appended to the Settings tab, BELOW the
   * title/active row. Each field renders full-width — use for descriptions,
   * relationships, arrays, and anything that needs more horizontal space than
   * the title/active row offers.
   *
   * For compact in-row injection alongside title/active, use
   * {@link extraSettingsFields}.
   *
   * @example
   * ```ts
   * fields: [
   *   { name: 'description', type: 'textarea' },
   *   { name: 'maintainer', type: 'relationship', relationTo: 'users' },
   * ]
   * ```
   */
  fields?: Field[]
  /**
   * Extra fields appended to the per-icon `row` inside `iconsArray`, after
   * the existing `name` + `icon` fields. Use for per-icon metadata that
   * should travel with each icon entry (aliases, category, description).
   *
   * @example
   * ```ts
   * iconRowFields: [
   *   { name: 'aliases', type: 'text', hasMany: true, admin: { width: '50%' } },
   *   { name: 'category', type: 'select', options: ['ui', 'brand'] },
   * ]
   * ```
   */
  iconRowFields?: Field[]
}

/**
 * Builds the `IconSet` collection — a versioned, draft-enabled grouping of
 * `Icon` documents with APF `active` toggle and optional live preview.
 *
 * Revalidation is wired via `@pro-laico/core` hooks
 * (`revalidateCacheCollectionAfterChange` on `afterChange`, `revalidateCacheOnDelete`
 * on `afterDelete`); no dependency on `@pro-laico/atomic`. To opt into
 * atomicHook snapshot behavior, attach it via {@link IconSetCollectionOptions.hooks}.
 *
 * Use this factory directly when you need to wire `livePreviewUrl` for a
 * specific project; for the no-arg default, import {@link IconSet} instead.
 *
 * @example
 * ```ts
 * createIconSetCollection({
 *   livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
 *   fields: [{ name: 'description', type: 'textarea' }],
 * })
 * ```
 */
export const createIconSetCollection = (opts: IconSetCollectionOptions = {}): CollectionConfig => {
  const {
    livePreviewUrl = ({ data, req }) => generateLivePreviewPath({ data, req }),
    extraSettingsFields = [],
    useAsTitle = 'title',
    group = 'Sets',
    hooks: extraHooks,
    fields: extraFields = [],
    iconRowFields = [],
  } = opts

  return {
    slug: 'iconSet',
    access: { create: authd, delete: authd, read: authd, update: authd },
    admin: {
      group,
      useAsTitle,
      enableListViewSelectAPI: true,
      defaultColumns: ['title', 'active', '_status'],
      ...(livePreviewUrl && {
        preview: (data, { req }) => livePreviewUrl({ data: data as Record<string, unknown>, req }),
        livePreview: { url: ({ data, req }) => livePreviewUrl({ data: data as Record<string, unknown>, req }) },
      }),
      components: { edit: { beforeDocumentControls: [{ path: APFControlsPath, clientProps: { APFunctions } }] } },
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          {
            label: 'Settings',
            fields: [{ type: 'row', fields: [ActiveField(), titleField('New Icon Set'), ...extraSettingsFields] }, ...extraFields],
          },
          {
            label: 'Icons',
            fields: [
              {
                name: 'iconsArray',
                type: 'array',
                admin: { initCollapsed: true, components: { RowLabel: '@pro-laico/icons/admin/iconRowLabel' } },
                fields: [
                  {
                    type: 'row',
                    fields: [
                      APField({
                        name: 'name',
                        type: 'text',
                        kebab: true,
                        required: true,
                        admin: { width: '25%', description: d.name, style: { maxWidth: '350px' } },
                      }),
                      {
                        name: 'icon',
                        type: 'upload',
                        relationTo: 'icon',
                        displayPreview: false,
                        admin: { allowCreate: false, width: '75%', description: d.icon, style: { maxWidth: '350px' } },
                      },
                      ...iconRowFields,
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      ...generateAPFFields(APFunctions),
    ],
    hooks: mergeHooks<Hooks>(
      {
        // afterChange (post-commit), not beforeChange — busting the cache before
        // the write lands lets a concurrent read re-cache stale data. Matches the
        // `icon` collection.
        afterChange: [revalidateCacheCollectionAfterChange],
        afterDelete: [revalidateCacheOnDelete],
      },
      extraHooks,
    ),
    // maxPerDoc: 50 — with schedulePublish + validate, every draft save makes a
    // version, so a busy icon set silently drops history past 50. Raise/lower to
    // trade audit depth against storage.
    versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
  }
}

/**
 * Default `IconSet` collection. Equivalent to `createIconSetCollection()`, so
 * live preview defaults to `@pro-laico/core`'s `generateLivePreviewPath` and the
 * built-in revalidation hooks from `@pro-laico/core` are always attached.
 *
 * To override the live preview URL, add hooks, or add extra fields, use
 * {@link createIconSetCollection}; for plugin-level wiring, use `iconsPlugin`
 * with `iconSetOptions`.
 */
export const IconSet: CollectionConfig = createIconSetCollection()
