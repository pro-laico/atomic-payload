import { ColoredEndPath } from '@/ui'
import type { UIField } from 'payload'

/**Place at the end of a block to add a colored strip that adjusts color based on the block type and values.*/
export const ColoredEnd: UIField = { name: 'coloredEnd', type: 'ui', admin: { components: { Field: { path: ColoredEndPath } } } }
