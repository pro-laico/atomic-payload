'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { GoogleTagManager } from '@next/third-parties/google';
export function GoogleTagManagerProvider({ children, tracking }) {
    return (_jsxs(_Fragment, { children: [tracking?.googleTagManagerId && _jsx(GoogleTagManager, { gtmId: tracking.googleTagManagerId }), children] }));
}
export default GoogleTagManagerProvider;
//# sourceMappingURL=GoogleTagManagerProvider.js.map