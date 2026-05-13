import { SelectField } from 'payload'
import { TagTypeField } from 'atomic-payload/child-blocks-deps'

const forField: SelectField = TagTypeField({ childBlock: 'AtomicChild', width: '25%', condition: (_, sd) => Boolean(sd?.type === 'tag') })

export const TagControlBar: [SelectField] = [forField]
