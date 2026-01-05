import type { AccessArgs } from 'payload'

import type { User } from '@/ts/types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const authd: isAuthenticated = ({ req: { user } }) => Boolean(user)
