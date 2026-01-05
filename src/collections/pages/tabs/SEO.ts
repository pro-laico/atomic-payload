import { type Tab } from 'payload'
import { APField } from '@/fields/apf'
import { onUploadSetAPF } from '@/hooks/field/apf'
import { FaviconField } from '@/fields/favicon'

const d = {
  darkFavicon: 'Overrides the global dark favicon.',
  lightFavicon: 'Overrides the global light favicon.',
  noIndex: 'Prevents the page from being indexed by search engines.',
  changeFrequency: 'How often the page is updated. Defaults to monthly.',
  priority: 'Priority of the page compared to other pages. 0-1. Default is 0.5. Home page should be 1.',
  image: 'The pages Open Graph image. This will override the global Open Graph image.',
}

export const SEOTab = () => {
  const seoField: Tab = {
    name: 'meta',
    label: 'SEO',
    interfaceName: 'PageSEO',
    fields: [
      APField({ type: 'text', apf: ['seo'], name: 'title' }),
      APField({ type: 'textarea', apf: ['seo'], name: 'description' }),
      {
        name: 'image',
        type: 'upload',
        relationTo: 'images',
        admin: { width: '50%', description: d.image },
        hooks: { beforeValidate: [onUploadSetAPF(['seo'])] },
      },
      {
        type: 'row',
        fields: [
          FaviconField({ apf: ['seo'], name: 'lightFavicon', admin: { description: d.lightFavicon } }),
          FaviconField({ apf: ['seo'], name: 'darkFavicon', admin: { description: d.darkFavicon } }),
        ],
      },
      {
        type: 'row',
        fields: [
          APField({
            type: 'checkbox',
            apf: ['seo', 'sitemap'],
            name: 'noIndex',
            required: true,
            defaultValue: false,
            admin: { width: '33%', description: d.noIndex },
          }),
          APField({
            apf: ['seo', 'sitemap'],
            name: 'priority',
            type: 'number',
            min: 0,
            max: 1,
            defaultValue: 0.5,
            admin: { width: '33%', description: d.priority },
          }),
          APField({
            type: 'select',
            apf: ['seo', 'sitemap'],
            name: 'changeFrequency',
            options: ['daily', 'weekly', 'monthly', 'yearly', 'never'],
            admin: { width: '33%', description: d.changeFrequency },
          }),
        ],
      },
    ],
  }

  return seoField
}
