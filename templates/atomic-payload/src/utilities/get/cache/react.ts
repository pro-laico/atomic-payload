import 'server-only' //DO NOT REMOVE
import getCached from '.'
import { cache } from 'react'

export default cache(getCached)
