import { createGetCached } from './getCached';
import { createCacheGetterRegistry } from './createRegistry';
export function createPayloadGetCached(bindings) {
    return createGetCached(createCacheGetterRegistry(bindings));
}
//# sourceMappingURL=createPayloadGetCached.js.map