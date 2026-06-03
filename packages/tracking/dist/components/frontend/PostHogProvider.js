'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
export function PostHogProvider({ children, tracking }) {
    const pathname = usePathname();
    useEffect(() => {
        if (!tracking)
            return;
        const { postHogPublicKey, postHogHost, disableSessionRecording, disableSurveys, capturePerformance, enableAutoCapture, postHogAutoCaptureSettings, } = tracking;
        if (!postHogPublicKey || !postHogHost)
            return;
        // Initialise at most once. PostHog is a singleton — re-running init on every
        // navigation duplicates capture and can corrupt session state. The `__loaded`
        // guard short-circuits later navigations; we still skip admin routes so the
        // SDK only lazily initialises on the first non-admin view. Pageviews are
        // captured automatically by `defaults`, so we don't capture them manually.
        if (posthog.__loaded)
            return;
        if (pathname?.includes('/admin'))
            return;
        posthog.init(postHogPublicKey, {
            api_host: postHogHost,
            defaults: '2025-05-24',
            ...(enableAutoCapture && {
                // `url_allowlist`/`url_ignorelist` are posthog-js autocapture options
                // (string | RegExp arrays); see the posthog-js changelog around the
                // `defaults: '2025-05-24'` snapshot above. Drop falsy entries — an empty
                // string would match every URL.
                autocapture: {
                    url_allowlist: postHogAutoCaptureSettings?.urlAllowList?.map((item) => item.url ?? '').filter(Boolean),
                    url_ignorelist: postHogAutoCaptureSettings?.urlIgnoreList?.map((item) => item.url ?? '').filter(Boolean),
                },
            }),
            ...(disableSessionRecording && { disable_session_recording: disableSessionRecording }),
            ...(disableSurveys && { disable_surveys: disableSurveys }),
            ...(capturePerformance && { capture_performance: capturePerformance }),
        });
    }, [pathname, tracking]);
    return _jsx(PHProvider, { client: posthog, children: children });
}
export default PostHogProvider;
//# sourceMappingURL=PostHogProvider.js.map