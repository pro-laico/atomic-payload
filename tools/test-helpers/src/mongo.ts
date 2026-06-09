import { existsSync } from 'node:fs'

import { MongoMemoryReplSet } from 'mongodb-memory-server'

/** A running throwaway MongoDB plus a stop handle. */
export interface MongoReplSet {
  /** Connection string (includes the db name and `replicaSet` query param). */
  uri: string
  /** Tear down the server and free its port. */
  stop: () => Promise<void>
}

// mongodb-memory-server downloads a mongod binary on first use. We installed
// MongoDB Community locally, so prefer that binary (no download, matches the
// version the user runs). Override with MONGOMS_SYSTEM_BINARY if it lives
// elsewhere; otherwise fall back to letting the library download.
const KNOWN_MONGOD_PATHS = ['C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe']

function resolveSystemBinary(): string | undefined {
  if (process.env.MONGOMS_SYSTEM_BINARY) return process.env.MONGOMS_SYSTEM_BINARY
  return KNOWN_MONGOD_PATHS.find((p) => existsSync(p))
}

/**
 * Spin up a single-node MongoDB **replica set** in a throwaway data dir.
 *
 * A replica set (not a standalone) is required because Payload threads writes
 * through a request transaction, and MongoDB multi-document transactions only
 * work on a replica set / mongos — exactly like a real Atlas cluster. A
 * standalone server (e.g. a plain local install) throws
 * `Transaction numbers are only allowed on a replica set member or mongos`.
 */
export async function startMongoReplSet(dbName = 'atomic-payload-test'): Promise<MongoReplSet> {
  const systemBinary = resolveSystemBinary()
  const replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
    ...(systemBinary ? { binary: { systemBinary } } : {}),
  })
  return {
    uri: replSet.getUri(dbName),
    stop: () => replSet.stop(),
  }
}
