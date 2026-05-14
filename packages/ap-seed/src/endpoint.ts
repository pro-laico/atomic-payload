import type { Endpoint, Payload, PayloadRequest } from 'payload'

export type SeedFn = (args: { payload: Payload; req: PayloadRequest }) => Promise<void>

/** Builds a Payload `POST /seed` endpoint that runs the supplied seed function for authenticated users. */
export const createSeedEndpoint = (seed: SeedFn, path = '/seed'): Endpoint => ({
  path,
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Action forbidden.' }, { status: 403 })

    try {
      await seed({ payload: req.payload, req })
      return Response.json({ success: true })
    } catch (e) {
      req.payload.logger.error({ err: e, message: 'Error seeding data' })
      return Response.json({ error: 'Error seeding data.' }, { status: 500 })
    }
  },
})
