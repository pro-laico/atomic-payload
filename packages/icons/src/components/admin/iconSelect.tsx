import { SelectField } from '@payloadcms/ui'
import type { SelectFieldServerComponent } from 'payload'

import { getCachedIconOptions, getCachedIconSet } from '../../cache'

/** Admin select field whose options are the active icon set's icons. Reads the
 *  cached `iconSet` / `icon-options` getters directly (draft, since it runs in
 *  the admin), so revalidating the icon set refreshes the options. */
export const IconSelect: SelectFieldServerComponent = async ({ clientField, path, schemaPath, permissions }) => {
  const iconSet = await getCachedIconSet(true)
  const options = await getCachedIconOptions(true, iconSet)

  return <SelectField field={{ ...clientField, options }} path={path} schemaPath={schemaPath} permissions={permissions} />
}

export default IconSelect
