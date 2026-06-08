import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { SVGProps } from 'react'
import { AtomicLogo } from '@/components/logo'
import { githubUrl } from '@/lib/shared'

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.56v-2.1c-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.34-1.72-1.34-1.72-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.8 1.27 3.49.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.3-5.47-5.8 0-1.28.47-2.33 1.23-3.15-.12-.3-.53-1.5.12-3.13 0 0 1-.31 3.3 1.2a11.6 11.6 0 0 1 6 0c2.3-1.51 3.3-1.2 3.3-1.2.65 1.63.24 2.83.12 3.13.77.82 1.23 1.87 1.23 3.15 0 4.51-2.81 5.5-5.49 5.79.43.36.81 1.07.81 2.17v3.22c0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  )
}

const features: { title: string; description: string; href: string }[] = [
  {
    title: 'Atomic Blocks',
    description: 'Build entire components from recursive child blocks — then copy, paste and duplicate to reuse them with ease.',
    href: '/docs/features/atomic-blocks',
  },
  {
    title: 'Tailwind in the Admin',
    description: 'Write Tailwind classes directly in the Payload dashboard for custom-styled blocks anywhere you need them.',
    href: '/docs/features/styles',
  },
  {
    title: 'Design Sets & Tokens',
    description: 'Reusable colors, sizes, animations and more. Swap a whole design set to restyle the entire site instantly.',
    href: '/docs/features/styles',
  },
  {
    title: 'Actions',
    description: 'Add interactivity to any block — open dialogs and popovers, toggle dark mode, submit forms, and more.',
    href: '/docs/features/actions',
  },
  {
    title: 'Custom Fonts',
    description: 'next/font local fonts across sans, serif, mono and display roles, all managed from the CMS.',
    href: '/docs/features/fonts',
  },
  {
    title: 'UnoCSS Shortcuts',
    description: 'Group styles into reusable shortcuts powered by UnoCSS, shared across your whole site.',
    href: '/docs/features/styles',
  },
  {
    title: 'Icon Library',
    description: 'Upload and optimize custom SVG icons, organize them into icon sets, and render them anywhere.',
    href: '/docs/features/icons',
  },
  {
    title: 'Forms with SVR',
    description: 'Fully custom forms with per-field Sanitation, Validation and Rate Limiting blocks.',
    href: '/docs/features/forms',
  },
  {
    title: 'Tracking',
    description: 'First-class integrations for Vercel Analytics, Google Tag Manager and PostHog.',
    href: '/docs/features/tracking',
  },
  {
    title: 'Video & Images',
    description: 'Optimized image uploads plus Mux video integration for upload and streaming.',
    href: '/docs/features/media',
  },
]

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand/10 to-transparent" />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:py-32">
          <AtomicLogo className="mb-6 size-14 text-brand" />
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">An Open Source Website Builder</h1>
          <p className="mt-6 max-w-2xl text-lg text-fd-muted-foreground">
            Build your website directly in Payload CMS's dashboard, without ever touching real code — a hard separation between front-end and backend
            that makes best practices and great performance the default.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 font-medium text-neutral-950 transition-opacity hover:opacity-90"
            >
              Get Started <ArrowRight className="size-4" />
            </Link>
            <a
              href={githubUrl}
              className="inline-flex items-center gap-2 rounded-full border border-fd-border px-6 py-2.5 font-medium transition-colors hover:bg-fd-muted"
            >
              <GithubIcon className="size-4" /> GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Build user interfaces with ease</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-fd-muted-foreground">
          Every part of your site — blocks, styles, fonts, icons, forms and more — managed from one dashboard.
        </p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group flex flex-col rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-brand/50"
            >
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 flex-1 text-sm text-fd-muted-foreground">{feature.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-fd-primary">
                Learn more <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center text-sm text-fd-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <AtomicLogo className="size-5 text-brand" />
            <span>Built by Atomic Payload at Pro Laico</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={githubUrl} className="transition-colors hover:text-fd-foreground">
              GitHub
            </a>
            <span className="text-fd-muted-foreground/70">Not affiliated with Payload CMS in any capacity</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
