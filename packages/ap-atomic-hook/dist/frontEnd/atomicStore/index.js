'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useStore } from 'zustand';
import { createContext, useState, useContext } from 'react';
import { createAtomicStore } from './createStore';
export const AtomicStoreContext = createContext(undefined);
export const AtomicStoreProvider = ({ children, initialState }) => {
    const [store] = useState(() => createAtomicStore(initialState));
    return _jsx(AtomicStoreContext.Provider, { value: store, children: children });
};
export const useAtomicStore = (selector) => {
    const atomicStoreContext = useContext(AtomicStoreContext);
    if (!atomicStoreContext)
        throw new Error(`useAtomicStore must be used within AtomicStoreProvider`);
    return useStore(atomicStoreContext, selector);
};
export { createAtomicStore };
//# sourceMappingURL=index.js.map