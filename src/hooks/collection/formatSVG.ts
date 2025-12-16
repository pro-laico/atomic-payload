'use server'
import { Icon } from '@/ts/types'
import type { CollectionBeforeChangeHook } from 'payload'

export const formatSvg = async (icon: Partial<Icon>, svgData: Buffer): Promise<Partial<Icon>> => {
  try {
    // Dynamic imports to ensure these only load server-side
    const [{ optimize }, { svgPathBbox }] = await Promise.all([import('svgo'), import('svg-path-bbox')])

    const svg = svgData.toString('utf-8')
    const originalSize = svgData.length

    const hasTransforms = svg.includes('transform=')
    const hasClipPaths = svg.includes('clip-path=') || svg.includes('<clipPath')
    if (hasTransforms || hasClipPaths) {
      console.warn('Unsupported SVG features:', { hasTransforms, hasClipPaths })
      return icon
    }

    const optimized = optimize(svg, {
      path: 'input.svg',
      multipass: true,
      plugins: [
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

    // Round viewBox coordinates to 1 decimal place
    svgStr = svgStr.replace(/viewBox="([^"]+)"/g, (match, viewBox) => {
      const coords = viewBox
        .split(' ')
        .map((coord: string) => {
          return isNaN(parseFloat(coord)) ? coord : parseFloat(coord).toFixed(1)
        })
        .join(' ')
      return `viewBox="${coords}"`
    })

    // Extract paths
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
          console.warn('Failed to calculate path bounds:', e)
        }
      }

      if (minX !== Infinity && minY !== Infinity && maxX !== -Infinity && maxY !== -Infinity) {
        const width = maxX - minX
        const height = maxY - minY

        // Square viewBox with minimal padding - just enough to center the content
        const side = Math.max(width, height)
        const centerX = minX + width / 2
        const centerY = minY + height / 2
        const newViewBox = `${(centerX - side / 2).toFixed(1)} ${(centerY - side / 2).toFixed(1)} ${side.toFixed(1)} ${side.toFixed(1)}`

        // Replace or insert viewBox
        svgStr = svgStr.includes('viewBox=')
          ? svgStr.replace(/viewBox="[^"]+"/, `viewBox="${newViewBox}"`)
          : svgStr.replace('<svg', `<svg viewBox="${newViewBox}"`)
      }
    }

    const finalSize = Buffer.from(svgStr).length
    const reduction = originalSize - finalSize
    const reductionPercentage = ((reduction / originalSize) * 100).toFixed(1)
    const optimizedString = `SVG optimized: ${originalSize} to ${finalSize} bytes (${reductionPercentage}% reduction)`
    console.info(optimizedString)

    return { ...icon, svgString: svgStr, optimized: optimizedString, filesize: finalSize }
  } catch (error) {
    console.error('Error processing SVG:', error)
    return icon
  }
}

export const formatSVGHook: CollectionBeforeChangeHook<Icon> = async ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (data?.filename && req.file) {
      try {
        return await formatSvg(data, req.file.data)
      } catch (error) {
        console.warn('Error in formatSVGHook:', error)
        return data
      }
    }
  }
  return data
}
