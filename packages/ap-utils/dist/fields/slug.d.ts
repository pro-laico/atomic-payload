import type { CheckboxField, TextField } from 'payload';
type Overrides = {
    slugOverrides?: Partial<TextField>;
    checkboxOverrides?: Partial<CheckboxField>;
};
/** Factory for a paired slug + slugLock field set with the standard
 *  `formatSlugHook` wired up. `slugPath` is the Payload admin component path
 *  (e.g. '@/ui/fields/slug') the host project provides for the custom Slug UI;
 *  consumers can also pass full admin overrides via `slugOverrides`. */
export declare const slugField: (slugPath: string, fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField];
export {};
//# sourceMappingURL=slug.d.ts.map