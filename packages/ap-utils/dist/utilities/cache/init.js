import { createPayloadGetCached } from './createPayloadGetCached';
let inner;
export function initPayloadCacheBindings(bindings) {
    inner = createPayloadGetCached(bindings);
}
export function getPayloadGetCachedOrThrow() {
    if (!inner) {
        throw new Error('Payload cache not initialized: call initPayloadCacheBindings() from Next.js instrumentation (see ap-utils cache docs).');
    }
    return inner;
}
//# sourceMappingURL=init.js.map