import { Icon } from '@/ts/types'

export const checkIcon: Omit<Icon, 'createdAt' | 'updatedAt' | 'id'> = {
  optimized: 'SVG optimized: 470 to 246 bytes (47.7% reduction)',
  svgString:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="12.9 12.9 102.2 102.2" fill="currentColor" stroke="currentColor">\n <path d="M102 29.6 49.4 82 26.1 58.5a8 8 0 00-11 0 8 8 0 000 11l29 29a8 8 0 0011 0l57.8-58a8 8 0 000-11 8 8 0 00-11 0z"/>\n</svg>\n',
  url: 'http://localhost:3000/api/icon/file/check.svg',
  thumbnailURL: null,
  filename: 'check.svg',
  mimeType: 'image/svg+xml',
  filesize: 246,
  width: 171,
  height: 171,
}
