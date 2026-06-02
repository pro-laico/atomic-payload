/**
 * Input data for the demo `designSet` + `shortcutSet`.
 *
 * These are the *authored* fields only — the colors, tokens, breakpoints, prose
 * colors, and class names a user would type into the admin. The heavy lifting
 * (`tokenStorage`, `preflightStorage`, the prose-* storage maps) is computed by
 * `processDesignSet`, which runs automatically inside the standalone `cssHook`
 * on every save. So seeding is just `payload.create` with the fields below — the
 * hook turns them into the stored stylesheet.
 */

/** Color tokens. Each becomes a `--name` CSS variable (light in `:root`, dark in
 *  `.dark`) and a UnoCSS `bg-name` / `text-name` / `border-name` utility. */
export const sampleColors = [
  { name: 'background', light: 'oklch(1 0 0)', dark: 'oklch(0.145 0 0)' },
  { name: 'foreground', light: 'oklch(0.145 0 0)', dark: 'oklch(0.985 0 0)' },
  { name: 'card', light: 'oklch(0.985 0 0)', dark: 'oklch(0.205 0 0)' },
  { name: 'card-foreground', light: 'oklch(0.145 0 0)', dark: 'oklch(0.985 0 0)' },
  { name: 'primary', light: 'oklch(0.205 0 0)', dark: 'oklch(0.922 0 0)' },
  { name: 'primary-foreground', light: 'oklch(0.985 0 0)', dark: 'oklch(0.205 0 0)' },
  { name: 'secondary', light: 'oklch(0.97 0 0)', dark: 'oklch(0.269 0 0)' },
  { name: 'secondary-foreground', light: 'oklch(0.205 0 0)', dark: 'oklch(0.985 0 0)' },
  { name: 'muted', light: 'oklch(0.97 0 0)', dark: 'oklch(0.269 0 0)' },
  { name: 'muted-foreground', light: 'oklch(0.556 0 0)', dark: 'oklch(0.708 0 0)' },
  { name: 'accent', light: 'oklch(0.97 0 0)', dark: 'oklch(0.269 0 0)' },
  { name: 'accent-foreground', light: 'oklch(0.205 0 0)', dark: 'oklch(0.985 0 0)' },
  { name: 'destructive', light: 'oklch(0.577 0.245 27.325)', dark: 'oklch(0.704 0.191 22.216)' },
  { name: 'border', light: 'oklch(0.922 0 0)', dark: 'oklch(1 0 0 / 10%)' },
  { name: 'ring', light: 'oklch(0.708 0 0)', dark: 'oklch(0.556 0 0)' },
  { name: 'success', light: 'oklch(0.3 0.15 140)', dark: 'oklch(0.9 0.1 140)' },
  { name: 'brand-primary', light: 'oklch(87.62% 0.240 148.61)', dark: 'oklch(87.62% 0.240 148.61)' },
  { name: 'brand-secondary', light: 'oklch(73.03% 0.052 183.44)', dark: 'oklch(73.03% 0.052 183.44)' },
]

export const sampleDesignSet = {
  active: true,
  title: 'Demo Design Set',
  _status: 'published' as const,

  minify: false,
  defaultTheme: 'dark' as const,

  htmlClassName: 'nice-scrollbar',
  bodyClassName: 'antialiased',
  wrapperClassName: 'bg-background relative flex min-h-svh flex-col',

  defaults: { spacing: '0.25rem', radius: '0.625rem' },

  variables: [],
  colors: sampleColors,
  aria: [{ value: 'invalid' }],

  breakpoint: [
    { name: '3xl', value: '100rem' },
    { name: '4xl', value: '125rem' },
  ],
  spacing: [{ name: 'hh', value: 'calc(var(--spacing)*14)' }],
  radius: [
    { name: 'sm', value: 'calc(var(--radius) - 4px)' },
    { name: 'md', value: 'calc(var(--radius) - 2px)' },
    { name: 'lg', value: 'var(--radius)' },
    { name: 'xl', value: 'calc(var(--radius) + 4px)' },
  ],

  proseColors: {
    body: { light: 'var(--foreground)', dark: 'var(--foreground)' },
    headings: { light: 'var(--foreground)', dark: 'var(--foreground)' },
    links: { light: 'var(--brand-primary)', dark: 'var(--brand-primary)' },
    bold: { light: 'var(--foreground)', dark: 'var(--foreground)' },
    bullets: { light: 'var(--brand-primary)', dark: 'var(--brand-primary)' },
    quotes: { light: 'var(--foreground)', dark: 'var(--foreground)' },
    'quote-borders': { light: 'var(--brand-primary)', dark: 'var(--brand-primary)' },
  },
}

