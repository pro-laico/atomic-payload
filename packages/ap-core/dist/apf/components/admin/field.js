'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './index.scss';
import APFieldLabelServer from './label';
import { memo, useMemo } from 'react';
import { apfRegistry } from '../../fields/storage';
import { toKebabCase } from './toKebabCase';
import { useField, useFormFields, NumberField, TextInput, TextareaInput, CheckboxInput, SelectField, FieldDescription } from '@payloadcms/ui';
export const APFieldComponent = (props) => {
    const { path, field, apf, type } = props;
    const { value, initialValue, setValue } = useField({ path });
    const targetPaths = useMemo(() => {
        const apfArray = Array.isArray(apf) ? apf : [apf];
        return apfArray?.map((apfItem) => apfRegistry[apfItem]);
    }, [apf]);
    const setTargetValues = useFormFields(([, dispatch]) => (value) => {
        targetPaths?.forEach((targetPath) => dispatch({ type: 'UPDATE', path: targetPath, value }));
    });
    function handleTextChange(e) {
        if (type === 'text' || type === 'textarea') {
            const { kebab } = props;
            let tempValue = e.target.value;
            if (kebab)
                tempValue = toKebabCase(tempValue);
            setValue(tempValue);
            setTargetValues(true);
        }
        if (value !== initialValue)
            setTargetValues(true);
    }
    function handleChange(value) {
        setValue(value);
        if (value !== initialValue)
            setTargetValues(true);
    }
    let fieldComponent = null;
    switch (type) {
        case 'text':
            fieldComponent = (_jsx(TextInput, { path: path, style: field?.admin?.style, readOnly: field?.admin?.readOnly, value: value, onChange: handleTextChange }));
            break;
        case 'textarea':
            fieldComponent = (_jsx(TextareaInput, { path: path, style: field?.admin?.style, readOnly: field?.admin?.readOnly, value: value, onChange: handleTextChange }));
            break;
        case 'checkbox':
            fieldComponent = (_jsx(CheckboxInput, { checked: value, readOnly: field?.admin?.readOnly, onToggle: () => handleChange(!value), id: `field-${path}` }));
            break;
        case 'select':
            return _jsx(SelectField, { value: value, readOnly: field?.admin?.readOnly, field: field, onChange: handleChange, path: path });
        case 'number':
            return _jsx(NumberField, { readOnly: field?.admin?.readOnly, field: field, onChange: handleChange, path: path });
        default:
            console.warn('Missing Field Component With Type: ', type);
            fieldComponent = _jsx("div", { children: " Missing Field Component " });
    }
    return (_jsxs("div", { className: `field-type ${type}`, children: [_jsx(APFieldLabelServer, { ...props }), fieldComponent, field?.admin?.description && _jsx(FieldDescription, { description: field.admin.description, path: path })] }));
};
export default memo(APFieldComponent);
//# sourceMappingURL=field.js.map