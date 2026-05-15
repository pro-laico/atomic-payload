// Side-effect: augments Payload's RequestContext with storedAtomicClasses.
import './payload'

// Hand-written types only — schema stubs live at './payload-augment' and
// reach consumers via the `@pro-laico/ap-atomic-hook/schema` subpath, so
// type names (`Header`, `Footer`, …) never collide with value exports.
export type * from './store'
export type * from './css'
