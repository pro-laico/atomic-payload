import deepMerge from '../../utilities/deepMerge';
import { APField } from './index';
/**
 * Reusable Atomic Payload `active` checkbox field. Wires the `active` APF flag
 * and ships with sensible admin defaults.
 */
export const ActiveField = (args) => {
    const baseField = {
        type: 'checkbox',
        apf: ['active'],
        name: 'active',
        required: true,
        index: true,
        admin: { style: { maxWidth: '100px', alignSelf: 'center' } },
    };
    return APField(deepMerge(baseField, args));
};
//# sourceMappingURL=active.js.map