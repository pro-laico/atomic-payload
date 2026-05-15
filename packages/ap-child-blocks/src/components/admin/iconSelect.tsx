import { createIconSelect, type IconSelectGetCached } from '@pro-laico/ap-icons/admin/iconSelect'
import getCached from '@pro-laico/ap-core/cache/auto'

export default createIconSelect(getCached as unknown as IconSelectGetCached)
