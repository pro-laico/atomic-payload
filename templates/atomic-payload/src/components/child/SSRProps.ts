import 'server-only' //DO NOT REMOVE
import { createBlurUp } from '@mux/blurup'
import { PassThroughs, ChildBlocks, StaticDataAttributes } from '@/ts/types'
import postHogPropertyApplicator from '@/utilities/propertyApplicatorUtility'

type PassThrough = { p: Record<string, unknown>; da: Record<string, string> }

function formatStaticDataAttributes(staticDataAttributes: StaticDataAttributes): Record<string, string> | undefined {
  if (!staticDataAttributes) return undefined
  return staticDataAttributes
    .filter((item) => item?.key && typeof item.key === 'string' && item.key.trim() !== '')
    .reduce(
      (acc, item) => {
        acc[`data-${item.key}`] = item.value === 'true' ? '' : item.value
        return acc
      },
      {} as Record<string, string>,
    )
}

const breakpoints = {
  '3xl': 1920,
  '2xl': 1536,
  xl: 1280,
  lg: 1024,
  md: 768,
  sm: 640,
}

/** Securely generates all props that should be generated server side. */
export async function SSRProps<T extends ChildBlocks[number]>(block: T): Promise<PassThroughs> {
  const { blockType, cid, contentPostHogProperty, ClassName } = block

  /** Content Pass Throughs */
  const c: PassThrough & { children?: React.ReactNode } = { p: {}, da: {} }
  /** Trigger Pass Throughs */
  const t: PassThrough = { p: {}, da: {} }
  /** Backdrop Pass Throughs */
  const b: Omit<PassThrough, 'da'> = { p: {} }
  /** Dialog Pass Throughs */
  const di: Omit<PassThrough, 'children' | 'da'> = { p: {} }
  /** Popover Pass Throughs */
  const pop: Omit<PassThrough, 'children' | 'da'> = { p: {} }

  // Universal Static Props
  if (cid) c.p.id = cid
  if (ClassName) c.p.className = ClassName
  if (contentPostHogProperty) c.p = { ...c.p, ...postHogPropertyApplicator(contentPostHogProperty) }

  if ('staticDataAttributes' in block && block.staticDataAttributes && Object.keys(block.staticDataAttributes).length > 0) {
    const dataAttributes = formatStaticDataAttributes(block.staticDataAttributes)
    if (dataAttributes) c.da = { ...c.da, ...dataAttributes }
  }

  // Static Props Based On Block Type
  switch (blockType) {
    case 'AtomicChild': {
      const { type } = block

      switch (type) {
        case 'tag':
          const { htmlFor } = block
          if (htmlFor) c.p.htmlFor = htmlFor
          break
        case 'button': {
          const { buttonType, triggerClassName, triggerPostHogProperty } = block

          if (block?.triggerStaticDataAttributes && Object.keys(block.triggerStaticDataAttributes).length > 0) {
            const dataAttributes = formatStaticDataAttributes(block.triggerStaticDataAttributes)
            if (dataAttributes) t.da = { ...t.da, ...dataAttributes }
          }

          if (triggerClassName) t.p.className = triggerClassName
          if (triggerPostHogProperty) t.p = { ...t.p, ...postHogPropertyApplicator(triggerPostHogProperty) }
          if ('backdropClassName' in block && block.backdropClassName) b.p.className = block.backdropClassName

          switch (buttonType) {
            case 'link': {
              const {
                linkType,
                internalLink,
                externalLink,
                download,
                email,
                phone,
                anchor,
                parameters,
                newTab,
                noOpener,
                noReferrer,
                ariaLabel,
                prefetch,
              } = block

              let href = ''
              switch (linkType) {
                case 'internalLink': {
                  if (typeof internalLink === 'string') href = '/404'
                  else href = `${internalLink?.href}`
                  break
                }
                case 'externalLink': {
                  if (externalLink) {
                    if (!externalLink.match(/^(https?:\/\/|mailto:|tel:)/i)) href = `https://${externalLink}`
                    else href = `${externalLink}`
                  }
                  break
                }
                case 'download': {
                  if (typeof download !== 'string') href = `${download?.url}`
                  break
                }
                case 'email': {
                  href = `mailto:${email}`
                  break
                }
                case 'phone': {
                  href = `tel:${phone}`
                  break
                }
              }
              t.p.href = href.concat(anchor ? `#${anchor}` : '').concat(parameters ? `?${parameters}` : '')
              t.p.rel = newTab ? 'noopener noreferrer' : `${noOpener ? 'noopener' : ''} ${noReferrer ? 'noreferrer' : ''}`.trim()
              t.p.prefetch = prefetch
              t.p['aria-label'] = ariaLabel || undefined
              t.p.target = noOpener || newTab ? '_blank' : undefined
              t.p.download = linkType === 'download' ? true : undefined

              break
            }
            case 'regular': {
              break
            }
            case 'portal': {
              switch (block.portalType) {
                case 'popover': {
                  const {
                    delay,
                    hasArrow,
                    closeDelay,
                    openOnHover,
                    defaultOpen,
                    modal,
                    side,
                    align,
                    sticky,
                    sideOffset,
                    alignOffset,
                    trackAnchor,
                    arrowPadding,
                    positionMethod,
                    keepMounted,
                  } = block.pops || {}
                  const popPortal: Record<string, unknown> = {}
                  const popPositioner: Record<string, unknown> = {}

                  //Root Props
                  if (hasArrow) pop.p.hasArrow = hasArrow
                  if (defaultOpen) pop.p.defaultOpen = defaultOpen

                  switch (modal) {
                    case 'Block':
                      pop.p.modal = true
                      break
                    case 'Window':
                      pop.p.modal = false
                      break
                    case 'trap-focus':
                      pop.p.modal = 'trap-focus'
                      break
                    default:
                      pop.p.modal = false
                      break
                  }

                  //Trigger Props
                  if (delay) t.p.delay = delay
                  if (closeDelay) t.p.closeDelay = closeDelay
                  if (openOnHover) t.p.openOnHover = openOnHover

                  //Positioner Props
                  if (side) popPositioner.side = side
                  if (align) popPositioner.align = align
                  if (sticky) popPositioner.sticky = sticky
                  if (sideOffset) popPositioner.sideOffset = sideOffset
                  if (alignOffset) popPositioner.alignOffset = alignOffset
                  if (trackAnchor) popPositioner.trackAnchor = trackAnchor
                  if (arrowPadding) popPositioner.arrowPadding = arrowPadding
                  if (positionMethod) popPositioner.positionMethod = positionMethod

                  //Portal Props
                  if (keepMounted) popPortal.keepMounted = keepMounted

                  if (Object.keys(popPortal).length > 0) pop.p = { ...pop.p, popPortal }
                  if (Object.keys(popPositioner).length > 0) pop.p = { ...pop.p, popPositioner }

                  break
                }
                case 'dialog': {
                  const { defaultOpen, dismissible, modal, keepMounted } = block.ds || {}

                  /** Dialog Portal Components Props */
                  const dialogPortal: Record<string, unknown> = {}

                  //Root Props
                  if (defaultOpen) di.p.defaultOpen = defaultOpen
                  di.p.dismissible = Boolean(dismissible)

                  switch (modal) {
                    case 'Block':
                      di.p.modal = true
                      break
                    case 'Window':
                      di.p.modal = false
                      break
                    case 'trap-focus':
                      di.p.modal = 'trap-focus'
                      break
                    default:
                      di.p.modal = false
                      break
                  }

                  //Portal Props
                  if (keepMounted) dialogPortal.keepMounted = keepMounted

                  if (Object.keys(dialogPortal).length > 0) di.p = { ...di.p, dialogPortal }
                  break
                }
              }
              break
            }
          }
          break
        }
        case 'input': {
          const { inputType, inputName, required, autocomplete } = block

          if (inputType) c.p.type = inputType
          if (inputName) c.p.name = inputName
          if (required) c.p.required = required
          if (autocomplete) c.p.autoComplete = autocomplete

          switch (inputType) {
            case 'checkbox': {
              const { checkboxDefault } = block
              if (checkboxDefault) c.p.defaultChecked = checkboxDefault
              if (!cid) c.p.id = inputName
              break
            }
            case 'number': {
              const { numberPlaceholder, numberDefault } = block
              if (numberDefault) c.p.defaultValue = numberDefault
              if (numberPlaceholder) c.p.placeholder = numberPlaceholder
              if (!cid) c.p.id = inputName
              break
            }
            case 'radio': {
              const { radioDefault, radioValue } = block
              if (c.p.autoComplete) delete c.p.autoComplete
              if (radioDefault) c.p.defaultChecked = radioDefault
              if (radioValue) {
                c.p.value = radioValue
                if (!cid) c.p.id = radioValue
              }
              break
            }
            case 'text':
            case 'email':
            case 'textarea': {
              const { textPlaceholder, textDefault } = block
              if (!cid) c.p.id = inputName
              if (textDefault) c.p.defaultValue = textDefault
              if (textPlaceholder) c.p.placeholder = textPlaceholder
              break
            }
          }

          break
        }
        case 'form':
          break
      }
      break
    }
    case 'SimpleTextChild': {
      const { htmlFor } = block
      if (htmlFor) c.p.htmlFor = htmlFor
      break
    }
    case 'RichTextChild': {
      break
    }
    case 'ImageChild': {
      const { image, alt, priority, size, quality, loading, fill, decoding, unoptimized, version } = block
      if (!image || typeof image === 'string') break
      const { blurDataUrl, alt: altFromMedia, sizes } = image

      const width = version ? sizes?.[version]?.width : image.width
      const height = version ? sizes?.[version]?.height : image.height

      c.p.alt = alt || altFromMedia || ''
      c.p.src = version ? sizes?.[version]?.url || image.url : image.url

      if (decoding) c.p.decoding = decoding

      if (priority) c.p.priority = priority
      else if (loading) c.p.loading = loading

      if (!unoptimized) c.p.quality = quality
      else c.p.unoptimized = unoptimized

      c.p.sizes = size
        ? size
        : Object.entries(breakpoints)
            .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
            .join(', ')

      if (block.blur) {
        c.p.placeholder = 'blur'
        c.p.blurDataURL = blurDataUrl
      }

      if (!fill) {
        c.p.height = height
        c.p.width = width
      } else c.p.fill = fill

      break
    }
    case 'VideoChild': {
      const { preload, autoplay, loop, muted, video, disableBlur, time, quality, blur } = block
      if (typeof video === 'string') break
      const { playbackOptions } = video
      if (!playbackOptions) break
      const { playbackId } = playbackOptions[0]

      if (!disableBlur && playbackId) {
        try {
          const { blurDataURL: blurDataURLTemp, aspectRatio } = await createBlurUp(playbackId, {
            time: time ?? 0,
            blur: blur ?? 20,
            quality: quality ?? 1,
          })
          c.p.poster = blurDataURLTemp
          c.p.style = { aspectRatio }
        } catch (error) {
          console.warn('Failed to generate video blurup image.')
          console.log(error)
        }
      }

      c.p.streamType = 'on-demand'
      if (loop) c.p.loop = loop
      if (preload) c.p.preload = preload
      if (autoplay) {
        c.p.muted = true
        c.p.autoPlay = true
        c.p.playsInline = true
      }
      if (muted) c.p.muted = muted
      if (playbackId) c.p.playbackId = playbackId

      break
    }
    case 'IconChild': {
      if (block.ariaHidden) c.p['aria-hidden'] = block.ariaHidden
      break
    }
    case 'SVGChild': {
      const { viewBox, contents, fill } = block
      c.p.viewBox = viewBox
      if (fill) c.p.fill = fill
      c.p.dangerouslySetInnerHTML = { __html: contents }
      if (block.ariaHidden) c.p['aria-hidden'] = block.ariaHidden
      break
    }
  }

  return { c, t, po: { b, di, pop } }
}
