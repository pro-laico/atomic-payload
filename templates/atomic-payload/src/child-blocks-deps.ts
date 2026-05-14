/**
 * Stable imports for @pro-laico/atomic-payload-child-blocks. Only template-side
 * symbols that the package still needs (the multi-package ClassNameField and
 * UI component paths whose renderers live in the template) are re-exported
 * here. Self-contained fields, tabs, and renderers now live inside the
 * child-blocks package itself.
 */
export { ClassNameField } from './fields/className'
export { IconSelectPath, AtomicPath, SimpleTextLabelPath } from './ui'
// Client-only re-exports (`useActions` hooks, `FormContextProvider`) live in
// `./child-blocks-deps-client`. Keeping them out of this server-side barrel
// prevents `payload generate:types` (run under `--conditions=react-server`)
// from loading client modules that pull `createContext` out of `react`.
// `getCached` is similarly NOT re-exported here — `server-only` would poison
// any client component that imports this barrel.
export { default as Warning } from './ui/assets/warningIcon'
