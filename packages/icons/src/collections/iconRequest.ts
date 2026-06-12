import type { CollectionConfig, Field } from 'payload'

import { authd } from '../access/authenticated'

/** Slug of the runtime icon-request diagnostic collection. */
export const ICON_REQUEST_SLUG = 'iconRequest'

/**
 * Options for {@link createIconRequestCollection}. All additive on top of the
 * built-in `name` / `count` / `firstRequestedAt` / `lastRequestedAt` fields.
 */
export interface IconRequestCollectionOptions {
  /**
   * Override the `admin.group` label in the Payload sidebar.
   *
   * @default 'Sets'
   */
  group?: string
  /** Extra fields appended after the built-ins. */
  fields?: Field[]
  /** Additional Payload hooks merged onto the collection. */
  hooks?: CollectionConfig['hooks']
}

/**
 * Diagnostic collection that records icon names requested at runtime which did
 * NOT resolve to an icon in the active set — the live counterpart to the
 * build-time usage manifest. Populated (throttled, fire-and-forget) by the
 * `<Icon>` server component when `iconsPlugin({ trackRequests: true })` is set,
 * and surfaced in the IconSet "Requested icons" panel.
 *
 * Unlike the static scan, this captures DYNAMIC names (`<Icon name={slug} />`)
 * and genuine production misses — exactly the names a static pass can't see.
 *
 * Rows are written by the recorder via `overrideAccess`; admin access is
 * read/update/delete for authenticated users (it's data you prune, not author).
 */
export const createIconRequestCollection = (opts: IconRequestCollectionOptions = {}): CollectionConfig => {
  const { group = 'Sets', fields: extraFields = [], hooks } = opts

  return {
    slug: ICON_REQUEST_SLUG,
    access: { create: authd, delete: authd, read: authd, update: authd },
    admin: {
      group,
      useAsTitle: 'name',
      defaultColumns: ['name', 'count', 'lastRequestedAt'],
      // Hidden from the sidebar nav — it's a diagnostic feed surfaced through the
      // IconSet "Requested icons" panel (which reads/clears it via the API), not
      // a collection editors browse directly. `hidden` only affects nav/admin
      // visibility; the REST + local API still work, so the panel and recorder
      // are unaffected.
      hidden: true,
      description:
        'Icon names requested at runtime that did not resolve to an icon in the active set. Populated when iconsPlugin({ trackRequests: true }) is set; compare against the IconSet usage panel.',
    },
    fields: [
      { name: 'name', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true } },
      { name: 'count', type: 'number', defaultValue: 1, admin: { readOnly: true } },
      { name: 'firstRequestedAt', type: 'date', admin: { readOnly: true } },
      { name: 'lastRequestedAt', type: 'date', admin: { readOnly: true } },
      ...extraFields,
    ],
    ...(hooks ? { hooks } : {}),
  }
}

/** Default `iconRequest` collection. Equivalent to `createIconRequestCollection()`. */
export const IconRequest: CollectionConfig = createIconRequestCollection()
