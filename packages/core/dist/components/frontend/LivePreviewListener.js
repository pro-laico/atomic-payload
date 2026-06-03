'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';
import { getClientSideURL } from '../../utilities/getURL';
export default function LivePreviewListener() {
    const router = useRouter();
    return _jsx(PayloadLivePreview, { refresh: router.refresh, serverURL: getClientSideURL() });
}
//# sourceMappingURL=LivePreviewListener.js.map