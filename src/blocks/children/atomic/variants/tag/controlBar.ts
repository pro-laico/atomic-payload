import { SelectField } from 'payload'
import { TagTypeField } from '@/fields/tagType'

const forField: SelectField = TagTypeField({ childBlock: 'AtomicChild', width: '25%', condition: (_, sd) => Boolean(sd?.type === 'tag') })

export const TagControlBar: [SelectField] = [forField]
