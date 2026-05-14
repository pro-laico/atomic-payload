'use server'
import Image from 'next/image'
import { RenderChild } from 'atomic-payload/child-blocks-types'
import configPromise from '@payload-config'
import { createReactCachedGetCached } from '../../../ap-utils/src/utilities/cache/react'
const getCached = createReactCachedGetCached(configPromise)
import type { ImageChild as ImageChildType } from 'atomic-payload/child-blocks-types'

export const ImageChild: React.FC<RenderChild<ImageChildType>> = async (props) => {
  const { block, pt } = props
  const { alt = '', src: srcFromProps, ...restP } = pt?.c?.p || {}

  if (typeof block?.image === 'string') return <div className={'w-full h-full bg-gray-200'} />

  // Since images are relationships. We use the id value as part of the cache key.
  // If the image document is modified, all pages that reference the image doc will be revalidated.
  // Note that the pages using the image will not be revalidated.
  // Hence using this getCached function. Everything else on the page stays the same, the image url is the only thing that changes.
  const src = await getCached('image', block?.image?.id, block?.version)
  if (!src) return <div className={'w-full h-full bg-gray-200'} />

  return <Image alt={alt as string} src={src} {...restP} {...pt?.c?.da} />
}
