export const GENERAL_ICON_VARIANTS = [
  { value: 'day', label: 'Day' },
  { value: 'night', label: 'Night' },
  { value: 'person', label: 'Person' },
  { value: 'people', label: 'People' },
  { value: 'photo', label: 'Photo' },
  { value: 'video', label: 'Video' },
  { value: 'music', label: 'Music' },
  { value: 'quote', label: 'Quote' },
  { value: 'text', label: 'Text' },
] as const

export const INTERFACE_ICON_VARIANTS = [
  { value: 'checkmark', label: 'Checkmark' },
  { value: 'select', label: 'Select' },
  { value: 'menu', label: 'Menu' },
  { value: 'home', label: 'Home' },
  { value: 'back', label: 'Back' },
  { value: 'forward', label: 'Forward' },
  { value: 'close', label: 'Close' },
  { value: 'search', label: 'Search' },
  { value: 'settings', label: 'Settings' },
  { value: 'ellipsis', label: 'Ellipsis' },
  { value: 'alignRight', label: 'Align Right' },
  { value: 'alignLeft', label: 'Align Left' },
  { value: 'chevronDown', label: 'Chevron Down' },
  { value: 'chevronUp', label: 'Chevron Up' },
  { value: 'chevronLeft', label: 'Chevron Left' },
  { value: 'chevronRight', label: 'Chevron Right' },
  { value: 'play', label: 'Play' },
  { value: 'pause', label: 'Pause' },
  { value: 'stop', label: 'Stop' },
  { value: 'copy', label: 'Copy' },
  { value: 'link', label: 'Link' },
  { value: 'plus', label: 'Plus' },
  { value: 'minus', label: 'Minus' },
] as const

export const SOCIAL_ICON_VARIANTS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'bluesky', label: 'Bluesky' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitch', label: 'Twitch' },
  { value: 'discord', label: 'Discord' },
  { value: 'github', label: 'GitHub' },
] as const

export const SHAPES_ICON_VARIANTS = [
  { value: 'circle', label: 'Circle' },
  { value: 'square', label: 'Square' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'diamond', label: 'Diamond' },
] as const

export const BRAND_ICON_VARIANTS = [{ value: 'logo', label: 'Logo' }] as const

export type IconName =
  | (typeof GENERAL_ICON_VARIANTS)[number]['value']
  | (typeof INTERFACE_ICON_VARIANTS)[number]['value']
  | (typeof SOCIAL_ICON_VARIANTS)[number]['value']
  | (typeof SHAPES_ICON_VARIANTS)[number]['value']
  | (typeof BRAND_ICON_VARIANTS)[number]['value']

const IconList = {
  GENERAL_ICON_VARIANTS,
  INTERFACE_ICON_VARIANTS,
  SOCIAL_ICON_VARIANTS,
  SHAPES_ICON_VARIANTS,
  BRAND_ICON_VARIANTS,
}

const DefaultIconList = Object.values(IconList)
  .flat()
  .map((icon) => ({ name: icon?.value }))

export default DefaultIconList