/** Reusable UnoCSS shortcuts — the "component classes" of the design system.
 *  `trigger` + a `trigger-style-*` + a `trigger-size-*` compose into a button. */
export const sampleShortcutSet = {
  active: true,
  title: 'Demo Shortcut Set',
  _status: 'published' as const,
  defaultShortcuts: [],
  shortcuts: [
    { name: 'page-main', ClassName: 'flex\nflex-1\nflex-col\npx-2' },
    {
      name: 'nice-scrollbar',
      ClassName:
        'overflow-y-auto\n[&::-webkit-scrollbar]:w-1\n[&::-webkit-scrollbar-thumb]:rounded-full\n[&::-webkit-scrollbar-thumb]:bg-foreground/30\n[&::-webkit-scrollbar-track]:bg-background\nhover:[&::-webkit-scrollbar-thumb]:bg-foreground/60',
    },
    {
      name: 'trigger',
      ClassName:
        "inline-flex\nitems-center\njustify-center\nshrink-0\ngap-2\nwhitespace-nowrap\nrounded-md\ncursor-pointer\ntext-sm\nfont-medium\ntransition-all\noutline-none\nfocus-visible:border-ring\nfocus-visible:ring-ring/50\nfocus-visible:ring-[3px]\ndisabled:pointer-events-none\ndisabled:opacity-50\n[&_svg]:pointer-events-none\n[&_svg]:shrink-0\n[&_svg:not([class*='size-'])]:size-4",
    },
    { name: 'trigger-style-base', ClassName: 'bg-primary\ntext-primary-foreground\nhover:bg-primary/90' },
    { name: 'trigger-style-secondary', ClassName: 'bg-secondary\ntext-secondary-foreground\nhover:bg-secondary/80' },
    {
      name: 'trigger-style-outline',
      ClassName: 'border\nborder-border\nbg-background\nhover:bg-accent\nhover:text-accent-foreground',
    },
    {
      name: 'trigger-style-destructive',
      ClassName: 'bg-destructive\ntext-white\nhover:bg-destructive/90',
    },
    { name: 'trigger-style-ghost', ClassName: 'hover:bg-accent\nhover:text-accent-foreground' },
    { name: 'trigger-style-link', ClassName: 'text-primary\nunderline-offset-4\nhover:underline' },
    { name: 'trigger-size-sm', ClassName: 'h-8\nrounded-md\ngap-1.5\npx-3' },
    { name: 'trigger-size-base', ClassName: 'h-9\npx-4\npy-2' },
    { name: 'trigger-size-lg', ClassName: 'h-10\nrounded-md\npx-6' },
  ],
}

/** The home page (`href: '/'`) made of one of each example block. Every class
 *  here gets collected by the page `cssHook` on create → emitted into the
 *  generated stylesheet → applied by the block components on the frontend. */
