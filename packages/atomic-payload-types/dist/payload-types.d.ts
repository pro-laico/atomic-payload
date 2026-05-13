/**
 * Stubs for every name that comes from a Payload-generated `payload-types.ts`.
 *
 * Consumers fill these in by augmenting the `PayloadAugment` interface — see the
 * package README. Without augmentation, references resolve to permissive defaults
 * (`any`, `any[]`, `string`) so the package itself still compiles cleanly.
 */
/**
 * Index interface that consumers extend via `declare module` to supply concrete
 * shapes from their generated `payload-types.ts`.
 */
export interface PayloadAugment {
}
type Get<K extends string, Fallback> = PayloadAugment extends Record<K, infer T> ? T : Fallback;
/**
 * Default fallbacks. Picked so the package compiles cleanly without augmentation —
 * `Config['collections']` indexes by `string`, blocks have a `blockType` discriminator,
 * runners/attributers have a `type` discriminator, etc.
 */
type DefaultRecord = Record<string, any>;
type DefaultConfig = {
    collections: Record<string, any>;
    globals: Record<string, any>;
    blocks: Record<string, any>;
    [key: string]: any;
};
type DefaultBlock = {
    blockType: string;
    [k: string]: any;
};
type DefaultActionFn = {
    type: string;
    [k: string]: any;
};
export type Config = Get<'Config', DefaultConfig>;
export type Page = Get<'Page', DefaultRecord>;
export type Header = Get<'Header', DefaultRecord>;
export type Footer = Get<'Footer', DefaultRecord>;
export type Form = Get<'Form', DefaultRecord>;
export type Font = Get<'Font', DefaultRecord>;
export type Icon = Get<'Icon', DefaultRecord>;
export type IconSet = Get<'IconSet', DefaultRecord>;
export type Image = Get<'Image', DefaultRecord>;
export type Tracking = Get<'Tracking', DefaultRecord>;
export type DesignSet = Get<'DesignSet', DefaultRecord>;
export type ImageChild = Get<'ImageChild', DefaultRecord>;
export type ShortcutSet = Get<'ShortcutSet', DefaultRecord>;
export type SiteMetaDatum = Get<'SiteMetaDatum', DefaultRecord>;
export type FormSubmission = Get<'FormSubmission', DefaultRecord>;
export type StoredAtomicForm = Get<'StoredAtomicForm', DefaultRecord>;
export type ChildBlocks = Get<'ChildBlocks', DefaultBlock[]>;
export type ActionBlocks = Get<'ActionBlocks', DefaultBlock[]>;
export type Runners = Get<'Runners', DefaultActionFn[]>;
export type Attributers = Get<'Attributers', DefaultActionFn[]>;
export type Attributer = Get<'Attributer', DefaultActionFn>;
export type AllActions = Get<'AllActions', DefaultRecord>;
export type StoredAtomicActions = Get<'StoredAtomicActions', DefaultRecord>;
export type FormRateLimitBlocks = Get<'FormRateLimitBlocks', DefaultBlock[]>;
export type FormSanitationBlocks = Get<'FormSanitationBlocks', DefaultBlock[]>;
export type FormValidationBlocks = Get<'FormValidationBlocks', DefaultBlock[]>;
export type InputSanitationBlocks = Get<'InputSanitationBlocks', DefaultBlock[]>;
export type InputValidationBlocks = Get<'InputValidationBlocks', DefaultBlock[]>;
export type ChildBlockType = Get<'ChildBlockType', string>;
export type ActionBlockType = Get<'ActionBlockType', string>;
export type RunnerType = Get<'RunnerType', string>;
export type AttributerType = Get<'AttributerType', string>;
export type AtomicInputTypes = Get<'AtomicInputTypes', string>;
export type AtomicButtonTypes = Get<'AtomicButtonTypes', string>;
export type AtomicChildVariants = Get<'AtomicChildVariants', string>;
export type AtomicButtonPortalTypes = Get<'AtomicButtonPortalTypes', string>;
export type FormRateLimitBlockType = Get<'FormRateLimitBlockType', string>;
export type FormSanitationBlockType = Get<'FormSanitationBlockType', string>;
export type FormValidationBlockType = Get<'FormValidationBlockType', string>;
export type InputValidationBlockType = Get<'InputValidationBlockType', string>;
export type InputSanitationBlockType = Get<'InputSanitationBlockType', string>;
export type CollectionThatUsesCSSProcessorSlug = Get<'CollectionThatUsesCSSProcessorSlug', string>;
export type CollectionWithStoredAtomicClassesSlug = Get<'CollectionWithStoredAtomicClassesSlug', string>;
export type AtomicRegistry = Get<'AtomicRegistry', Record<string, any>>;
export {};
//# sourceMappingURL=payload-types.d.ts.map