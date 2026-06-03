import { revalidateCacheCollectionAfterChange, revalidateCacheOnDelete } from '@pro-laico/core';
import { anyone, authd } from '../access';
const formatOptions = { format: 'webp', options: { nearLossless: true, quality: 75 } };
export const Images = {
    slug: 'images',
    access: { create: authd, delete: authd, read: anyone, update: authd },
    admin: { group: 'Assets', enableListViewSelectAPI: true, useAsTitle: 'alt', defaultColumns: ['alt', 'updatedAt'] },
    fields: [{ name: 'alt', type: 'text', required: true }],
    // afterChange (not beforeChange) so the cache is busted only after the write
    // commits; afterDelete clears the tag when an image is removed.
    hooks: { afterChange: [revalidateCacheCollectionAfterChange], afterDelete: [revalidateCacheOnDelete] },
    upload: {
        formatOptions,
        focalPoint: true,
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
        imageSizes: [
            { formatOptions, name: 'thumbnail', width: 300 },
            { formatOptions, name: 'square', width: 500, height: 500 },
            { formatOptions, name: 'small', width: 600 },
            { formatOptions, name: 'medium', width: 900 },
            { formatOptions, name: 'large', width: 1400 },
            { formatOptions, name: 'xlarge', width: 1920 },
            { formatOptions, name: 'og', width: 1200, height: 630, crop: 'center' },
        ],
    },
};
//# sourceMappingURL=images.js.map