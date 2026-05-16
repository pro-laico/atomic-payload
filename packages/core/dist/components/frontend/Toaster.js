'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './Toaster.module.css';
import { Toast } from '@base-ui-components/react/toast';
const Toaster = ({ children }) => {
    return (_jsxs(Toast.Provider, { children: [children, _jsx(Toast.Portal, { children: _jsx(Toast.Viewport, { className: styles.Viewport, children: _jsx(ToastList, {}) }) })] }));
};
//TODO: Convert to atomic button variant
function ToastList() {
    const { toasts } = Toast.useToastManager();
    return toasts.map((toast) => (_jsx(Toast.Root, { toast: toast, className: styles.Toast, children: _jsxs(Toast.Content, { className: styles.Content, children: [_jsx(Toast.Title, { className: styles.Title }), _jsx(Toast.Description, { className: styles.Description }), _jsx(Toast.Close, { className: styles.Close, "aria-label": "Close", children: _jsx(XIcon, { className: styles.Icon }) })] }) }, toast.id)));
}
//TODO: Change to a stored icon
function XIcon(props) {
    return (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: [_jsx("path", { d: "M18 6 6 18" }), _jsx("path", { d: "m6 6 12 12" })] }));
}
export { Toaster };
export default Toaster;
//# sourceMappingURL=Toaster.js.map