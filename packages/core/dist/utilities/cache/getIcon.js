'use server';
import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
import { toTitleCase } from '../toTitleCase';
/** Type guard to check if `icon` is a usable reference (string or numeric ID).
 *  With `depth: 0`, Payload returns the relationship as the ID — that ID is a
 *  string under Mongo (ObjectId) and a number under SQLite / Postgres-serial. */
const isIconRef = (item) => {
    if (typeof item.icon === 'string')
        return item.icon.length > 0;
    if (typeof item.icon === 'number')
        return true;
    return false;
};
/** Gets the active icon sets icons array. Specifically only the name and icon reference id of each icon. */
export const getCachedIconSet = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const results = (await payload
        .find({ collection: 'iconSet', depth: 0, limit: 1, draft, pagination: false, select: { iconsArray: true }, where: { active: { equals: true } } })
        .then((res) => res.docs[0] || null));
    const filteredResults = results?.iconsArray?.filter(isIconRef).map(({ id, ...item }) => ({ name: item.name, icon: item.icon })) || [];
    cacheLogger({ tag, draft });
    return { iconsArray: filteredResults };
};
/** Gets the SVG string that matches the passed in icon name, from the active icon set collection. */
export const getCachedIconByName = async (configPromise, tag, tid, draft, iconSet) => {
    if (!iconSet?.iconsArray)
        return;
    const iconItem = iconSet.iconsArray.find((item) => item.name === tid);
    if (iconItem?.icon == null)
        return;
    if (typeof iconItem.icon !== 'string' && typeof iconItem.icon !== 'number')
        return;
    const payload = await getPayload({ config: configPromise });
    const icon = await payload
        .find({ collection: 'icon', limit: 1, draft, where: { id: { equals: iconItem.icon } } })
        .then((res) => res.docs[0] || null);
    cacheLogger({ tag, tid, draft });
    return icon?.svgString || undefined;
};
/** Formats the icon set into a list of options for the icon select field. */
export const getCachedIconOptions = async (_configPromise, tag, draft, iconSet) => {
    cacheLogger({ tag, draft });
    return iconSet?.iconsArray?.map((icon) => ({ value: icon.name, label: toTitleCase(icon.name) })) || [];
};
//# sourceMappingURL=getIcon.js.map