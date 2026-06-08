import 'server-only'
import type { Icon } from '@pro-laico/icons/schema'
import type { CollectionBeforeChangeHook, Payload } from 'payload'
import type { PluginConfig } from 'svgo'

// Strip executable content from untrusted SVG uploads before they're stored and
// later inlined via dangerouslySetInnerHTML: <script> elements + on* event
// handlers. svgo 3.x has no `removeScripts`, so compose builtins.
const sanitizePlugins: PluginConfig[] = ['removeScriptElement', { name: 'removeAttrs', params: { attrs: ['on.*'] } }]

// svgo has no builtin for javascript: URLs, so scrub (xlink:)href values from
// the serialized output as a final pass.
const stripDangerousUrls = (svg: string): string => svg.replace(/\s(?:xlink:)?href\s*=\s*(["'])\s*javascript:[^"']*\1/gi, '')

export const formatSvg = async (icon: Partial<Icon>, svgData: Buffer, logger: Payload['logger']): Promise<Partial<Icon>> => {
  try {
    const [{ optimize }, { svgPathBbox }] = await Promise.all([import('svgo'), import('svg-path-bbox')])

    const svg = svgData.toString('utf-8')
    const originalSize = svgData.length

    const hasTransforms = svg.includes('transform=')
    const hasClipPaths = svg.includes('clip-path=') || svg.includes('<clipPath')
    if (hasTransforms || hasClipPaths) {
      logger.warn({ msg: 'Unsupported SVG features; skipping optimization (scripts still stripped)', hasClipPaths, hasTransforms })
      // Even when we skip optimization we MUST strip scripts/event handlers, because
      // svgString is later inlined via dangerouslySetInnerHTML for every visitor.
      const sanitized = stripDangerousUrls(optimize(svg, { multipass: false, plugins: sanitizePlugins }).data)
      return { ...icon, optimized: 'Skipped optimization (transform/clip-path present); scripts stripped', svgString: sanitized }
    }

    const optimized = optimize(svg, {
      path: 'input.svg',
      multipass: true,
      plugins: [
        // Strip <script> elements + on* handlers first so nothing downstream re-introduces them.
        ...sanitizePlugins,
        'preset-default',
        'convertStyleToAttrs',
        'removeDimensions',
        {
          name: 'removeAttrs',
          params: {
            attrs: [
              'fill',
              'stroke',
              'stroke-width',
              'stroke-linecap',
              'stroke-linejoin',
              'stroke-miterlimit',
              'stroke-dasharray',
              'stroke-dashoffset',
            ],
          },
        },
        { name: 'cleanupIds', params: { minify: true, remove: false } },
        { name: 'mergePaths', params: { force: false, noSpaceAfterFlags: true } },
        { name: 'cleanupNumericValues', params: { floatPrecision: 1, leadingZero: true } },
        { name: 'removeUnknownsAndDefaults', params: { keepAriaAttrs: true, keepDataAttrs: true, keepRoleAttr: true } },
        { name: 'addAttributesToSVGElement', params: { attributes: [{ fill: 'currentColor' }, { stroke: 'currentColor' }] } },
        { name: 'convertTransform', params: { convertToShorts: true, degPrecision: 1, floatPrecision: 1, transformPrecision: 1 } },
        {
          name: 'convertPathData',
          params: { floatPrecision: 1, leadingZero: true, noSpaceAfterFlags: true, removeUseless: true, straightCurves: true, transformPrecision: 1 },
        },
        {
          name: 'sortAttrs',
          params: {
            order: [
              'id',
              'class',
              'style',
              'x',
              'y',
              'width',
              'height',
              'viewBox',
              'fill',
              'stroke',
              'stroke-width',
              'stroke-linecap',
              'stroke-linejoin',
              'stroke-miterlimit',
              'stroke-dasharray',
              'stroke-dashoffset',
              'd',
              'transform',
            ],
          },
        },
      ],
      js2svg: { pretty: true, indent: 2, eol: 'lf' },
    })

    let svgStr = optimized.data

    svgStr = svgStr.replace(/viewBox="([^"]+)"/g, (match, viewBox) => {
      const coords = viewBox
        .split(' ')
        .map((coord: string) => {
          return Number.isNaN(parseFloat(coord)) ? coord : parseFloat(coord).toFixed(1)
        })
        .join(' ')
      return `viewBox="${coords}"`
    })

    const paths = Array.from(svgStr.matchAll(/<path[^>]*d="([^"]+)"/g))

    if (paths.length) {
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity

      for (const [, d] of paths) {
        try {
          const [x1, y1, x2, y2] = svgPathBbox(d)
          minX = Math.min(minX, x1)
          minY = Math.min(minY, y1)
          maxX = Math.max(maxX, x2)
          maxY = Math.max(maxY, y2)
        } catch (e) {
          logger.warn({ msg: 'Failed to calculate path bounds', err: e })
        }
      }

      if (minX !== Infinity && minY !== Infinity && maxX !== -Infinity && maxY !== -Infinity) {
        const width = maxX - minX
        const height = maxY - minY

        const side = Math.max(width, height)
        const centerX = minX + width / 2
        const centerY = minY + height / 2
        const newViewBox = `${(centerX - side / 2).toFixed(1)} ${(centerY - side / 2).toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}`

        svgStr = svgStr.includes('viewBox=')
          ? svgStr.replace(/viewBox="[^"]+"/, `viewBox="${newViewBox}"`)
          : svgStr.replace('<svg', `<svg viewBox="${newViewBox}"`)
      }
    }

    svgStr = stripDangerousUrls(svgStr)

    const finalSize = Buffer.from(svgStr).length
    const reduction = originalSize - finalSize
    const reductionPercentage = ((reduction / originalSize) * 100).toFixed(1)
    const optimizedString = `SVG optimized: ${originalSize} to ${finalSize} bytes (${reductionPercentage}% reduction)`
    logger.info(optimizedString)

    return { ...icon, filesize: finalSize, optimized: optimizedString, svgString: svgStr }
  } catch (error) {
    logger.error({ msg: 'Error processing SVG', err: error })
    return icon
  }
}

export const formatSVGHook: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (data?.filename && req.file) {
      try {
        return await formatSvg(data, req.file.data, req.payload.logger)
      } catch (error) {
        req.payload.logger.warn({ msg: 'Error in formatSVGHook', err: error })
        return data
      }
    }
  }
  return data
}
