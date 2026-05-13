import { onUploadSetAPF } from '@pro-laico/atomic-payload-apf';
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
    return deepMerge(faviconField, rest);
};
//# sourceMappingURL=favicon.js.map