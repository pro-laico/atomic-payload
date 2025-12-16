import { SelectField, Condition } from 'payload'

type ChildBlocksWithTagType = 'SimpleTextChild' | 'VideoChild' | 'AtomicChild'
type TagTypeFieldType = (args: { childBlock: ChildBlocksWithTagType; width?: string; condition?: Condition }) => SelectField

const locations: Record<ChildBlocksWithTagType, { interfaceName: string; defaultValue: string; options: string[] }> = {
  VideoChild: { interfaceName: 'VideoTagType', defaultValue: 'div', options: ['div', 'section'] },
  AtomicChild: {
    interfaceName: 'AtomicTagType',
    defaultValue: 'div',
    options: ['div', 'section', 'fragment', 'article', 'nav', 'label', 'ul', 'ol', 'li', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
  },
  SimpleTextChild: {
    interfaceName: 'SimpleTextTagType',
    defaultValue: 'p',
    options: ['p', 'span', 'fragment', 'div', 'label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
  },
}

//Where this field is used, is where options are set.
export const TagTypeField: TagTypeFieldType = ({ childBlock, width, condition }) => {
  const tagTypeField: SelectField = {
    name: 'tagType',
    type: 'select',
    required: true,
    admin: { width, condition },
    interfaceName: locations[childBlock].interfaceName,
    options: locations[childBlock].options,
    defaultValue: locations[childBlock].defaultValue,
  }
  return tagTypeField
}
