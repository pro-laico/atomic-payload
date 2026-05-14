import 'server-only';
import type { AllTags, PromiseTagGroup, RArgs, RReturns } from '@pro-laico/ap-types';
/** Used by the admin ui site triggers component to revalidate all draft or published pages */
declare function revalidateTag<T extends PromiseTagGroup>(...args: RArgs<T>): RReturns<T>;
declare function revalidateTag<T extends Exclude<AllTags, PromiseTagGroup>>(...args: RArgs<T>): RReturns<T>;
export { revalidateTag };
//# sourceMappingURL=revalidateTag.d.ts.map