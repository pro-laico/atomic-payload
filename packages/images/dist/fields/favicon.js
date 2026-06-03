import { onUploadSetAPF } from '@pro-laico/core';
const description = 'Sets the favicon for the site.';
function isObject(item) {
    return typeof item === 'object' && item !== null && !Array.isArray(item);
}
function deepMerge(target, source) {
    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            const sv = source[key];
            if (isObject(sv)) {
                if (!(key in target))
                    Object.assign(output, { [key]: sv });
                else
                    output[key] = deepMerge(target[key], sv);
            }
            else
                Object.assign(output, { [key]: sv });
        });
    }
    return output;
}
export const FaviconField = (args) => {
    const { apf, ...rest } = args || {};
    const faviconField = { name: 'favicon', type: 'upload', relationTo: 'favicons', admin: { description } };
    if (apf)
        faviconField.hooks = { beforeValidate: [onUploadSetAPF(apf)] };
    // Callers legitimately override `name`/`admin`/`hooks` (e.g. to mount several
    // favicon pickers), but the field's identity — `type: 'upload'` targeting the
    // `favicons` collection — is re-asserted after the merge so a stray override
    // can't silently re-target the picker at another collection.
    const merged = deepMerge(faviconField, rest);
    return { ...merged, type: 'upload', relationTo: 'favicons' };
};
//# sourceMappingURL=favicon.js.map