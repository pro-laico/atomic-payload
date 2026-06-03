import type { TextFieldSingleValidation } from 'payload';
/**
 * Require a text field only when its enable-flag (a toggle at the document root)
 * is on. Payload enforces `required: true` even for fields hidden by
 * `admin.condition`, so a plain `required` on a provider field would block
 * saving the `Tracking` global whenever that provider is disabled. This enforces
 * the requirement exactly when the provider is actually enabled.
 */
export declare const requiredWhenEnabled: (enableFlag: string, message: string) => TextFieldSingleValidation;
//# sourceMappingURL=validators.d.ts.map