import { createIconSelect, type IconSelectGetCached } from '@pro-laico/atomic-payload-icons/admin/iconSelect'
import getCached from '@/utilities/get/cache/react'

export default createIconSelect(getCached as unknown as IconSelectGetCached)
