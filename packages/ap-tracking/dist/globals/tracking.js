import { revalidateCacheGlobal } from '@pro-laico/ap-utils';
import { postHogTabField } from './postHogTab';
import { googleTagManagerTabField } from './gtmTab';
const authd = ({ req }) => Boolean(req.user);
export const Tracking = {
    slug: 'tracking',
    label: 'Settings',
    admin: { group: 'Tracking' },
    access: { read: authd, update: authd },
    fields: [
        {
            type: 'row',
            fields: [
                { name: 'googleTagManagerEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
                { name: 'postHogEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
                { name: 'vercelAnalyticsEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
            ],
        },
        { type: 'tabs', tabs: [googleTagManagerTabField(), postHogTabField()] },
    ],
    hooks: { beforeChange: [revalidateCacheGlobal] },
    versions: { drafts: { schedulePublish: true, validate: true }, max: 10 },
};
//# sourceMappingURL=tracking.js.map