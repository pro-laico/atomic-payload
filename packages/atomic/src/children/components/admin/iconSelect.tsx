import getCached from '@pro-laico/core/cache/auto'
import { createIconSelect, type IconSelectGetCached } from '@pro-laico/icons/admin/iconSelect'

export default createIconSelect(getCached as unknown as IconSelectGetCached)
