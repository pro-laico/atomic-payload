// Side-effect: augments Payload's RequestContext with storedAtomicClasses.
import './payload'

// Hand-written types only â€” schema stubs live at './payload-augment' and
// reach consumers via the `@pro-laico/atomic/hook/schema` subpath, so
// type names (`Header`, `Footer`, â€¦) never collide with value exports.
export type * from './store'
export type * from './css'
