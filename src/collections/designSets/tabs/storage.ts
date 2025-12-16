import { z } from '@/ts/zap'
import { type Tab } from 'payload'
import { unoThemeAnimation } from './animation'

export const tokenStorage = z.ap.add(
  z.object({
    font: z.ap.get('RSS'),
    aria: z.ap.get('RSS'),
    perspective: z.ap.get('RSS'),
    blur: z.ap.get('RSS'),
    media: z.ap.get('RSS'),
    supports: z.ap.get('RSS'),
    ease: z.ap.get('RSS'),
    property: z.ap.get('RSS'),
    container: z.ap.get('RSS'),
    breakpoint: z.ap.get('RSS'),
    spacing: z.ap.get('RSS'),
    radius: z.ap.get('RSS'),
    fontWeight: z.ap.get('RSS'),
    tracking: z.ap.get('RSS'),
    leading: z.ap.get('RSS'),
    textStrokeWidth: z.ap.get('RSS'),
    variables: z.ap.get('RSS'),
    shadow: z.ap.get('RSSOSA'),
    insetShadow: z.ap.get('RSSOSA'),
    dropShadow: z.ap.get('RSSOSA'),
    textShadow: z.ap.get('RSSOSA'),
    colors: z.ap.get('UnoColors'),
    animation: z.ap.get('UnoThemeAnimation', unoThemeAnimation),
  }),
  { id: 'TokenStorage' },
)

export const StorageTab = () => {
  const storageField: Tab = {
    label: 'Storage',
    fields: [
      { name: 'preflightStorage', type: 'code', admin: { language: 'css', readOnly: true } },
      {
        name: 'tokenStorage',
        type: 'json',
        admin: { readOnly: true },
        typescriptSchema: [() => ({ $ref: `#/definitions/TokenStorage` })],
      },
    ],
  }

  return storageField
}
