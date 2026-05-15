'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './index.scss';
import APFieldLabelServer from './label';
import { memo, useEffect, useMemo, useState } from 'react';
import { getTranslation } from '@payloadcms/translations';
import { apfRegistry } from '../../fields/storage';
import { toKebabCase } from './toKebabCase';
import { useField, useFormFields, TextInput, TextareaInput, CheckboxInput, FieldDescription, ReactSelect, } from '@payloadcms/ui';
import { useTranslation } from '@payloadcms/ui/providers/Translation';
import { formatOptions, SelectInput } from '@payloadcms/ui/fields/Select';
import { fieldBaseClass } from '@payloadcms/ui/fields/shared';
import { FieldError } from '@payloadcms/ui/fields/FieldError';
/** Mirrors Payload `@payloadcms/ui` `mergeFieldStyles` widths for arbitrary field shapes used by AP fields. */
function mergeApfFieldStyles(field) {
    const admin = field?.admin;
    const style = admin?.style;
    return {
        ...(style ?? {}),
        ...(admin?.width ? { ['--field-width']: `${admin.width}` } : { flex: '1 1 auto' }),
        ...(style?.flex !== undefined ? { flex: style.flex } : {}),
    };
}
/** Accepts typed strings coming from react-select creatable filtering. */
function isNumericRawInput(raw) {
    if (typeof raw !== 'string' || raw.trim() === '')
        return false;
    const n = Number(raw);
    return Number.isFinite(n);
}
export const APFieldComponent = (props) => {
    const { path, field, apf, type } = props;
    const { i18n, t } = useTranslation();
    const { value, initialValue, setValue, selectFilterOptions, showError, disabled: formBusy } = useField({ path });
    const targetPaths = useMemo(() => {
        const apfArray = Array.isArray(apf) ? apf : [apf];
        return apfArray?.map((apfItem) => apfRegistry[apfItem]);
    }, [apf]);
    const setTargetValues = useFormFields(([, dispatch]) => (value) => {
        targetPaths?.forEach((targetPath) => dispatch({ type: 'UPDATE', path: targetPath, value }));
    });
    const selectFormattedOptions = useMemo(() => {
        if (type !== 'select')
            return [];
        return formatOptions(field.options ?? []);
    }, [field, props, type]);
    const placeholderNumber = useMemo(() => {
        if (type !== 'number')
            return undefined;
        const raw = props.field?.admin?.placeholder;
        if (raw === undefined || raw === null)
            return undefined;
        const out = getTranslation(raw, i18n);
        return typeof out === 'string' ? out : undefined;
    }, [i18n, props, type]);
    const [numberMultiRender, setNumberMultiRender] = useState([]);
    const hasManyNumber = type === 'number' && !!field.hasMany;
    const valueArray = useMemo(() => (Array.isArray(value) ? value : []), [value]);
    useEffect(() => {
        if (!hasManyNumber)
            return;
        setNumberMultiRender(valueArray.map((valEntry, index) => {
            const val_0 = valEntry;
            const v = typeof val_0 === 'object' && val_0 !== null && 'value' in val_0 ? val_0.value : val_0;
            const n = v == null || Number.isNaN(Number(v)) ? undefined : Number(v);
            return {
                id: `${String(n ?? '')}${index}`,
                label: `${n ?? ''}`,
                value: {
                    toString: () => `${String(n ?? '')}${index}`,
                    value: n,
                },
            };
        }));
    }, [hasManyNumber, valueArray]);
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
    function handleChange(next) {
        setValue(next);
        if (next !== initialValue)
            setTargetValues(true);
    }
    const selectFilterMemo = useMemo(() => {
        if (!selectFilterOptions)
            return undefined;
        return (opt, search) => !!selectFilterOptions.some((optionEl) => (typeof optionEl === 'string' ? optionEl : optionEl.value) === opt.value) && opt.label.toLowerCase().includes(search.toLowerCase());
    }, [selectFilterOptions]);
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
        case 'select': {
            const sel = props;
            const selField = sel.field;
            const readOnlySel = !!(selField?.admin?.readOnly || formBusy);
            const adm = selField.admin;
            const isClearable = adm?.isClearable !== false;
            const isSortable = adm?.isSortable !== false;
            fieldComponent = (_jsx(SelectInput, { className: adm?.className, hasMany: selField?.hasMany, isClearable: isClearable, isSortable: isSortable, label: undefined, filterOption: selectFilterMemo, localized: selField?.localized, name: selField?.name ?? path, options: selectFormattedOptions, path: path, placeholder: adm?.placeholder, readOnly: readOnlySel, required: selField.required === true, style: mergeApfFieldStyles(selField), showError: showError, value: (value ?? null), onChange: (selectedOption) => {
                    const hasMany = !!selField?.hasMany;
                    let next = null;
                    if (selectedOption && hasMany) {
                        next = Array.isArray(selectedOption) ? selectedOption.map((option) => option.value) : [];
                    }
                    else if (selectedOption && !Array.isArray(selectedOption)) {
                        next = selectedOption.value;
                    }
                    handleChange(next);
                } }));
            break;
        }
        case 'number': {
            const f = field;
            const adm = f?.admin ?? {};
            const readOnlyNum = !!(adm.readOnly || formBusy);
            const hasMany = !!f?.hasMany;
            const step = adm.step ?? 1;
            const max = typeof f?.max === 'number' ? f.max : Infinity;
            const min = typeof f?.min === 'number' ? f.min : -Infinity;
            const maxRows = typeof f?.maxRows === 'number' ? f.maxRows : Infinity;
            const handleNumberScalarChange = (e) => {
                const parsed = parseFloat(e.target.value);
                const nextVal = Number.isNaN(parsed) ? null : parsed;
                handleChange(nextVal);
            };
            const handleHasManyNumberChange = (selectedOption) => {
                if (readOnlyNum)
                    return;
                let next;
                if (!selectedOption) {
                    next = [];
                }
                else if (Array.isArray(selectedOption)) {
                    next = selectedOption.map((option) => Number(option.value?.value ?? option.value));
                }
                else {
                    next = [
                        Number(selectedOption.value?.value ??
                            selectedOption.value),
                    ];
                }
                handleChange(next);
            };
            const numberRowClassName = [
                fieldBaseClass,
                'number',
                adm.className,
                showError && 'error',
                readOnlyNum && 'read-only',
                hasMany && 'has-many',
            ]
                .filter(Boolean)
                .join(' ');
            fieldComponent = (_jsx("div", { className: numberRowClassName, style: mergeApfFieldStyles(f), children: _jsxs("div", { className: `${fieldBaseClass}__wrap`, children: [_jsx(FieldError, { path: path, showError: showError }), hasMany ? (_jsx(ReactSelect, { className: `field-${path.replace(/\./g, '__')}`, disabled: readOnlyNum, filterOption: ((_opt, rawInput) => valueArray.length >= maxRows ? false : isNumericRawInput(rawInput)), isClearable: true, isCreatable: true, isMulti: true, isSortable: true, noOptionsMessage: () => {
                                const over = valueArray.length >= maxRows;
                                if (over) {
                                    return t('validation:limitReached', { max: maxRows, value: valueArray.length + 1 });
                                }
                                return '';
                            }, onChange: handleHasManyNumberChange, options: [], placeholder: placeholderNumber, showError: showError, value: numberMultiRender })) : (_jsx("div", { children: _jsx("input", { disabled: readOnlyNum, id: `field-${path.replace(/\./g, '__')}`, max: max, min: min, name: path, onChange: handleNumberScalarChange, onWheel: (e) => {
                                    ;
                                    e.target.blur();
                                }, placeholder: placeholderNumber, step: step, type: "number", value: typeof value === 'number' ? value : '' }) }))] }) }));
            break;
        }
        default:
            console.warn('Missing Field Component With Type: ', type);
            fieldComponent = _jsx("div", { children: " Missing Field Component " });
    }
    return (_jsxs("div", { className: `field-type ${type}`, children: [_jsx(APFieldLabelServer, { ...props }), fieldComponent, field?.admin?.description && _jsx(FieldDescription, { description: field.admin.description, path: path })] }));
};
export default memo(APFieldComponent);
//# sourceMappingURL=field.js.map