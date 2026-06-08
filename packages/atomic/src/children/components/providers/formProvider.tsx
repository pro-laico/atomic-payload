'use client'
import type React from 'react'
import { createContext, useContext } from 'react'

import type { FullFormContext } from '@pro-laico/atomic/actions'

const FormContext = createContext<FullFormContext>({ formResponse: null })

export const useFormContext = () => useContext(FormContext)

export const FormContextProvider = ({ children, formResponse }: { children: React.ReactNode } & FullFormContext) => {
  return <FormContext.Provider value={{ formResponse }}>{children}</FormContext.Provider>
}
