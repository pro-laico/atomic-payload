import type { APFunction } from '@pro-laico/core';
import type { UploadField } from 'payload';
type FaviconFieldType = (args?: Partial<UploadField> & {
    apf?: APFunction[];
}) => UploadField;
export declare const FaviconField: FaviconFieldType;
export {};
//# sourceMappingURL=favicon.d.ts.map