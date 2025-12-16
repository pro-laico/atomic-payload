import { Icon } from '@/ts/types'

export const closeIcon: Omit<Icon, 'createdAt' | 'updatedAt' | 'id'> = {
  optimized: 'SVG optimized: 739 to 442 bytes (40.2% reduction)',
  svgString:
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="17.2 16.2 93.7 93.7" fill="currentColor" stroke="currentColor">\n <path d="M104.2 17.4 66.7 55a3.7 3.7 0 01-5.4 0L23.8 17.4a3.7 3.7 0 00-5.4 0 3.7 3.7 0 000 5.4L56 60.3c1.6 1.5 1.6 4 0 5.4l-37.6 37.6a3.7 3.7 0 000 5.4c1.5 1.5 4 1.5 5.4 0l37.5-37.5c1.5-1.6 4-1.6 5.4 0l37.6 37.6c1.5 1.5 4 1.5 5.4 0s1.5-4 0-5.4L72.2 65.8a3.7 3.7 0 010-5.4L109.7 23c1.5-1.5 1.5-4 0-5.4a4 4 0 00-5.5 0z"/>\n</svg>\n',
  url: 'http://localhost:3000/api/icon/file/close.svg',
  thumbnailURL: null,
  filename: 'close.svg',
  mimeType: 'image/svg+xml',
  filesize: 442,
  width: 171,
  height: 171,
}
