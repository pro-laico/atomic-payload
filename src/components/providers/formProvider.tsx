'use client'
import type { FullFormContext } from '@/ts/types'
import React, { createContext, useContext } from 'react'

const FormContext = createContext<FullFormContext>({ formResponse: null })

export const useFormContext = () => useContext(FormContext)

export const FormContextProvider = ({ children, formResponse }: { children: React.ReactNode } & FullFormContext) => {
  return <FormContext.Provider value={{ formResponse }}>{children}</FormContext.Provider>
}
