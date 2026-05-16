export const googleTagManagerTabField = () => ({
    type: 'tab',
    label: 'Google Tag Manager',
    admin: { condition: (_, sd) => Boolean(sd?.googleTagManagerEnabled) },
    fields: [
        {
            name: 'googleTagManagerId',
            type: 'text',
            label: 'Google Tag Manager ID',
            admin: { condition: (_, sd) => Boolean(sd?.googleTagManagerEnabled) },
        },
    ],
});
//# sourceMappingURL=gtmTab.js.map