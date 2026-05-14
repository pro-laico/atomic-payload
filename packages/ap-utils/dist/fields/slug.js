import { formatSlugHook } from '../hooks/field/formatSlug';
/** Factory for a paired slug + slugLock field set with the standard
 *  `formatSlugHook` wired up. `slugPath` is the Payload admin component path
 *  (e.g. '@/ui/fields/slug') the host project provides for the custom Slug UI;
 *  consumers can also pass full admin overrides via `slugOverrides`. */
export const slugField = (slugPath, fieldToUse = 'title', overrides = {}) => {
    const { slugOverrides, checkboxOverrides } = overrides;
    const checkBoxField = {
        name: 'slugLock',
        type: 'checkbox',
        defaultValue: true,
        admin: { hidden: true, position: 'sidebar' },
        ...checkboxOverrides,
    };
    // @ts-expect-error - ts mismatch Partial<TextField> with TextField
    const slug = {
        name: 'slug',
        type: 'text',
        index: true,
        label: 'Slug',
        ...(slugOverrides || {}),
        hooks: { beforeValidate: [formatSlugHook(fieldToUse)] },
        admin: {
            ...(slugOverrides?.admin || {}),
            components: { Field: { path: slugPath, clientProps: { fieldToUse, checkboxFieldPath: checkBoxField.name } } },
        },
    };
    return [slug, checkBoxField];
};
//# sourceMappingURL=slug.js.map