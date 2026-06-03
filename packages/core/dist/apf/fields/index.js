import deepMerge from '../../utilities/deepMerge';
const APFieldPath = '@pro-laico/core/admin/field';
const APFieldLabelPath = '@pro-laico/core/admin/label';
function definedProps(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
}
export function APField(args) {
    const { type, name, apf, docLink, ...baseArgs } = args;
    const possiblyUndefinedProps = definedProps({ docLink });
    const fieldClientProps = { type, apf, ...possiblyUndefinedProps };
    const baseField = {
        name,
        admin: {
            components: {
                Field: {
                    path: APFieldPath,
                    clientProps: fieldClientProps,
                },
                Label: {
                    path: APFieldLabelPath,
                    clientProps: { type, apf, ...possiblyUndefinedProps },
                },
            },
        },
    };
    switch (type) {
        case 'text': {
            const { kebab, ...rest } = baseArgs;
            if (kebab)
                Object.assign(fieldClientProps, { kebab: args.kebab });
            return deepMerge({ type: 'text', ...baseField }, rest);
        }
        case 'textarea': {
            const { kebab, ...rest } = baseArgs;
            if (kebab)
                Object.assign(fieldClientProps, { kebab: args.kebab });
            return deepMerge({ type: 'textarea', ...baseField }, rest);
        }
        case 'checkbox': {
            const { ...rest } = baseArgs;
            return deepMerge({ type: 'checkbox', ...baseField }, rest);
        }
        case 'select': {
            const { options, ...rest } = baseArgs;
            return deepMerge({ type: 'select', options, ...baseField }, rest);
        }
        case 'number': {
            const { ...rest } = baseArgs;
            return deepMerge({ type: 'number', ...baseField }, rest);
        }
    }
}
//# sourceMappingURL=index.js.map