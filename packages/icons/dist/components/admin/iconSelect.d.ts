import type { IconSetReturn } from '@pro-laico/core'
import type { SelectFieldServerComponent } from 'payload';
/** `getCached` from the app (e.g. `@/utilities/get/cache/react`). */
export type IconSelectGetCached = (tag: 'iconSet' | 'icon-options', draft: boolean, iconSet?: IconSetReturn | null | undefined) => Promise<unknown>;
export declare function createIconSelect(getCached: IconSelectGetCached): SelectFieldServerComponent;
//# sourceMappingURL=iconSelect.d.ts.map