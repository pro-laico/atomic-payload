import type { CollectionSlug, Payload, PayloadRequest, File } from 'payload'

//Collection Data
import { footer } from './footer'
import { header } from './header'
import { iconSet } from './iconSet'
import { designSet } from './designSet'
import { backendForm } from './backendForm'
import { shortcutSet } from './shortcutSet'
import { homePage, notFoundPage, testingPage, prosePage } from './pages'
import { checkIcon, closeIcon, cookieIcon, githubIcon, logoIcon, menuIcon, themeIcon } from './icons'

const collections: CollectionSlug[] = ['footer', 'header', 'iconSet', 'designSet', 'forms', 'shortcutSet', 'pages', 'icon']

//Global Data
import { siteMetaData } from './siteMetaData'

const args = { depth: 0, context: { isSeed: true } }

export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }): Promise<void> => {
  payload.logger.info(`Updating Globals...`)
  await payload.updateGlobal({ slug: 'siteMetaData', ...args, data: siteMetaData })

  payload.logger.info(`Clearing collections...`)
  await Promise.all(collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })))
  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info('Seeding database...')

  payload.logger.info(`Seeding forms...`)
  await payload.create({ collection: 'forms', ...args, data: backendForm })

  payload.logger.info(`Grabbing Icons...`)
  const [checkBuffer, closeBuffer, cookieBuffer, githubBuffer, logoBuffer, menuBuffer, themeBuffer] = await Promise.all([
    fetchFileByURL('https://raw.githubusercontent.com/pro-laico/atomic-payload/refs/heads/main/src/endpoints/seed/icons/assets/check.svg'),
    fetchFileByURL('https://raw.githubusercontent.com/pro-laico/atomic-payload/refs/heads/main/src/endpoints/seed/icons/assets/close.svg'),
    fetchFileByURL('https://raw.githubusercontent.com/pro-laico/atomic-payload/refs/heads/main/src/endpoints/seed/icons/assets/cookie.svg'),
    fetchFileByURL('https://raw.githubusercontent.com/pro-laico/atomic-payload/refs/heads/main/src/endpoints/seed/icons/assets/github.svg'),
    fetchFileByURL('https://raw.githubusercontent.com/pro-laico/atomic-payload/refs/heads/main/src/endpoints/seed/icons/assets/logo.svg'),
    fetchFileByURL('https://raw.githubusercontent.com/pro-laico/atomic-payload/refs/heads/main/src/endpoints/seed/icons/assets/menu.svg'),
    fetchFileByURL('https://raw.githubusercontent.com/pro-laico/atomic-payload/refs/heads/main/src/endpoints/seed/icons/assets/theme.svg'),
  ])

  payload.logger.info('Seeding Icons...')
  const icons = await Promise.all([
    payload.create({ collection: 'icon', ...args, data: logoIcon, file: logoBuffer }),
    payload.create({ collection: 'icon', ...args, data: menuIcon, file: menuBuffer }),
    payload.create({ collection: 'icon', ...args, data: checkIcon, file: checkBuffer }),
    payload.create({ collection: 'icon', ...args, data: closeIcon, file: closeBuffer }),
    payload.create({ collection: 'icon', ...args, data: themeIcon, file: themeBuffer }),
    payload.create({ collection: 'icon', ...args, data: cookieIcon, file: cookieBuffer }),
    payload.create({ collection: 'icon', ...args, data: githubIcon, file: githubBuffer }),
  ])

  payload.logger.info(`Seeding pages...`)
  //Used as the default testing page for collections.
  const page = await payload.create({ collection: 'pages', ...args, data: testingPage })
  //Prose Showcase Page
  const prose = await payload.create({ collection: 'pages', ...args, data: prosePage })
  //Used In Header for links
  const home = await payload.create({ collection: 'pages', ...args, data: homePage })
  //Other Pages
  await Promise.all([payload.create({ collection: 'pages', ...args, data: notFoundPage({ home }) })])

  payload.logger.info(`Seeding Icon Sets...`)
  await payload.create({ collection: 'iconSet', ...args, data: iconSet({ page, icons }) })

  payload.logger.info(`Seeding Shortcut Set...`)
  await payload.create({ collection: 'shortcutSet', ...args, data: shortcutSet({ page }) })

  payload.logger.info(`Seeding Design Set...`)
  await payload.create({ collection: 'designSet', ...args, data: designSet({ page }) })

  payload.logger.info(`Seeding Footer...`)
  await payload.create({ collection: 'footer', ...args, data: footer({ page }) })

  payload.logger.info(`Seeding Header...`)
  await payload.create({ collection: 'header', ...args, context: { isSeed: false }, data: header({ testing: page, home, prose }) })

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, { credentials: 'include', method: 'GET' })

  if (!res.ok) throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/svg+xml`,
    size: data.byteLength,
  }
}
