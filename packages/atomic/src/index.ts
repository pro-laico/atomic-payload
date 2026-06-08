// Root barrel for @pro-laico/atomic. Re-exports the three block plugins, the children
// field users add to a collection, and the ready-made save-time hook. For finer-grained
// imports prefer the namespace subpaths: `@pro-laico/atomic/{actions,hook,forms,children}`
// and their sub-subpaths declared in this package's `exports` map.

export { formsPlugin } from './forms'

export { ChildrenBlocksField, childBlocksPlugin } from './children'

export { actionsPlugin } from './actions'

export { atomicHook } from './hook'
