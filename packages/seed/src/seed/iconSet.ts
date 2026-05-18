import type { Icon, IconSet } from '@pro-laico/icons/schema'
import type { Page } from '@pro-laico/site/schema'

type IconSetArgs = { page: Page; icons: Icon[] }

export const iconSet: (args: IconSetArgs) => Omit<IconSet, 'createdAt' | 'updatedAt' | 'id'> = ({ page, icons }) => {
  const iconsArray = icons.map((icon) => {
    return { name: icon.filename?.split('.').shift(), icon }
  }) as IconSet['iconsArray']

  return {
    active: true,
    title: 'Base Icon Set',
    _status: 'published',

    iconsArray,

    testPath: page,
  }
}
