import { jsx as _jsx } from "react/jsx-runtime";
import { SelectField } from '@payloadcms/ui';
export function createIconSelect(getCached) {
    return async function IconSelect({ clientField, path, schemaPath, permissions }) {
        const iconSet = (await getCached('iconSet', true));
        const result = (await getCached('icon-options', true, iconSet));
        if (!result) {
            console.warn('Icon options fetch failed');
            return (_jsx(SelectField, { field: { ...clientField, options: [] }, path: path, schemaPath: schemaPath, permissions: permissions }));
        }
        return (_jsx(SelectField, { field: { ...clientField, options: result || [] }, path: path, schemaPath: schemaPath, permissions: permissions }));
    };
}
//# sourceMappingURL=iconSelect.js.map