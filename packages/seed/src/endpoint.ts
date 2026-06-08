import type { Endpoint, Payload, PayloadRequest } from 'payload'

export type SeedFn = (args: { payload: Payload; req: PayloadRequest }) => Promise<void>

/**
 * Authorization predicate run after the auth check; receives the authenticated
 * user and returns whether the seed (a destructive, full-DB operation) is
 * permitted. Defaults to "any authenticated user" — pass a stricter check
 * (e.g. a role test) in multi-user / production apps.
 */
export type SeedAuthorize = (user: NonNullable<PayloadRequest['user']>) => boolean | Promise<boolean>

/** Builds a Payload `POST /seed` endpoint that runs the supplied seed function.
 *  Gated to authenticated users; pass `authorize` to restrict further. */
export const createSeedEndpoint = (seed: SeedFn, path = '/seed', authorize?: SeedAuthorize): Endpoint => ({
  path,
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Action forbidden.' }, { status: 403 })
    if (authorize && !(await authorize(req.user))) return Response.json({ error: 'Action forbidden.' }, { status: 403 })

    try {
      await seed({ payload: req.payload, req })
      return Response.json({ success: true })
    } catch (e) {
      req.payload.logger.error({ err: e, msg: 'Error seeding data' })
      return Response.json({ error: 'Error seeding data.' }, { status: 500 })
    }
  },
})