export const sampleHomePage = {
  title: 'Home',
  href: '/',
  live: true,
  _status: 'published' as const,
  mainClassName: 'mx-auto max-w-3xl px-6 py-12 flex flex-col gap-16',
  layout: [
    {
      blockType: 'hero',
      eyebrow: 'Atomic Payload',
      heading: 'Build your design system in the dashboard',
      subheading: 'Every class on this page was authored in Payload, collected on save, and compiled to CSS by the styles plugin — no stylesheet in the repo.',
      sectionClassName: 'flex flex-col items-center text-center gap-5 py-20',
      eyebrowClassName: 'text-sm font-medium text-brand-primary',
      headingClassName: 'text-4xl font-bold tracking-tight text-foreground',
      subheadingClassName: 'text-lg text-muted-foreground',
      buttonsClassName: 'flex flex-wrap gap-3 justify-center mt-2',
      buttons: [
        { label: 'Primary action', href: '#', buttonClassName: 'trigger trigger-style-base trigger-size-lg' },
        { label: 'Secondary', href: '#', buttonClassName: 'trigger trigger-style-outline trigger-size-lg' },
      ],
    },
    {
      blockType: 'buttonRow',
      heading: 'Buttons composed from shortcutSet shortcuts',
      headingClassName: 'text-sm font-medium text-muted-foreground mb-3',
      rowClassName: 'flex flex-wrap items-center gap-3',
      buttons: [
        { label: 'base', href: '#', buttonClassName: 'trigger trigger-style-base trigger-size-base' },
        { label: 'secondary', href: '#', buttonClassName: 'trigger trigger-style-secondary trigger-size-base' },
        { label: 'outline', href: '#', buttonClassName: 'trigger trigger-style-outline trigger-size-base' },
        { label: 'destructive', href: '#', buttonClassName: 'trigger trigger-style-destructive trigger-size-base' },
        { label: 'ghost', href: '#', buttonClassName: 'trigger trigger-style-ghost trigger-size-base' },
        { label: 'link', href: '#', buttonClassName: 'trigger trigger-style-link trigger-size-base' },
      ],
    },
    {
      blockType: 'cardGrid',
      heading: 'Cards built on the color tokens',
      headingClassName: 'text-2xl font-semibold tracking-tight text-foreground mb-4',
      gridClassName: 'grid grid-cols-1 sm:grid-cols-3 gap-4',
      cards: [
        {
          title: 'Tokens',
          body: 'bg-card / text-card-foreground / border-border track the active design set.',
          cardClassName: 'bg-card text-card-foreground border border-border rounded-lg p-6 flex flex-col gap-2',
          cardTitleClassName: 'font-semibold',
          cardBodyClassName: 'text-sm text-muted-foreground',
        },
        {
          title: 'Theme-aware',
          body: 'Toggle the theme and every card repaints from its light/dark token values.',
          cardClassName: 'bg-card text-card-foreground border border-border rounded-lg p-6 flex flex-col gap-2',
          cardTitleClassName: 'font-semibold',
          cardBodyClassName: 'text-sm text-muted-foreground',
        },
        {
          title: 'No-code',
          body: 'Edit the class names in the admin to restyle — no redeploy.',
          cardClassName: 'bg-card text-card-foreground border border-border rounded-lg p-6 flex flex-col gap-2',
          cardTitleClassName: 'font-semibold',
          cardBodyClassName: 'text-sm text-muted-foreground',
        },
      ],
    },
    {
      blockType: 'prose',
      heading: 'Typography from the prose tokens',
      content:
        'This paragraph is rendered inside a `prose` wrapper, so UnoCSS’s typography preset styles it using the design set’s prose colors.\n\nAdd a second paragraph by leaving a blank line. Links, bold, and lists all pick up the configured prose palette.',
      proseClassName: 'prose max-w-none',
    },
    {
      blockType: 'palette',
      heading: 'The active design set’s palette',
      headingClassName: 'text-2xl font-semibold tracking-tight text-foreground mb-4',
      gridClassName: 'grid grid-cols-2 sm:grid-cols-4 gap-3',
      swatchClassName: 'flex flex-col gap-2',
      swatchBoxClassName: 'h-16 w-full rounded-md border border-border',
      swatchLabelClassName: 'text-xs text-muted-foreground',
    },
  ],
}
