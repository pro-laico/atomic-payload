import { requiredWhenEnabled } from './validators';
export const googleTagManagerTabField = () => ({
    type: 'tab',
    label: 'Google Tag Manager',
    admin: { condition: (_, sd) => Boolean(sd?.googleTagManagerEnabled) },
    fields: [
        {
            name: 'googleTagManagerId',
            type: 'text',
            label: 'Google Tag Manager ID',
            validate: requiredWhenEnabled('googleTagManagerEnabled', 'Google Tag Manager ID is required when GTM is enabled'),
            admin: { condition: (_, sd) => Boolean(sd?.googleTagManagerEnabled) },
        },
    ],
});
//# sourceMappingURL=gtmTab.js.map