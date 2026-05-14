import { virtualAPFAfterReadFieldHook, virtualAPFBeforeChangeFieldHook } from '../hooks/field/apf';
/** Atomic Payload Functions Registry */
export const apfRegistry = {
    seo: 'apf-seo',
    form: 'apf-form',
    page: 'apf-page',
    pages: 'apf-pages',
    active: 'apf-active',
    actions: 'apf-actions',
    classes: 'apf-classes',
    sitemap: 'apf-sitemap',
    siteMetadata: 'apf-siteMetadata',
};
/** Template field for APF checkboxes */
const apfFieldTemplate = {
    type: 'checkbox',
    virtual: true,
    admin: { readOnly: true, hidden: true },
    hooks: { beforeValidate: [virtualAPFBeforeChangeFieldHook], afterRead: [virtualAPFAfterReadFieldHook] },
};
/**
 * Generate APF fields for specific APFunctions
 * @param apFunctions - Array of APFunctions to include
 * @returns Array of checkbox fields for the specified APFunctions
 */
export const generateAPFFields = (apFunctions) => {
    return apFunctions.map((apFunction) => ({ ...apfFieldTemplate, name: apfRegistry[apFunction] }));
};
/**Sets all APF fields*/
export const apfStorage = generateAPFFields(Object.keys(apfRegistry));
export default apfStorage;
//# sourceMappingURL=storage.js.map