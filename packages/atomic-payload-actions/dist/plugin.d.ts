import type { Plugin, Block } from 'payload';
export interface ActionsPluginOptions {
    enabled?: boolean;
    /** The action block configs to register on the Payload config's blocks array. */
    blocks?: Block[];
}
/**
 * Registers the supplied action blocks on the Payload config.
 *
 * NOTE: the action blocks themselves currently live in the consuming template.
 * Once the dependency tree on template-only fields (KeySelectField,
 * ChangeKeyField, SetDataField, PerformSelectField) is also extracted, those
 * blocks will move into this package and `blocks` will default to a curated
 * set.
 */
export declare const actionsPlugin: (opts?: ActionsPluginOptions) => Plugin;
export default actionsPlugin;
//# sourceMappingURL=plugin.d.ts.map