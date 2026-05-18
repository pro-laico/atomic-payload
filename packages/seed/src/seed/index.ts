import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Icon } from '@pro-laico/icons/schema'
import type { Page } from '@pro-laico/site/schema'
import type { CollectionSlug, File, Payload, PayloadRequest } from 'payload'
import { backendForm } from './backendForm'
import { designSet } from './designSet'
//Collection Data
import { footer } from './footer'
import { header } from './header'
import { iconSet } from './iconSet'
import { checkIcon, closeIcon, cookieIcon, githubIcon, logoIcon, menuIcon, themeIcon } from './icons'
import { homePage, notFoundPage, prosePage, testingPage } from './pages'
import { shortcutSet } from './shortcutSet'

//Global Data
import { siteMetaData } from './siteMetaData'

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

const args = { depth: 0, context: { isSeed: true } }

export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }, slugConfig: SeedSlugConfig = {}): Promise<void> => {
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
  await Promise.all(collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })))
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
  const icons = (await Promise.all([
    payload.create({ collection: slugs.icon, ...args, data: logoIcon, file: logoBuffer } as Parameters<typeof payload.create>[0]),
    payload.create({ collection: slugs.icon, ...args, data: menuIcon, file: menuBuffer } as Parameters<typeof payload.create>[0]),
    payload.create({ collection: slugs.icon, ...args, data: checkIcon, file: checkBuffer } as Parameters<typeof payload.create>[0]),
    payload.create({ collection: slugs.icon, ...args, data: closeIcon, file: closeBuffer } as Parameters<typeof payload.create>[0]),
    payload.create({ collection: slugs.icon, ...args, data: themeIcon, file: themeBuffer } as Parameters<typeof payload.create>[0]),
    payload.create({ collection: slugs.icon, ...args, data: cookieIcon, file: cookieBuffer } as Parameters<typeof payload.create>[0]),
    payload.create({ collection: slugs.icon, ...args, data: githubIcon, file: githubBuffer } as Parameters<typeof payload.create>[0]),
  ])) as unknown as Icon[]

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
