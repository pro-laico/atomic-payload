import { PayloadRequest } from 'payload'
import { getClientSideURL } from './get/getURL'

type Props = {
  data: Partial<any>
  req: PayloadRequest
}

export const generateLivePreviewPath = async ({ data, req: { payload } }: Props): Promise<string> => {
  try {
    let slug = typeof data?.title === 'string' ? data.title : 'testing'
    let path = '/testing'
    // Because href is updated by the field, we need to use breadcrumbs to get the latest href.
    const href = data?.breadcrumbs && data?.breadcrumbs?.length > 0 ? data?.breadcrumbs[data?.breadcrumbs?.length - 1]?.url : undefined

    //Handle For Collections With Test Path
    if (typeof data?.testPath === 'string') {
      try {
        const page = await payload.findByID({ collection: 'pages', id: data?.testPath, select: { href: true } })
        if (page?.href) path = page.href
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        payload.logger.info('No Page Found. Loading /testing instead.')
      }
    }

    //Handle For Collections With Href
    if (typeof href === 'string') {
      path = href
      if (typeof data?.slug === 'string') slug = data.slug || 'home'
    }

    const encodedParams = new URLSearchParams({ slug, path, collection: 'pages', previewSecret: process.env.PREVIEW_SECRET || '' })

    const url = `/next/preview?${encodedParams.toString()}`

    return getClientSideURL() + url
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    payload.logger.error('Error generating live preview path')
    return '/testing'
  }
}
