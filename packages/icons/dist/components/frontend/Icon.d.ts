import React from 'react';
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
    /**
     * Icon name as defined in the active `IconSet`'s `iconsArray` (each entry's
     * kebab-cased `name` field). Resolved server-side via the cached icon/iconSet
     * getters so revalidating either tag invalidates only this `<svg>`, not the
     * surrounding page.
     */
    name: string;
    /**
     * Optional fallback SVG string used when `name` doesn't match any icon in
     * the active set. Defaults to a small inline warning glyph.
     */
    fallback?: string;
}
/**
 * Renders a CMS-managed icon by name. Server component — looks up the active
 * `IconSet`, finds the icon entry matching `name`, and inlines its `<svg>`
 * with its intrinsic attributes (viewBox, fill, etc.) merged with any JSX
 * props you pass.
 *
 * Props you pass on the JSX node ALWAYS win over the SVG source's intrinsic
 * attributes, so `className`, `style`, `width`, etc. override as expected.
 *
 * @example
 * ```tsx
 * import { Icon } from '@pro-laico/icons/Icon'
 *
 * <Icon name="arrow-right" />
 * <Icon name="arrow-right" className="size-6 text-primary" />
 * <Icon name="logo" fallback={myCustomSvgString} />
 * ```
 */
export declare const Icon: React.FC<IconProps>;
export default Icon;
//# sourceMappingURL=Icon.d.ts.map