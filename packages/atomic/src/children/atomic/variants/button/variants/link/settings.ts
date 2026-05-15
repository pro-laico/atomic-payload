import { GroupField } from 'payload'

export const LinkSettingsTab: GroupField = {
  type: 'group',
  label: 'Link Settings',
  admin: {
    hideGutter: true,
    condition: (_, sd) =>
      Boolean(sd?.type === 'button' && sd?.buttonType === 'link' && (sd?.linkType === 'internalLink' || sd?.linkType === 'externalLink')),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'anchor', type: 'text', admin: { width: '50%' } },
        { name: 'parameters', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'prefetch', type: 'checkbox', label: 'Prefetch Link Data', admin: { width: '20%' } },
    { name: 'newTab', type: 'checkbox', label: 'Open in new tab', admin: { width: '20%' } },
    { name: 'noOpener', type: 'checkbox', admin: { width: '20%' } },
    { name: 'noReferrer', type: 'checkbox', admin: { width: '20%' } },
    { name: 'replace', type: 'checkbox', label: 'Replace current page', admin: { width: '20%' } },
    { name: 'scrollTo', type: 'checkbox', label: 'Scroll to anchor on click?', admin: { width: '20%' } },
  ],
}
