import 'server-only';
import type { GCFunction } from '@pro-laico/ap-types';
/** Gets the active icon sets icons array. Specifically only the name and icon reference id of each icon. */
export declare const getCachedIconSet: GCFunction<'iconSet'>;
/** Gets the SVG string that matches the passed in icon name, from the active icon set collection. */
export declare const getCachedIconByName: GCFunction<'icon'>;
/** Formats the icon set into a list of options for the icon select field. */
export declare const getCachedIconOptions: GCFunction<'icon-options'>;
//# sourceMappingURL=getIcon.d.ts.map