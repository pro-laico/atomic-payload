'use server';
import 'server-only';
import { mt } from './mergeTags';
import { revalidateTag as rt } from 'next/cache';
import revalidationLogger from './log';
async function revalidateTag(...args) {
    const [tag, a, b] = args;
    let tid = '';
    let draft = false;
    if (typeof a === 'string')
        tid = a;
    if (typeof a === 'boolean')
        draft = a;
    if (typeof b === 'boolean')
        draft = b;
    const tags = [];
    let t = tag;
    if (tid)
        t = mt([tag, tid]);
    // Secondary revalidations and special handlings for specific tags.
    switch (tag) {
        case 'pages':
            revalidateTag('sitemap', draft);
            break;
        case 'designSet':
        case 'shortcutSet':
        case 'atomic-classes':
            revalidateTag('site-css', draft);
            break;
        case 'draft':
        case 'published':
            rt(t, 'max');
            revalidationLogger([t]);
            return { success: true, message: `Revalidated ${tag}`, timestamp: new Date().toISOString() };
        default:
            break;
    }
    if (draft) {
        rt(mt([t, 'draft']), 'max');
        tags.push(mt([t, 'draft']));
    }
    else {
        rt(t, 'max');
        tags.push(t);
    }
    revalidationLogger(tags);
}
export { revalidateTag };
//# sourceMappingURL=revalidateTag.js.map