import 'server-only';
import { mt } from './mergeTags';
export default function cacheLogger({ tag, tid, draft }) {
    const fullTag = mt([tag, tid, draft ? 'draft' : undefined]);
    if (process?.env?.LOGS === 'true')
        console.log('\x1b[32m%s\x1b[0m', `[GET] - ${fullTag}`);
}
//# sourceMappingURL=cacheLogger.js.map