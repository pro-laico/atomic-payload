import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Icon } from '@pro-laico/icons/schema'
import type { Page } from '@pro-laico/site/schema'
import type { CollectionSlug, File, Payload, PayloadRequest } from 'payload'

import { backendForm } from './backendForm'
import { designSet } from './designSet'
import { footer } from './footer'
import { header } from './header'
import { iconSet } from './iconSet'
import { shortcutSet } from './shortcutSet'
import { siteMetaData } from './siteMetaData'
import { checkIcon, closeIcon, cookieIcon, githubIcon, logoIcon, menuIcon, themeIcon } from './icons'
import { homePage, notFoundPage, prosePage, testingPage } from './pages'

/** Collection / global slug overrides for the seed function. All optional; defaults
 *  match the atomic-payload template's collection set. */
export type SeedSlugConfig = {
  pages?: string
  header?: string
  footer?: string
  forms?: string
  icon?: string
  iconSet?: string
  designSet?: string
  shortcutSet?: string
  siteMetaDataGlobal?: string
}

const DEFAULT_SEED_SLUGS: Required<SeedSlugConfig> = {
  pages: 'pages',
  header: 'header',
  footer: 'footer',
  forms: 'forms',
  icon: 'icon',
  iconSet: 'iconSet',
  designSet: 'designSet',
  shortcutSet: 'shortcutSet',
  siteMetaDataGlobal: 'siteMetaData',
}

