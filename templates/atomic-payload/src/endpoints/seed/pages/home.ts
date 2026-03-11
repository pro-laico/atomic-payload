import type { Page } from '@/ts/types'

export const homePage: Omit<Page, 'createdAt' | 'updatedAt' | 'publishedAt' | 'id'> = {
  title: 'Home',
  slug: '',
  slugLock: false,
  href: '/',
  live: true,
  mainClassName: 'page-main pb-12',
  _status: 'published',
  devMode: false,
  children: [
    {
      blockType: 'AtomicChild',
      type: 'tag',
      tagType: 'section',
      ClassName: 'relative overflow-hidden border-b border-border bg-background',

      children: [
        {
          blockType: 'AtomicChild',
          type: 'tag',
          tagType: 'div',
          ClassName: 'container mx-auto px-4 py-24 md:py-32 lg:py-40',

          children: [
            {
              blockType: 'AtomicChild',
              type: 'tag',
              tagType: 'div',
              ClassName: 'mx-auto max-w-4xl text-center',

              children: [
                {
                  blockType: 'AtomicChild',
                  type: 'tag',
                  tagType: 'h1',
                  ClassName: 'text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl',

                  children: [
                    {
                      blockType: 'SimpleTextChild',
                      tagType: 'fragment',
                      ClassName: 'text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl',
                      text: 'Thanks for giving ',
                      id: '69306d9fc59442e39df957af',

                      contentActions: {
                        actionBlocks: [],
                      },

                      staticDataAttributes: [],
                    },

                    {
                      blockType: 'SimpleTextChild',
                      tagType: 'span',
                      ClassName: 'text-brand-primary',
                      text: 'Atomic Payload',
                      id: '69306deac59442e39df957b3',

                      contentActions: {
                        actionBlocks: [],
                      },

                      staticDataAttributes: [],
                    },

                    {
                      blockType: 'SimpleTextChild',
                      tagType: 'fragment',
                      ClassName: 'mt-10 flex items-center justify-center gap-4',
                      text: ' a go',
                      id: '6930717ee303ad21a77bdd52',

                      contentActions: {
                        actionBlocks: [],
                      },

                      staticDataAttributes: [],
                    },
                  ],
                  id: '69306d80c59442e39df957ad',

                  triggerChildren: [],

                  triggerActions: {
                    actionBlocks: [],
                  },

                  contentActions: {
                    actionBlocks: [],
                  },

                  formRateLimitBlocks: [],

                  formSanitationBlocks: [],

                  formValidationBlocks: [],

                  inputSanitationBlocks: [],

                  inputValidationBlocks: [],

                  backdropChildren: [],

                  ds: {},

                  pops: {},

                  triggerStaticDataAttributes: [],

                  staticDataAttributes: [],
                },

                {
                  blockType: 'SimpleTextChild',
                  tagType: 'p',
                  ClassName: 'mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl',
                  text: 'If you enjoy the project, give it a star on github!',
                  id: '6933468f5ff10f7a3074a1f3',

                  contentActions: {
                    actionBlocks: [],
                  },

                  staticDataAttributes: [],
                },

                {
                  blockType: 'AtomicChild',
                  type: 'tag',
                  tagType: 'div',
                  ClassName: 'mt-10 flex flex-row gap-4 justify-center',

                  children: [
                    {
                      blockType: 'AtomicChild',
                      type: 'button',
                      tagType: 'div',
                      buttonType: 'link',
                      newTab: true,
                      linkType: 'externalLink',
                      externalLink: 'github.com/pro-laico/atomic-payload',
                      triggerClassName: 'trigger trigger-style-outline trigger-size-icon',
                      screenReaderText: 'Github',

                      triggerChildren: [
                        {
                          blockType: 'IconChild',
                          icon: 'github',
                          ariaHidden: true,
                          id: '69334970f7cd753c11ea0d72',

                          staticDataAttributes: [],
                        },
                      ],
                      id: '69334945f7cd753c11ea0d70',
                      blockName: 'Github Link',

                      children: [],

                      triggerActions: {
                        actionBlocks: [],
                      },

                      contentActions: {
                        actionBlocks: [],
                      },

                      formRateLimitBlocks: [],

                      formSanitationBlocks: [],

                      formValidationBlocks: [],

                      inputSanitationBlocks: [],

                      inputValidationBlocks: [],

                      backdropChildren: [],

                      ds: {},

                      pops: {},

                      triggerStaticDataAttributes: [],

                      staticDataAttributes: [],
                    },

                    {
                      blockType: 'AtomicChild',
                      type: 'button',
                      tagType: 'div',
                      buttonType: 'link',
                      newTab: true,
                      linkType: 'externalLink',
                      externalLink: 'www.atomicpayload.com/getting-started',
                      triggerClassName: 'trigger trigger-style-base trigger-size-base',

                      triggerChildren: [
                        {
                          blockType: 'SimpleTextChild',
                          tagType: 'span',
                          text: 'Get Started',
                          id: '6933468f5ff10f7a3074a1f7',

                          contentActions: {
                            actionBlocks: [],
                          },

                          staticDataAttributes: [],
                        },
                      ],
                      id: '6933468f5ff10f7a3074a1f8',
                      blockName: 'Get Started',

                      children: [],

                      triggerActions: {
                        actionBlocks: [],
                      },

                      contentActions: {
                        actionBlocks: [],
                      },

                      formRateLimitBlocks: [],

                      formSanitationBlocks: [],

                      formValidationBlocks: [],

                      inputSanitationBlocks: [],

                      inputValidationBlocks: [],

                      backdropChildren: [],

                      ds: {},

                      pops: {},

                      triggerStaticDataAttributes: [],

                      staticDataAttributes: [],
                    },
                  ],
                  id: '6933468f5ff10f7a3074a1f9',

                  triggerChildren: [],

                  triggerActions: {
                    actionBlocks: [],
                  },

                  contentActions: {
                    actionBlocks: [],
                  },

                  formRateLimitBlocks: [],

                  formSanitationBlocks: [],

                  formValidationBlocks: [],

                  inputSanitationBlocks: [],

                  inputValidationBlocks: [],

                  backdropChildren: [],

                  ds: {},

                  pops: {},

                  triggerStaticDataAttributes: [],

                  staticDataAttributes: [],
                },
              ],
              id: '69306d76c59442e39df957ac',

              triggerChildren: [],

              triggerActions: {
                actionBlocks: [],
              },

              contentActions: {
                actionBlocks: [],
              },

              formRateLimitBlocks: [],

              formSanitationBlocks: [],

              formValidationBlocks: [],

              inputSanitationBlocks: [],

              inputValidationBlocks: [],

              backdropChildren: [],

              ds: {},

              pops: {},

              triggerStaticDataAttributes: [],

              staticDataAttributes: [],
            },
          ],
          id: '69306d57c59442e39df957ab',
          blockName: 'Header Section',

          triggerChildren: [],

          triggerActions: {
            actionBlocks: [],
          },

          contentActions: {
            actionBlocks: [],
          },

          formRateLimitBlocks: [],

          formSanitationBlocks: [],

          formValidationBlocks: [],

          inputSanitationBlocks: [],

          inputValidationBlocks: [],

          backdropChildren: [],

          ds: {},

          pops: {},

          triggerStaticDataAttributes: [],

          staticDataAttributes: [],
        },
      ],
      id: '69274d68241f5cfdd32d4460',
      blockName: 'Header Section',

      triggerChildren: [],

      triggerActions: {
        actionBlocks: [],
      },

      contentActions: {
        actionBlocks: [],
      },

      formRateLimitBlocks: [],

      formSanitationBlocks: [],

      formValidationBlocks: [],

      inputSanitationBlocks: [],

      inputValidationBlocks: [],

      backdropChildren: [],

      ds: {},

      pops: {},

      triggerStaticDataAttributes: [],

      staticDataAttributes: [],
    },

    {
      blockType: 'AtomicChild',
      type: 'tag',
      tagType: 'div',
      ClassName: 'container mx-auto px-4',

      children: [
        {
          blockType: 'AtomicChild',
          type: 'tag',
          tagType: 'div',
          ClassName: 'my-12 text-center',

          children: [
            {
              blockType: 'SimpleTextChild',
              tagType: 'h2',
              ClassName: 'text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl',
              text: 'Quick Links',
              id: '693346865ff10f7a3074a1e5',

              contentActions: {
                actionBlocks: [],
              },

              staticDataAttributes: [],
            },
          ],
          id: '693346865ff10f7a3074a1e7',
          blockName: 'Header',

          triggerChildren: [],

          triggerActions: {
            actionBlocks: [],
          },

          contentActions: {
            actionBlocks: [],
          },

          formRateLimitBlocks: [],

          formSanitationBlocks: [],

          formValidationBlocks: [],

          inputSanitationBlocks: [],

          inputValidationBlocks: [],

          backdropChildren: [],

          ds: {},

          pops: {},

          triggerStaticDataAttributes: [],

          staticDataAttributes: [],
        },

        {
          blockType: 'AtomicChild',
          type: 'tag',
          tagType: 'div',
          ClassName: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',

          children: [
            {
              blockType: 'AtomicChild',
              type: 'button',
              tagType: 'div',
              buttonType: 'link',
              linkType: 'externalLink',
              newTab: true,
              externalLink: 'https://github.com/pro-laico/atomic-payload',
              triggerClassName: 'group h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg',

              triggerChildren: [
                {
                  blockType: 'AtomicChild',
                  type: 'tag',
                  tagType: 'div',
                  ClassName: 'mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-accent',

                  children: [
                    {
                      blockType: 'IconChild',
                      icon: 'github',
                      ClassName: 'size-6 stroke-accent-foreground fill-accent-foreground',
                      id: '693346865ff10f7a3074a1e8',

                      staticDataAttributes: [],
                    },
                  ],
                  id: '693346865ff10f7a3074a1e9',
                  blockName: 'Github Icon',

                  triggerChildren: [],

                  triggerActions: {
                    actionBlocks: [],
                  },

                  contentActions: {
                    actionBlocks: [],
                  },

                  formRateLimitBlocks: [],

                  formSanitationBlocks: [],

                  formValidationBlocks: [],

                  inputSanitationBlocks: [],

                  inputValidationBlocks: [],

                  backdropChildren: [],

                  ds: {},

                  pops: {},

                  triggerStaticDataAttributes: [],

                  staticDataAttributes: [],
                },

                {
                  blockType: 'SimpleTextChild',
                  tagType: 'h3',
                  ClassName: 'mb-2 text-xl font-semibold text-card-foreground group-hover:text-primary',
                  text: 'Github',
                  id: '693346865ff10f7a3074a1ea',

                  contentActions: {
                    actionBlocks: [],
                  },

                  staticDataAttributes: [],
                },

                {
                  blockType: 'SimpleTextChild',
                  tagType: 'span',
                  ClassName: 'leading-relaxed text-muted-foreground',
                  text: 'View The Github Repo.',
                  id: '693346865ff10f7a3074a1eb',

                  contentActions: {
                    actionBlocks: [],
                  },

                  staticDataAttributes: [],
                },
              ],
              id: '693346865ff10f7a3074a1ec',
              blockName: 'Github',

              children: [],

              triggerActions: {
                actionBlocks: [],
              },

              contentActions: {
                actionBlocks: [],
              },

              formRateLimitBlocks: [],

              formSanitationBlocks: [],

              formValidationBlocks: [],

              inputSanitationBlocks: [],

              inputValidationBlocks: [],

              backdropChildren: [],

              ds: {},

              pops: {},

              triggerStaticDataAttributes: [],

              staticDataAttributes: [],
            },

            {
              blockType: 'AtomicChild',
              type: 'button',
              tagType: 'div',
              buttonType: 'link',
              linkType: 'externalLink',
              externalLink: 'www.atomicpayload.com',
              newTab: true,
              triggerClassName: 'group h-full rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg',

              triggerChildren: [
                {
                  blockType: 'AtomicChild',
                  type: 'tag',
                  tagType: 'div',
                  ClassName: 'mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-accent',

                  children: [
                    {
                      blockType: 'IconChild',
                      icon: 'logo',
                      ClassName: 'size-6 stroke-accent-foreground fill-accent-foreground',
                      id: '693346865ff10f7a3074a1ed',

                      staticDataAttributes: [],
                    },
                  ],
                  id: '693346865ff10f7a3074a1ee',
                  blockName: 'Github Icon',

                  triggerChildren: [],

                  triggerActions: {
                    actionBlocks: [],
                  },

                  contentActions: {
                    actionBlocks: [],
                  },

                  formRateLimitBlocks: [],

                  formSanitationBlocks: [],

                  formValidationBlocks: [],

                  inputSanitationBlocks: [],

                  inputValidationBlocks: [],

                  backdropChildren: [],

                  ds: {},

                  pops: {},

                  triggerStaticDataAttributes: [],

                  staticDataAttributes: [],
                },

                {
                  blockType: 'SimpleTextChild',
                  tagType: 'h3',
                  ClassName: 'mb-2 text-xl font-semibold text-card-foreground group-hover:text-primary',
                  text: 'Atomic Payload',
                  id: '693346865ff10f7a3074a1ef',

                  contentActions: {
                    actionBlocks: [],
                  },

                  staticDataAttributes: [],
                },

                {
                  blockType: 'SimpleTextChild',
                  tagType: 'span',
                  ClassName: 'leading-relaxed text-muted-foreground',
                  text: 'View the documentation on all major aspects of Atomic Payload.',
                  id: '693346865ff10f7a3074a1f0',

                  contentActions: {
                    actionBlocks: [],
                  },

                  staticDataAttributes: [],
                },
              ],
              id: '693346865ff10f7a3074a1f1',
              blockName: 'Github',

              children: [],

              triggerActions: {
                actionBlocks: [],
              },

              contentActions: {
                actionBlocks: [],
              },

              formRateLimitBlocks: [],

              formSanitationBlocks: [],

              formValidationBlocks: [],

              inputSanitationBlocks: [],

              inputValidationBlocks: [],

              backdropChildren: [],

              ds: {},

              pops: {},

              triggerStaticDataAttributes: [],

              staticDataAttributes: [],
            },
          ],
          id: '693346865ff10f7a3074a1f2',
          blockName: 'Grid',

          triggerChildren: [],

          triggerActions: {
            actionBlocks: [],
          },

          contentActions: {
            actionBlocks: [],
          },

          formRateLimitBlocks: [],

          formSanitationBlocks: [],

          formValidationBlocks: [],

          inputSanitationBlocks: [],

          inputValidationBlocks: [],

          backdropChildren: [],

          ds: {},

          pops: {},

          triggerStaticDataAttributes: [],

          staticDataAttributes: [],
        },
      ],
      id: '69334682b5ca35c4819b72d7',
      blockName: 'Documentation Section',

      triggerChildren: [],

      triggerActions: {
        actionBlocks: [],
      },

      contentActions: {
        actionBlocks: [],
      },

      formRateLimitBlocks: [],

      formSanitationBlocks: [],

      formValidationBlocks: [],

      inputSanitationBlocks: [],

      inputValidationBlocks: [],

      backdropChildren: [],

      ds: {},

      pops: {},

      triggerStaticDataAttributes: [],

      staticDataAttributes: [],
    },
  ] as any,

  meta: {
    noIndex: false,
    priority: 0.5,
  },

  breadcrumbs: [
    {
      doc: '69274d8cc6c6fa92adf998ab',
      url: '/',
      label: '/',
      id: '69274d8c58b4d28e286cff19',
    },
  ],

  storedAtomicClasses: [
    'page-main',
    'pb-12',
    'relative',
    'overflow-hidden',
    'border-b',
    'border-border',
    'bg-background',
    'container',
    'mx-auto',
    'px-4',
    'py-24',
    'md:py-32',
    'lg:py-40',
    'max-w-4xl',
    'text-center',
    'text-balance',
    'text-5xl',
    'font-bold',
    'tracking-tight',
    'sm:text-6xl',
    'md:text-7xl',
    'lg:text-8xl',
    'text-brand-primary',
    'mt-10',
    'flex',
    'items-center',
    'justify-center',
    'gap-4',
    'mt-6',
    'max-w-2xl',
    'text-pretty',
    'text-lg',
    'leading-relaxed',
    'text-muted-foreground',
    'sm:text-xl',
    'flex-row',
    'trigger',
    'trigger-style-outline',
    'trigger-size-icon',
    'trigger-style-base',
    'trigger-size-base',
    'my-12',
    'text-3xl',
    'sm:text-4xl',
    'md:text-5xl',
    'mt-4',
    'grid',
    'gap-6',
    'sm:grid-cols-2',
    'lg:grid-cols-3',
    'xl:grid-cols-4',
    'group',
    'h-full',
    'rounded-lg',
    'border',
    'bg-card',
    'p-6',
    'transition-all',
    'hover:border-primary',
    'hover:shadow-lg',
    'mb-4',
    'inline-flex',
    'size-12',
    'bg-accent',
    'size-6',
    'stroke-accent-foreground',
    'fill-accent-foreground',
    'mb-2',
    'text-xl',
    'font-semibold',
    'text-card-foreground',
    'group-hover:text-primary',
  ],

  storedAtomicForms: [],
}
