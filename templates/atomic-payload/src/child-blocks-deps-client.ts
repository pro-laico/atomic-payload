/**
 * Client-only re-exports for @pro-laico/atomic-payload-child-blocks. Anything
 * that pulls in React context, hooks, or a `'use client'` directive lives here
 * so server-side consumers of the sibling `./child-blocks-deps` barrel are not
 * forced to load client-only code at config-build / generate:types time.
 */
export * from './hooks/frontEnd/useActions'
export { FormContextProvider } from './components/providers/formProvider'
