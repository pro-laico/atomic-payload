import type { StateCreator } from 'zustand';
import type { AtomicStore, ConsentSlice } from '@pro-laico/ap-atomic-hook';
export declare const STORAGE_KEYS: {
    readonly COOKIE_CONSENT: "cookieConsent";
    readonly COOKIE_PREFERENCES: "cookiePreferences";
};
export declare const consentSlice: StateCreator<AtomicStore, [], [], ConsentSlice>;
//# sourceMappingURL=consent.d.ts.map