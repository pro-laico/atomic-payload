import { createIconSelect, type IconSelectGetCached } from '@pro-laico/atomic-payload-icons/admin/iconSelect'
import getCached from '@pro-laico/ap-utils/cache/auto'

export default createIconSelect(getCached as unknown as IconSelectGetCached)
