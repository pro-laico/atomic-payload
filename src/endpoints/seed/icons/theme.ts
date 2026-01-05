import { Icon } from '@/ts/types'

export const themeIcon: Omit<Icon, 'createdAt' | 'updatedAt' | 'id'> = {
  optimized: 'SVG optimized: 687 to 315 bytes (54.1% reduction)',
  svgString:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2.6 2.6 122.8 122.8" fill="currentColor" stroke="currentColor">\n <path d="M64 2.7A61.4 61.4 0 002.6 64 61.4 61.4 0 0064 125.4 61.4 61.4 0 00125.3 64a61 61 0 00-18-43.4A61 61 0 0064 2.6zM6.8 64A57 57 0 0164 6.8v114.4a57 57 0 01-40.4-16.8A57 57 0 016.8 64z"/>\n</svg>\n',
  url: 'http://localhost:3000/api/icon/file/theme.svg',
  thumbnailURL: null,
  filename: 'theme.svg',
  mimeType: 'image/svg+xml',
  filesize: 315,
  width: 171,
  height: 171,
}