export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }, slugConfig: SeedSlugConfig = {}): Promise<void> => {
  // `req` is threaded for request context; `overrideAccess: true` makes the
  // trusted server-side bypass explicit; `isSeed` lets hooks skip side effects.
  //
  // NOTE: this seed must NOT run inside a database transaction. On a fresh DB the
  // first write to each collection/global implicitly CREATES its MongoDB
  // namespace, which the server refuses to do inside a transaction (a transient
  // "Collection namespace '…' is already in use" error). The atomic-payload
  // template disables transactions at the adapter for this reason (see its
  // mongooseAdapter `transactionOptions: false`); the seed clears-and-recreates
  // and is safely re-runnable, so it needs no transactional rollback.
  const args = { depth: 0, context: { isSeed: true }, req, overrideAccess: true }
  const slugs = { ...DEFAULT_SEED_SLUGS, ...slugConfig }
  const collections: CollectionSlug[] = [
    slugs.footer as CollectionSlug,
    slugs.header as CollectionSlug,
    slugs.iconSet as CollectionSlug,
    slugs.designSet as CollectionSlug,
    slugs.forms as CollectionSlug,
    slugs.shortcutSet as CollectionSlug,
    slugs.pages as CollectionSlug,
    slugs.icon as CollectionSlug,
  ]

  payload.logger.info(`Updating Globals...`)
  await payload.updateGlobal({ slug: slugs.siteMetaDataGlobal, ...args, data: siteMetaData } as Parameters<typeof payload.updateGlobal>[0])

  payload.logger.info(`Clearing collections...`)
  // Upload collections (e.g. `icon`) MUST be cleared through the delete OPERATION,
  // not the raw `db.deleteMany`. Only the operation runs the configured storage
  // adapter, so each stored object is removed alongside its row. A bare
  // `db.deleteMany` drops the rows but orphans the files/blobs, and the next seed
  // then collides on the still-present object — e.g. local disk would auto-rename,
  // but Vercel Blob throws "this blob already exists". Non-upload collections stay
  // on the faster `db.deleteMany`.
  //
  // `disableTransaction: true` is required because these run concurrently on the
  // shared `req`. Without it, the delete operation would `initTransaction(req)`
  // on a transaction-enabled adapter (Postgres, or Mongo on a replica set
  // without `transactionOptions: false`), racing the sibling `db.deleteMany`
  // calls on `req.transactionID` — a sibling can land on a session this op has
  // already committed. Disabling it matches the raw `db.deleteMany` branch and
  // the seed's overall "no transaction" stance (see the note above).
  await Promise.all(
    collections.map((collection) =>
      payload.collections[collection]?.config.upload
        ? payload.delete({
            collection,
            where: { id: { exists: true } },
            req,
            overrideAccess: true,
            context: { isSeed: true },
            disableTransaction: true,
          })
        : payload.db.deleteMany({ collection, req, where: {} }),
    ),
  )
  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info('Seeding database...')

  payload.logger.info(`Seeding forms...`)
  await payload.create({ collection: slugs.forms, ...args, data: backendForm } as Parameters<typeof payload.create>[0])

  payload.logger.info(`Grabbing Icons...`)
  const [checkBuffer, closeBuffer, cookieBuffer, githubBuffer, logoBuffer, menuBuffer, themeBuffer] = await Promise.all([
    readIconAsset('check.svg'),
    readIconAsset('close.svg'),
    readIconAsset('cookie.svg'),
    readIconAsset('github.svg'),
    readIconAsset('logo.svg'),
    readIconAsset('menu.svg'),
    readIconAsset('theme.svg'),
  ])

  payload.logger.info('Seeding Icons...')
  // Upload icons SEQUENTIALLY, not via Promise.all. Every create here shares this
  // one `req`, and Payload assigns the uploaded file onto `req.file` (see
  // createLocalReq → createLocal in payload core). Running them in parallel races
  // on that single slot: the last buffer wins for every create, so all icons get
  // the same file and collide on the unique `filename`. Awaiting each in turn
  // keeps `req.file` stable for the duration of its own create. (7 small SVGs.)
  const iconSeeds: { data: Omit<Icon, 'createdAt' | 'updatedAt' | 'id'>; file: File }[] = [
    { data: logoIcon, file: logoBuffer },
    { data: menuIcon, file: menuBuffer },
    { data: checkIcon, file: checkBuffer },
    { data: closeIcon, file: closeBuffer },
    { data: themeIcon, file: themeBuffer },
    { data: cookieIcon, file: cookieBuffer },
    { data: githubIcon, file: githubBuffer },
  ]
  const icons: Icon[] = []
  for (const { data, file } of iconSeeds) {
    icons.push((await payload.create({ collection: slugs.icon, ...args, data, file } as Parameters<typeof payload.create>[0])) as unknown as Icon)
  }

  payload.logger.info(`Seeding pages...`)
  //Used as the default testing page for collections.
  const page = (await payload.create({ collection: slugs.pages, ...args, data: testingPage } as Parameters<
    typeof payload.create
  >[0])) as unknown as Page
  //Prose Showcase Page
  const prose = (await payload.create({ collection: slugs.pages, ...args, data: prosePage } as Parameters<
    typeof payload.create
  >[0])) as unknown as Page
  //Used In Header for links
  const home = (await payload.create({ collection: slugs.pages, ...args, data: homePage } as Parameters<typeof payload.create>[0])) as unknown as Page
  //Other Pages
  await Promise.all([payload.create({ collection: slugs.pages, ...args, data: notFoundPage({ home }) } as Parameters<typeof payload.create>[0])])

  payload.logger.info(`Seeding Icon Sets...`)
  await payload.create({ collection: slugs.iconSet, ...args, data: iconSet({ page, icons }) } as Parameters<typeof payload.create>[0])

  payload.logger.info(`Seeding Shortcut Set...`)
  await payload.create({ collection: slugs.shortcutSet, ...args, data: shortcutSet({ page }) } as Parameters<typeof payload.create>[0])

  payload.logger.info(`Seeding Design Set...`)
  await payload.create({ collection: slugs.designSet, ...args, data: designSet({ page }) } as Parameters<typeof payload.create>[0])

  payload.logger.info(`Seeding Footer...`)
  await payload.create({ collection: slugs.footer, ...args, data: footer({ page }) } as Parameters<typeof payload.create>[0])

  payload.logger.info(`Seeding Header...`)
  // Created last with `isSeed: false` on purpose: every prior write ran with
  // `isSeed: true` (CSS/atomic side-effect hooks skipped), so this final create
  // lets the atomicHook run once — generating the stored stylesheet from the
  // now-seeded designSet/shortcutSet. Keeps `req` from `args` for the transaction.
  await payload.create({
    collection: slugs.header,
    ...args,
    context: { isSeed: false },
    data: header({ testing: page, home, prose }),
  } as Parameters<typeof payload.create>[0])

  payload.logger.info('Seeded database successfully!')
}

const iconAssetsDir = join(dirname(fileURLToPath(import.meta.url)), 'icons', 'assets')

async function readIconAsset(name: string): Promise<File> {
  const data = await readFile(join(iconAssetsDir, name))
  return {
    name,
    data,
    mimetype: 'image/svg+xml',
    size: data.byteLength,
  }
}
