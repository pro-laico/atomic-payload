'use server';
import 'server-only'; //DO NOT REMOVE
import { getPayloadGetCachedOrThrow } from './init';
const getCached = ((...args) => {
    return getPayloadGetCachedOrThrow()(...args);
});
export default getCached;
//# sourceMappingURL=serverGetCached.js.map