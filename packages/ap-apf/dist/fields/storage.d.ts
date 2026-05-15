import { CheckboxField } from 'payload';
import { APFunction } from '@pro-laico/ap-apf';
/** Atomic Payload Functions Registry */
export declare const apfRegistry: Record<APFunction, string>;
/**
 * Generate APF fields for specific APFunctions
 * @param apFunctions - Array of APFunctions to include
 * @returns Array of checkbox fields for the specified APFunctions
 */
export declare const generateAPFFields: (apFunctions: APFunction[]) => CheckboxField[];
/**Sets all APF fields*/
export declare const apfStorage: CheckboxField[];
export default apfStorage;
//# sourceMappingURL=storage.d.ts.map