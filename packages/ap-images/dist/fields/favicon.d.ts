import type { UploadField } from 'payload';
import type { APFunction } from '@pro-laico/ap-apf'
type FaviconFieldType = (args?: Partial<UploadField> & {
    apf?: APFunction[];
}) => UploadField;
export declare const FaviconField: FaviconFieldType;
export {};
//# sourceMappingURL=favicon.d.ts.map