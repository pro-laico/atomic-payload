import { createIconSelect, type IconSelectGetCached } from '@pro-laico/icons/admin/iconSelect'
import getCached from '@pro-laico/core/cache/auto'

export default createIconSelect(getCached as unknown as IconSelectGetCached)
