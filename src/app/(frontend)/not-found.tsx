'use server'
import React from 'react'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import getCached from '@/utilities/get/cache/react'
import { RenderChildren } from '@/components/child/renderChildren'

//KNOWN ISSUE: 404 Page Does not display in production environment when directly viewing the /404 route.
//Works in dev though, and works correctly when someone navigates to a non-existent page.
export default async function NotFound() {
  const { isEnabled: draft } = await draftMode()
  const pages = await getCached('pages', draft)
  const page = await getCached('page', '/404', draft, pages)

  if (page) {
    return (
      <main className={page.mainClassName || undefined}>
        <RenderChildren blocks={page.children} />
      </main>
    )
  }

  return (
    <main
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '9rem',
            fontWeight: 800,
            color: '#d1d5db', // text-gray-300
            userSelect: 'none',
            margin: 0,
          }}
        >
          404
        </h1>
        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#374151', // text-gray-700
          }}
        >
          Oops! Page not found.
        </p>
        <p
          style={{
            marginTop: '0.5rem',
            color: '#6b7280', // text-gray-500
          }}
        >
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              borderRadius: '0.5rem',
              backgroundColor: 'black',
              padding: '0.75rem 1.5rem',
              color: 'white',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
