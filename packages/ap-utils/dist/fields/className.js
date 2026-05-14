import { APField } from '@pro-laico/atomic-payload-apf';
import deepMerge from '../utilities/deepMerge';
export const ClassNameField = (args) => {
    let namePrefix = '';
    let rest;
    if (args) {
        const { namePrefix: namePrefixArg, ...restArg } = args;
        namePrefix = namePrefixArg || '';
        rest = restArg;
    }
    const baseField = {
        type: 'textarea',
        apf: ['classes'],
        name: `${namePrefix}ClassName`,
        docLink: 'https://atomicpayload.com/fields/classname',
        admin: { description: 'Add atomic style classes or shortcuts here.' },
    };
    return APField(deepMerge(baseField, rest));
};
//# sourceMappingURL=className.js.map