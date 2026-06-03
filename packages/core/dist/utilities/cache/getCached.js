import 'server-only';
import { unstable_cache } from 'next/cache';
import { mt } from '../mergeTags';
export function createGetCached(configPromise, getRegistry) {
    const getCached = async (...args) => {
        const [tag, a, b] = args;
        let tid = '';
        let draft = false;
        if (typeof a === 'string')
            tid = a;
        if (typeof a === 'boolean')
            draft = a;
        if (typeof b === 'boolean')
            draft = b;
        const draftTag = draft ? 'draft' : undefined;
        const keyParts = [tag];
        if (tid)
            keyParts.push(tid);
        if (draft)
            keyParts.push('draft');
        const dependencyTags = [tag];
        if (tid)
            dependencyTags.push(tid);
        if (draft)
            dependencyTags.push(mt([tag, draftTag]));
        dependencyTags.push(draft ? 'draft' : 'published');
        if (tid)
            dependencyTags.push(mt([tag, tid, draftTag]));
        const getter = getRegistry[tag];
        switch (tag) {
            case 'icon': {
                const iconSet = args[args.length - 1];
                dependencyTags.push(mt(['iconSet', draftTag]));
                const iconItem = iconSet.iconsArray?.find((item) => item.name === tid);
                if (iconItem?.icon)
                    dependencyTags.push(mt(['icon', iconItem.icon]));
                break;
            }
            case 'icon-options': {
                dependencyTags.push(mt(['iconSet', draftTag]));
                break;
            }
            case 'form-submissions': {
                dependencyTags.push(mt(['backend-forms']));
                break;
            }
            case 'atomic-actions': {
                dependencyTags.push(mt(['settings', draftTag]));
                break;
            }
            case 'all-forms': {
                dependencyTags.push(mt(['backend-forms']));
                dependencyTags.push(mt(['atomic-forms', draftTag]));
                break;
            }
            default:
                break;
        }
        return unstable_cache(async () => getter(configPromise, ...args), keyParts, { tags: dependencyTags })();
    };
    return getCached;
}
//# sourceMappingURL=getCached.js.map