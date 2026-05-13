'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import posthog from 'posthog-js';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
export function PostHogProvider({ children, tracking }) {
    const pathname = usePathname();
    useEffect(() => {
        if (!tracking)
            return;
        const { postHogPublicKey, postHogHost, disableSessionRecording, disableSurveys, capturePerformance, enableAutoCapture, postHogAutoCaptureSettings, } = tracking;
        if (!postHogPublicKey || !postHogHost)
            return;
        if (!pathname?.includes('/admin')) {
            posthog.init(postHogPublicKey, {
                api_host: postHogHost,
                defaults: '2025-05-24',
                ...(enableAutoCapture && {
                    autocapture: {
                        url_allowlist: postHogAutoCaptureSettings?.urlAllowList?.map((item) => item.url ?? ''),
                        url_ignorelist: postHogAutoCaptureSettings?.urlIgnoreList?.map((item) => item.url ?? ''),
                    },
                }),
                ...(disableSessionRecording && { disable_session_recording: disableSessionRecording }),
                ...(disableSurveys && { disable_surveys: disableSurveys }),
                ...(capturePerformance && { capture_performance: capturePerformance }),
            });
        }
    }, [pathname, tracking]);
    return _jsx(PHProvider, { client: posthog, children: children });
}
export default PostHogProvider;
//# sourceMappingURL=PostHogProvider.js.map