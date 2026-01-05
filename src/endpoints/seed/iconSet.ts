import { IconSet, Page, Icon } from '@/ts/types'

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
