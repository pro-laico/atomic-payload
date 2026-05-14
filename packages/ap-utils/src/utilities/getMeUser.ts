import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getClientSideURL } from './getURL'

type MeUserArgs = { nullUserRedirect?: string; validUserRedirect?: string }

/** Fetches the currently-authenticated Payload user via the `/api/users/me`
 *  endpoint and (optionally) redirects depending on auth state. Caller may
 *  parameterize the User shape: `await getMeUser<MyUser>()`. */
export const getMeUser = async <U = unknown>(args?: MeUserArgs): Promise<{ token: string; user: U }> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  const meUserReq = await fetch(`${getClientSideURL()}/api/users/me`, { headers: { Authorization: `JWT ${token}` } })

  const { user }: { user: U } = await meUserReq.json()

  if (validUserRedirect && meUserReq.ok && user) redirect(validUserRedirect)
  if (nullUserRedirect && (!meUserReq.ok || !user)) redirect(nullUserRedirect)

  // Token will exist here because if it doesn't the user will be redirected
  return { token: token!, user }
}
