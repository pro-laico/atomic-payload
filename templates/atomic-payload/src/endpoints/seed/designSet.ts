import { DesignSet, Page } from '@/ts/types'

type DesignSetArgs = { page: Page }

export const designSet: (args: DesignSetArgs) => Omit<DesignSet, 'createdAt' | 'updatedAt' | 'id'> = ({ page }) => {
  return {
    active: true,
    title: 'Base Design Set',
    _status: 'published',

    testPath: page,

    minify: false,
    defaultTheme: 'dark',
    htmlClassName: 'nice-scrollbar',
    bodyClassName: 'group/body overscroll-none antialiased',
    wrapperClassName: 'bg-background relative flex min-h-svh flex-col',

    defaults: {
      spacing: '0.25rem',
      radius: '0.625rem',
    },

    variables: [],

    colors: [
      {
        name: 'sampler',
        light: '#ffffff',
        dark: '#ffffff',
      },

      {
        name: 'background',
        light: 'oklch(1 0 0)',
        dark: 'oklch(0.145 0 0)',
      },

      {
        name: 'foreground',
        light: 'oklch(0.145 0 0)',
        dark: 'oklch(0.985 0 0)',
      },

      {
        name: 'card',
        light: 'oklch(1 0 0)',
        dark: 'oklch(0.205 0 0)',
      },

      {
        name: 'card-foreground',
        light: 'oklch(0.145 0 0)',
        dark: 'oklch(0.985 0 0)',
      },

      {
        name: 'popover',
        light: 'oklch(1 0 0)',
        dark: 'oklch(0.205 0 0)',
      },

      {
        name: 'popover-foreground',
        light: 'oklch(0.145 0 0)',
        dark: 'oklch(0.985 0 0)',
      },

      {
        name: 'primary',
        light: 'oklch(0.205 0 0)',
        dark: 'oklch(0.922 0 0)',
      },

      {
        name: 'primary-foreground',
        light: 'oklch(0.985 0 0)',
        dark: 'oklch(0.205 0 0)',
      },

      {
        name: 'secondary',
        light: 'oklch(0.97 0 0)',
        dark: 'oklch(0.269 0 0)',
      },

      {
        name: 'secondary-foreground',
        light: 'oklch(0.205 0 0)',
        dark: 'oklch(0.985 0 0)',
      },

      {
        name: 'muted',
        light: 'oklch(0.97 0 0)',
        dark: 'oklch(0.269 0 0)',
      },

      {
        name: 'muted-foreground',
        light: 'oklch(0.556 0 0)',
        dark: 'oklch(0.708 0 0)',
      },

      {
        name: 'accent',
        light: 'oklch(0.97 0 0)',
        dark: 'oklch(0.269 0 0)',
      },

      {
        name: 'accent-foreground',
        light: 'oklch(0.205 0 0)',
        dark: 'oklch(0.985 0 0)',
      },

      {
        name: 'destructive',
        light: 'oklch(0.577 0.245 27.325)',
        dark: 'oklch(0.704 0.191 22.216)',
      },

      {
        name: 'border',
        light: 'oklch(0.922 0 0)',
        dark: 'oklch(1 0 0 / 10%)',
      },

      {
        name: 'input',
        light: 'oklch(0.922 0 0)',
        dark: 'oklch(1 0 0 / 15%)',
      },

      {
        name: 'ring',
        light: 'oklch(0.708 0 0)',
        dark: 'oklch(0.556 0 0)',
      },

      {
        name: 'success',
        light: 'oklch(0.3 0.15 140)',
        dark: 'oklch(0.9 0.1 140)',
      },

      {
        name: 'brand-primary',
        light: 'oklch(87.62% 0.240 148.61)',
        dark: 'oklch(87.62% 0.240 148.61)',
      },

      {
        name: 'brand-secondary',
        light: 'oklch(73.03% 0.052 183.44)',
        dark: 'oklch(73.03% 0.052 183.44)',
      },
    ],

    container: [],

    breakpoint: [
      {
        name: '3xl',
        value: '100rem',
      },

      {
        name: '4xl',
        value: '125rem',
      },
    ],

    spacing: [
      {
        name: 'hh',
        value: 'calc(var(--spacing)*14)',
      },

      {
        name: 'fh',
        value: 'calc(var(--spacing)*14)',
      },
    ],

    radius: [
      {
        name: 'sm',
        value: 'calc(var(--radius) - 4px)',
      },

      {
        name: 'md',
        value: 'calc(var(--radius) - 2px)',
      },

      {
        name: 'lg',
        value: 'var(--radius)',
      },

      {
        name: 'xl',
        value: 'calc(var(--radius) + 4px)',
      },
    ],

    font: {
      display: null,
    },

    text: [],

    fontWeight: [],

    tracking: [],

    leading: [],

    textStrokeWidth: [],

    animation: [],

    ease: [],

    property: [],

    aria: [
      {
        value: 'invalid',
        id: '69274d1058b4d28e286cff18',
      },
    ],

    blur: [],

    media: [],

    supports: [],

    perspective: [],

    shadow: [],

    insetShadow: [],

    dropShadow: [],

    proseColors: {
      body: {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      headings: {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      lead: {
        light: 'var(--foreground)',
        dark: 'ovar(--foreground)',
      },

      links: {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      bold: {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      counters: {
        light: 'var(--foreground)',
        dark: 'var(--brand-primary)',
      },

      bullets: {
        light: 'var(--foreground)',
        dark: 'var(--brand-primary)',
      },

      hr: {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      quotes: {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      'quote-borders': {
        light: 'var(--foreground)',
        dark: 'var(--brand-primary)',
      },

      captions: {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      kbd: {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      'kbd-shadows': {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      code: {
        light: 'var(--foreground)',
        dark: 'ovar(--foreground)',
      },

      'pre-code': {
        light: 'oklch(0.145 0 0)',
        dark: 'oklch(0.985 0 0)',
      },

      'pre-bg': {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      'th-borders': {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },

      'td-borders': {
        light: 'var(--foreground)',
        dark: 'var(--foreground)',
      },
    },

    proseBaseStorage: {},

    proseDefaultStorage: {},

    proselgStorage: {},

    prosesmStorage: {},

    textShadow: [],
    preflightStorage:
      ':root {\n--sampler: #ffffff;\n--background: oklch(1 0 0);\n--foreground: oklch(0.145 0 0);\n--card: oklch(1 0 0);\n--card-foreground: oklch(0.145 0 0);\n--popover: oklch(1 0 0);\n--popover-foreground: oklch(0.145 0 0);\n--primary: oklch(0.205 0 0);\n--primary-foreground: oklch(0.985 0 0);\n--secondary: oklch(0.97 0 0);\n--secondary-foreground: oklch(0.205 0 0);\n--muted: oklch(0.97 0 0);\n--muted-foreground: oklch(0.556 0 0);\n--accent: oklch(0.97 0 0);\n--accent-foreground: oklch(0.205 0 0);\n--destructive: oklch(0.577 0.245 27.325);\n--border: oklch(0.922 0 0);\n--input: oklch(0.922 0 0);\n--ring: oklch(0.708 0 0);\n--success: oklch(0.3 0.15 140);\n--brand-primary: oklch(87.62% 0.240 148.61);\n--brand-secondary: oklch(73.03% 0.052 183.44);\n--radius: 0.625rem;\n}\n.dark {\n--sampler: #ffffff;\n--background: oklch(0.145 0 0);\n--foreground: oklch(0.985 0 0);\n--card: oklch(0.205 0 0);\n--card-foreground: oklch(0.985 0 0);\n--popover: oklch(0.205 0 0);\n--popover-foreground: oklch(0.985 0 0);\n--primary: oklch(0.922 0 0);\n--primary-foreground: oklch(0.205 0 0);\n--secondary: oklch(0.269 0 0);\n--secondary-foreground: oklch(0.985 0 0);\n--muted: oklch(0.269 0 0);\n--muted-foreground: oklch(0.708 0 0);\n--accent: oklch(0.269 0 0);\n--accent-foreground: oklch(0.985 0 0);\n--destructive: oklch(0.704 0.191 22.216);\n--border: oklch(1 0 0 / 10%);\n--input: oklch(1 0 0 / 15%);\n--ring: oklch(0.556 0 0);\n--success: oklch(0.9 0.1 140);\n--brand-primary: oklch(87.62% 0.240 148.61);\n--brand-secondary: oklch(73.03% 0.052 183.44);\n}',

    tokenStorage: {
      colors: {
        sampler: 'var(--sampler)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        popover: 'var(--popover)',
        'popover-foreground': 'var(--popover-foreground)',
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        success: 'var(--success)',
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
      },

      variables: {
        spacing: '0.25rem',
        radius: '0.625rem',
      },

      ease: {},

      animation: {
        category: {},

        keyframes: {},

        durations: {},

        timingFns: {},

        counts: {},
      },

      property: {},

      aria: {
        invalid: 'invalid="invalid"',
      },

      blur: {},

      media: {},

      supports: {},

      perspective: {},

      shadow: {},

      textShadow: {},

      dropShadow: {},

      insetShadow: {},

      radius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },

      spacing: {
        hh: 'calc(var(--spacing)*14)',
        fh: 'calc(var(--spacing)*14)',
      },

      container: {},

      breakpoint: {
        '3xl': '100rem',
        '4xl': '125rem',
      },

      font: {
        mono: 'var(--font-setMono)',
        sans: 'var(--font-setSans)',
        serif: 'var(--font-setSerif)',
        display: 'var(--font-setDisplay)',
      },

      leading: {},

      tracking: {},

      fontWeight: {},

      textStrokeWidth: {},
    },

    proseColorStorage: {
      hr: ['var(--foreground)', 'var(--foreground)'],
      kbd: ['var(--foreground)', 'var(--foreground)'],
      body: ['var(--foreground)', 'var(--foreground)'],
      lead: ['var(--foreground)', 'ovar(--foreground)'],
      bold: ['var(--foreground)', 'var(--foreground)'],
      code: ['var(--foreground)', 'ovar(--foreground)'],
      links: ['var(--foreground)', 'var(--foreground)'],
      quotes: ['var(--foreground)', 'var(--foreground)'],
      'pre-bg': ['var(--foreground)', 'var(--foreground)'],
      bullets: ['var(--foreground)', 'var(--brand-primary)'],
      headings: ['var(--foreground)', 'var(--foreground)'],
      counters: ['var(--foreground)', 'var(--brand-primary)'],
      captions: ['var(--foreground)', 'var(--foreground)'],
      'pre-code': ['oklch(0.145 0 0)', 'oklch(0.985 0 0)'],
      'th-borders': ['var(--foreground)', 'var(--foreground)'],
      'td-borders': ['var(--foreground)', 'var(--foreground)'],
      'kbd-shadows': ['var(--foreground)', 'var(--foreground)'],
      'quote-borders': ['var(--foreground)', 'var(--brand-primary)'],
    },
  }
}
