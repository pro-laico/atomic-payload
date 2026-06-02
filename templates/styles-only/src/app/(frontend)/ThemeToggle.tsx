'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/** Flips the `dark` class on <html>, which swaps every design-set token between
 *  its light and dark value (the generated preflight defines both). A concrete
 *  demonstration that the tokens carry two values, not one. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'
  return (
    <button type="button" className="demo-btn demo-btn--danger" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {mounted ? `Theme: ${isDark ? 'dark' : 'light'} — switch to ${isDark ? 'light' : 'dark'}` : 'Toggle theme'}
    </button>
  )
}
