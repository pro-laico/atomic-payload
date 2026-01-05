import { Icon } from '@/ts/types'

export const menuIcon: Omit<Icon, 'createdAt' | 'updatedAt' | 'id'> = {
  optimized: 'SVG optimized: 617 to 273 bytes (55.8% reduction)',
  svgString:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="26.1 26.1 47.8 47.8" fill="currentColor" stroke="currentColor">\n <path d="M28.6 29.2a2.5 2.5 0 000 5h42.8a2.5 2.5 0 000-5zm0 18.3a2.5 2.5 0 000 5h42.8a2.5 2.5 0 000-5zm0 18.2a2.5 2.5 0 000 5h42.8a2.5 2.5 0 000-5z"/>\n</svg>\n',
  url: 'http://localhost:3000/api/icon/file/menu.svg',
  thumbnailURL: null,
  filename: 'menu.svg',
  mimeType: 'image/svg+xml',
  filesize: 273,
  width: 133,
  height: 133,
}
