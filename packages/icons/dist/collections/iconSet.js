import { authd } from '../access/authenticated';
import { APField, ActiveField, generateAPFFields, APFControlsPath, mergeHooks } from '@pro-laico/core';
import { revalidateCacheOnDelete } from '@pro-laico/core';
const APFunctions = ['active'];
const d = {
    icon: 'Select an icon',
    name: 'The name of the icon',
};
/** Inline `UniqueTitleField` so the collection has no template dependency. */
const titleField = (defaultValue = 'New Icon Set') => ({
    name: 'title',
    type: 'text',
    required: true,
    unique: true,
    defaultValue,
});
/**
 * Builds the `IconSet` collection — a versioned, draft-enabled grouping of
 * `Icon` documents with APF `active` toggle, optional live preview, and
 * optional atomicHook wiring.
 *
 * Use this factory directly when you need to wire `atomicHook` /
 * `livePreviewUrl` for a specific project; for a no-arg default that omits
 * both, import the exported {@link IconSet} const instead.
 *
 * @example
 * ```ts
 * createIconSetCollection({
 *   atomicHook,
 *   livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
 *   fields: [{ name: 'description', type: 'textarea' }],
 * })
 * ```
 */
export const createIconSetCollection = (opts = {}) => {
    const { atomicHook, livePreviewUrl, extraSettingsFields = [], useAsTitle = 'title', group = 'Sets', hooks: extraHooks, fields: extraFields = [], iconRowFields = [], } = opts;
    return {
        slug: 'iconSet',
        access: { create: authd, delete: authd, read: authd, update: authd },
        admin: {
            group,
            useAsTitle,
            enableListViewSelectAPI: true,
            defaultColumns: ['title', 'active', '_status'],
            ...(livePreviewUrl && {
                preview: (data, { req }) => livePreviewUrl({ data: data, req }),
                livePreview: { url: ({ data, req }) => livePreviewUrl({ data: data, req }) },
            }),
            components: { edit: { beforeDocumentControls: [{ path: APFControlsPath, clientProps: { APFunctions } }] } },
        },
        fields: [
            {
                type: 'tabs',
                tabs: [
                    {
                        label: 'Settings',
                        fields: [
                            { type: 'row', fields: [ActiveField(), titleField('New Icon Set'), ...extraSettingsFields] },
                            ...extraFields,
                        ],
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
        hooks: mergeHooks({
            beforeChange: atomicHook ? [atomicHook] : [],
            afterDelete: [revalidateCacheOnDelete],
        }, extraHooks),
        versions: { drafts: { schedulePublish: true, validate: true }, maxPerDoc: 50 },
    };
};
/**
 * Default `IconSet` collection with no atomicHook and no live preview wired.
 * Equivalent to `createIconSetCollection()`. Import this when you don't need
 * project-specific wiring.
 *
 * For atomicHook / live preview / additive extensions, use
 * {@link createIconSetCollection}; for plugin-level wiring, use `iconsPlugin`
 * with `iconSetOptions`.
 */
export const IconSet = createIconSetCollection();
//# sourceMappingURL=iconSet.js.map