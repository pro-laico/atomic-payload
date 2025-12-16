import type { RelationshipField, RowField, SelectField, TextField, UploadField, EmailField as EmailFieldType } from 'payload'

const linkTypeField: SelectField = {
  name: 'linkType',
  type: 'select',
  label: 'Link Type',
  required: true,
  interfaceName: 'AtomicButtonLinkTypes',
  options: [
    { label: 'Internal Link', value: 'internalLink' },
    { label: 'External Link', value: 'externalLink' },
    { label: 'Download', value: 'download' },
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
  ],
  admin: { width: '25%', condition: (_, sd) => Boolean(sd?.buttonType === 'link') },
}

const DownloadField: UploadField = {
  name: 'download',
  type: 'upload',
  relationTo: 'images',
  label: 'Download',
  required: true,
  admin: {
    width: '25%',
    allowCreate: false,
    condition: (_, sd) => Boolean(sd?.linkType && sd?.linkType === 'download'),
  },
}

const EmailField: EmailFieldType = {
  name: 'email',
  type: 'email',
  label: 'Email',
  required: true,
  admin: { width: '25%', condition: (_, sd) => Boolean(sd?.linkType && sd?.linkType === 'email') },
}

const ExternalLinkField: TextField = {
  name: 'externalLink',
  type: 'text',
  required: true,
  admin: { width: '25%', condition: (_, sd) => Boolean(sd?.linkType === 'externalLink') },
}
const InternalLinkField: RelationshipField = {
  name: 'internalLink',
  type: 'relationship',
  relationTo: 'pages',
  required: true,
  admin: {
    width: '25%',
    allowEdit: false,
    allowCreate: false,
    condition: (_, sd) => Boolean(sd?.linkType && sd?.linkType === 'internalLink'),
  },
}

const PhoneField: TextField = {
  name: 'phone',
  type: 'text',
  admin: {
    width: '25%',
    placeholder: '+1 123 456 7890 ',
    condition: (_, sd) => Boolean(sd?.linkType && sd?.linkType === 'phone'),
  },
}

export const LinkControlBarFields: RowField = {
  type: 'row',
  admin: { condition: (_, sd) => Boolean(sd?.buttonType === 'link') },
  fields: [linkTypeField, InternalLinkField, ExternalLinkField, DownloadField, EmailField, PhoneField],
}
