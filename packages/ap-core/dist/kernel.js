/**
 * Kernel of the per-package PayloadAugment system.
 *
 * Domain packages (ap-actions, ap-icons, ap-site, …) define their own schema
 * stubs as `export type X = Get<'X', Default>` against the single `PayloadAugment`
 * interface declared here. Consumer projects fill the interface in once via
 * module augmentation, and every package's stubs resolve to the project's
 * concrete shapes.
 */
export {};
//# sourceMappingURL=kernel.js.map