import { Page, ShortcutSet } from '@/ts/types'

type ShortcutSetArgs = { page: Page }

export const shortcutSet: (args: ShortcutSetArgs) => Omit<ShortcutSet, 'createdAt' | 'updatedAt' | 'id'> = ({ page }) => {
  return {
    active: true,
    title: 'Base Shortcut Set',

    testPath: page,

    shortcuts: [
      {
        name: 'page-main',
        ClassName: 'flex\nflex-1\nflex-col\npx-2',
        id: '6927555aeb8aaaca85b3a425',
      },

      {
        name: 'no-scrollbar',
        ClassName: '[scrollbar-width:none]\n[-ms-overflow-style:none]',
        id: '6930657ac59442e39df9579d',
      },

      {
        name: 'nice-scrollbar',
        ClassName:
          'overflow-y-auto\n[&::-webkit-scrollbar]:w-1\n[&::-webkit-scrollbar]:p-[2px]\n[&::-webkit-scrollbar-thumb]:rounded-full\n[&::-webkit-scrollbar-thumb]:bg-foreground/30\n[&::-webkit-scrollbar-track]:bg-background\nhover:[&::-webkit-scrollbar-thumb]:bg-foreground/60',
        id: '69334bb9f7cd753c11ea0d73',
      },

      {
        name: 'ui-seperator',
        ClassName:
          'bg-border\nshrink-0\ndata-[orientation=vertical]:h-4\ndata-[orientation=vertical]:w-[1px]\ndata-[orientation=horizontal]:w-full\ndata-[orientation=horizontal]:h-[1px]',
        id: '69288288df37686e6978aec5',
      },

      {
        name: 'icon-outline',
        ClassName: 'rounded-full\nborder-1',
        id: '69275568eb8aaaca85b3a426',
      },

      {
        name: 'icon-inline',
        ClassName: 'self-center\nsize-[1em]\nrounded-full\nborder-1\nfill-foreground\nstroke-foreground',
        id: '6927556eeb8aaaca85b3a427',
      },

      {
        name: 'form-label',
        ClassName:
          'flex\nitems-center\ngap-2\ntext-sm\nleading-none\nfont-medium\nselect-none\ngroup-data-[disabled=true]:pointer-events-none\ngroup-data-[disabled=true]:opacity-50\npeer-disabled:cursor-not-allowed\npeer-disabled:opacity-50',
        id: '6930868816ba198a13e06c5f',
      },

      {
        name: 'form-input',
        ClassName:
          'w-full\nmin-w-0\nh-9\npx-3\npy-1\nrounded-md\nborder\nborder-input\nbg-transparent\ndark:bg-input/30\ntext-base\nmd:text-sm\nfile:inline-flex\nfile:h-7\nfile:border-0\nfile:bg-transparent\nfile:text-sm\nfile:font-medium\nfile:text-foreground\nplaceholder:text-muted-foreground\nselection:bg-primary\nselection:text-primary-foreground\nshadow-xs\ntransition-[color,box-shadow]\noutline-none\nfocus-visible:border-ring\nfocus-visible:ring-ring/50\nfocus-visible:ring-[3px]\naria-invalid:border-destructive\naria-invalid:ring-destructive/20\ndark:aria-invalid:ring-destructive/40\ndata-[error]:border-destructive\ndisabled:pointer-events-none\ndisabled:cursor-not-allowed\ndisabled:opacity-50',
        id: '693086f716ba198a13e06c60',
      },

      {
        name: 'form-textarea',
        ClassName:
          'flex\nfield-sizing-content\nw-full\nmin-h-16\npx-3\npy-2\nrounded-md\nborder\nborder-input\nbg-transparent\ndark:bg-input/30\ntext-base\nmd:text-sm\nshadow-xs\ntransition-[color,box-shadow]\noutline-none\nfocus-visible:border-ring\nfocus-visible:ring-ring/50\nfocus-visible:ring-[3px]\nplaceholder:text-muted-foreground\naria-invalid:border-destructive\naria-invalid:ring-destructive/20\ndark:aria-invalid:ring-destructive/40\ndisabled:cursor-not-allowed\ndisabled:opacity-50',
        id: '6931c91837a7f512e091f8d7',
      },

      {
        name: 'menu-trigger-text',
        ClassName:
          "inline-flex\nitems-center\njustify-center\nshrink-0\nwhitespace-nowrap\nh-8\nrounded-md\ngap-1.5\npx-3\nhas-[>svg]:px-2.5\ntext-sm\nfont-medium\ntransition-all\noutline-none\nfocus-visible:border-ring\nfocus-visible:ring-ring/50\nfocus-visible:ring-[3px]\naria-invalid:border-destructive\naria-invalid:ring-destructive/20\ndark:aria-invalid:ring-destructive/40\nhover:bg-accent\nhover:text-accent-foreground\ndark:hover:bg-accent/50\ndisabled:pointer-events-none\ndisabled:opacity-50\n[&_svg]:pointer-events-none\n[&_svg]:shrink-0\n[&_svg:not([class*='size-'])]:size-4",
        id: '69287f44df37686e6978aeb3',
      },

      {
        name: 'menu-trigger-icon',
        ClassName:
          "items-center\njustify-center\nshrink-0\ngap-2\nwhitespace-nowrap\nsize-8\nrounded-md\ntext-sm\nfont-medium\ntransition-all\noutline-none\nfocus-visible:border-ring\nfocus-visible:ring-ring/50\nfocus-visible:ring-[3px]\naria-invalid:border-destructive\naria-invalid:ring-destructive/20\ndark:aria-invalid:ring-destructive/40\nhover:bg-accent\nhover:text-accent-foreground\ndark:hover:bg-accent/50\ndisabled:pointer-events-none\ndisabled:opacity-50\n[&_svg]:pointer-events-none\n[&_svg]:shrink-0\n[&_svg:not([class*='size-'])]:size-4",
        id: '692880dedf37686e6978aec0',
      },

      {
        name: 'menu-trigger-both',
        ClassName:
          "inline-flex\nitems-center\njustify-center\nshrink-0\nh-8\nrounded-md\ngap-1.5\npx-3\nhas-[>svg]:px-2.5\nwhitespace-nowrap\ntext-sm\nfont-medium\ntransition-all\noutline-none\nshadow-none\nfocus-visible:border-ring\nfocus-visible:ring-ring/50\nfocus-visible:ring-[3px]\naria-invalid:border-destructive\naria-invalid:ring-destructive/20\ndark:aria-invalid:ring-destructive/40\nhover:bg-accent\nhover:text-accent-foreground\ndark:hover:bg-accent/50\ndisabled:pointer-events-none\ndisabled:opacity-50\n[&_svg]:pointer-events-none\n[&_svg]:shrink-0\n[&_svg:not([class*='size-'])]:size-4",
        id: '69288c655a0c1e888eb3e6f2',
      },

      {
        name: 'trigger',
        ClassName:
          "inline-flex\nitems-center\njustify-center\nshrink-0\ngap-2\nwhitespace-nowrap\nrounded-md\ncursor-pointer\ntext-sm\nfont-medium\ntransition-all\noutline-none\nfocus-visible:border-ring\nfocus-visible:ring-ring/50\nfocus-visible:ring-[3px]\naria-invalid:border-destructive\naria-invalid:ring-destructive/20\ndark:aria-invalid:ring-destructive/40\ndisabled:pointer-events-none\ndisabled:opacity-50\n[&_svg]:pointer-events-none\n[&_svg]:shrink-0\n[&_svg:not([class*='size-'])]:size-4",
        id: '69307477e303ad21a77bdd55',
      },

      {
        name: 'trigger-style-base',
        ClassName: 'bg-primary\ntext-primary-foreground\nhover:bg-primary/90',
        id: '69332a133dc3aa372c7fa544',
      },

      {
        name: 'trigger-style-destructive',
        ClassName:
          'bg-destructive\ndark:bg-destructive/60\ntext-white\nhover:bg-destructive/90\nfocus-visible:ring-destructive/20\ndark:focus-visible:ring-destructive/40',
        id: '69332a323dc3aa372c7fa545',
      },

      {
        name: 'trigger-style-outline',
        ClassName:
          'border\ndark:border-input\nbg-background\ndark:bg-input/30\nshadow-xs\nhover:bg-accent\ndark:hover:bg-input/50\nhover:text-accent-foreground',
        id: '69332a433dc3aa372c7fa546',
      },

      {
        name: 'trigger-style-secondary',
        ClassName: 'bg-secondary\ntext-secondary-foreground\nhover:bg-secondary/80',
        id: '69332a463dc3aa372c7fa547',
      },

      {
        name: 'trigger-style-ghost',
        ClassName: 'hover:bg-accent\nhover:text-accent-foreground\ndark:hover:bg-accent/50',
        id: '69332a4a3dc3aa372c7fa548',
      },

      {
        name: 'trigger-style-link',
        ClassName: 'text-primary\nunderline-offset-4\nhover:underline',
        id: '69332a5d3dc3aa372c7fa549',
      },

      {
        name: 'trigger-size-sm',
        ClassName: 'h-8\nrounded-md\ngap-1.5\npx-3\nhas-[>svg]:px-2.5',
        id: '69332b1f3dc3aa372c7fa54b',
      },

      {
        name: 'trigger-size-base',
        ClassName: 'h-9\npx-4\npy-2\nhas-[>svg]:px-3',
        id: '69332b153dc3aa372c7fa54a',
      },

      {
        name: 'trigger-size-lg',
        ClassName: 'h-10\nrounded-md\npx-6\nhas-[>svg]:px-4',
        id: '69332b243dc3aa372c7fa54c',
      },

      {
        name: 'trigger-size-icon',
        ClassName: 'size-9',
        id: '69332b2a3dc3aa372c7fa54d',
      },

      {
        name: 'trigger-size-icon-sm',
        ClassName: 'size-8',
        id: '69332b313dc3aa372c7fa54e',
      },

      {
        name: 'trigger-size-icon-lg',
        ClassName: 'size-10',
        id: '69332b393dc3aa372c7fa54f',
      },

      {
        name: 'consent-trigger',
        ClassName:
          'h-8\nw-20\nrounded-md\ngap-1.5\ntext-white\nbg-destructive/60\nhover:bg-destructive/90\ndata-[enabled]:bg-success/60\ndata-[enabled]:hover:bg-success/80',
        id: '69332da5245a1e195635a6b1',
      },
    ],

    defaultShortcuts: [],
    _status: 'published',
    'apf-classes': false,
    'apf-active': false,
  }
}
