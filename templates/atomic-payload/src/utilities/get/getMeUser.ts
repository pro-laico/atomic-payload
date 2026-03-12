import { cookies } from 'next/headers'
import type { User } from '@/ts/types'
import { redirect } from 'next/navigation'
import { getClientSideURL } from './getURL'

type MeUserArgs = { nullUserRedirect?: string; validUserRedirect?: string }

export const getMeUser = async (args?: MeUserArgs): Promise<{ token: string; user: User }> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`, { headers: { Authorization: `JWT ${token}` } })

  const { user }: { user: User } = await meUserReq.json()

  if (validUserRedirect && meUserReq.ok && user) redirect(validUserRedirect)
  if (nullUserRedirect && (!meUserReq.ok || !user)) redirect(nullUserRedirect)

  // Token will exist here because if it doesn't the user will be redirected
  return { token: token!, user }
}
