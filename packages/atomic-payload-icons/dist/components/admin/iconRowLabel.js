'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Pill, RowLabel, useRowLabel } from '@payloadcms/ui';
function toTitleCase(input) {
    if (!input)
        return '';
    let s = input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    s = s
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1 $2')
        .replace(/[-_]+/g, ' ')
        .replace(/[.\s]+/g, ' ');
    const words = s.split(/\s+/).filter((w) => w.length > 0);
    if (words.length === 0)
        return '';
    return words
        .map((w) => (/^[A-Z]+$/.test(w) ? w : /^[A-Z][a-z]+$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(' ')
        .trim();
}
const IconRowLabel = () => {
    const { data, path, rowNumber } = useRowLabel();
    return (_jsx(RowLabel, { path: path, rowNumber: rowNumber, label: _jsxs(_Fragment, { children: [_jsx("span", { children: rowNumber }), _jsx(Pill, { pillStyle: "white", size: "small", children: toTitleCase(data?.name) || 'Add Name' })] }) }));
};
IconRowLabel.displayName = 'IconRowLabel';
export default IconRowLabel;
//# sourceMappingURL=iconRowLabel.js.map