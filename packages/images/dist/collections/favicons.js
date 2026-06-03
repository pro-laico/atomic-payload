import { anyone, authd } from '../access';
export const Favicons = {
    slug: 'favicons',
    access: { create: authd, delete: authd, read: anyone, update: authd },
    admin: { group: 'Assets', enableListViewSelectAPI: true, useAsTitle: 'label' },
    // A label identifies which variant a favicon doc is (e.g. light/dark). No
    // `adminThumbnail` — .ico has no generated `imageSizes`, so the named
    // 'thumbnail' size never exists and Payload would show a broken placeholder.
    fields: [{ name: 'label', type: 'text', required: true }],
    upload: { mimeTypes: ['image/x-icon'] },
};
//# sourceMappingURL=favicons.js.map