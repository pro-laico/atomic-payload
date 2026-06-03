import 'server-only';
import type { Icon } from '@pro-laico/icons/schema';
import type { CollectionBeforeChangeHook, Payload } from 'payload';
export declare const formatSvg: (icon: Partial<Icon>, svgData: Buffer, logger: Payload["logger"]) => Promise<Partial<Icon>>;
export declare const formatSVGHook: CollectionBeforeChangeHook;
//# sourceMappingURL=formatSVG.d.ts.map