import type { FieldHook } from 'payload';
import type { APFunction } from '@pro-laico/ap-apf';
export declare const virtualAPFBeforeChangeFieldHook: FieldHook;
export declare const virtualAPFAfterReadFieldHook: FieldHook;
/**
 * Field hook that marks a document as modified when arrays change (shallow comparison).
 * Only checks array length.
 *
 * @fields array
 * @param apf - The type of change to set in context. {@link APFunctions}
 */
export declare const onArraySetAPFShallow: (apf: APFunction[]) => FieldHook;
/**
 * Field hook that marks a document as modified when the upload field changes.
 *
 * @fields upload
 * @param apf - The type of change to set in context. {@link APFunctions}
 */
export declare const onUploadSetAPF: (apf: APFunction[]) => FieldHook;
//# sourceMappingURL=apf.d.ts.map