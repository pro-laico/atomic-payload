'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './index.scss';
import { memo } from 'react';
import { apfRegistry } from '../../fields/storage';
import { Button, EditIcon, PlusIcon, LinkIcon, MenuIcon, PopupList, SearchIcon, FolderIcon, DocumentIcon, useFormFields } from '@payloadcms/ui';
const apfIcons = {
    page: LinkIcon,
    pages: DocumentIcon,
    classes: EditIcon,
    actions: PlusIcon,
    form: MenuIcon,
    active: FolderIcon,
    seo: SearchIcon,
    sitemap: FolderIcon,
    siteMetadata: SearchIcon,
};
const RunControls = ({ APFunctions = Object.keys(apfRegistry) }) => {
    const runValues = useFormFields(([fields]) => {
        const values = {};
        Object.entries(apfRegistry).forEach(([apFunction, path]) => (values[apFunction] = Boolean(fields[path]?.value)));
        return values;
    });
    const setRunValue = useFormFields(([, dispatch]) => (apFunction, value) => {
        dispatch({ type: 'UPDATE', path: apfRegistry[apFunction], value });
    });
    const handleToggleRun = (apFunction) => setRunValue(apFunction, !runValues[apFunction]);
    const activeControls = Object.entries(runValues)
        .filter(([, isActive]) => isActive)
        .map(([apfFunction]) => apfFunction);
    return (_jsx(Button, { buttonStyle: "none", className: "full-width-button", tooltip: "Processes That Run On Save", SubMenuPopupContent: () => (_jsxs(PopupList.ButtonGroup, { children: [_jsx("div", { className: "apf-controls__header flex-column", children: _jsx("span", { className: "apf-controls__header-title text-sm", children: "Processes That Run On Save" }) }), Object.keys(apfRegistry)
                    .filter((apFunctionString) => APFunctions.includes(apFunctionString))
                    .map((apFunctionString) => {
                    const apFunction = apFunctionString;
                    const IconComponent = apfIcons[apFunction];
                    return (_jsx(PopupList.Button, { onClick: () => handleToggleRun(apFunction), children: _jsxs("div", { className: "apf-controls__button-content", children: [_jsx("span", { children: apFunction }), _jsx(IconComponent, {})] }) }, apFunction));
                })] })), children: activeControls.length > 0 ? (_jsx("div", { className: "apf-controls__active-controls", children: activeControls.map((apFunction) => {
                const IconComponent = apfIcons[apFunction];
                return _jsx(IconComponent, {}, apFunction);
            }) })) : (_jsx("span", { children: "None" })) }));
};
RunControls.displayName = 'RunControls';
export default memo(RunControls);
//# sourceMappingURL=controls.js.map