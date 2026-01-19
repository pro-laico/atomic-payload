import { Header, Page } from '@/ts/types'
import { toPageRelationship } from '@/utilities/seedNestedRelationship'

type HeaderArgs = { testing: Page; home: Page; prose: Page }

export const header: (args: HeaderArgs) => Omit<Header, 'createdAt' | 'updatedAt' | 'id'> = ({ testing, home, prose }) => {
  return {
    active: true,
    devMode: false,
    title: 'Base header',
    _status: 'published',

    testPath: testing,
    ClassName: 'bg-background sticky top-0 z-50 w-full',

    children: [
      {
        blockType: 'AtomicChild',
        type: 'tag',
        tagType: 'div',
        ClassName: 'container-wrapper 3xl:fixed:px-0 px-6',

        children: [
          {
            blockType: 'AtomicChild',
            type: 'tag',
            tagType: 'div',
            ClassName: '3xl:fixed:container flex h-hh items-center **:data-[slot=separator]:!h-4',

            children: [
              {
                blockType: 'AtomicChild',
                type: 'button',
                tagType: 'div',
                buttonType: 'portal',
                portalType: 'dialog',
                portalName: 'menu',
                ClassName:
                  'fixed top-[calc(var(--spacing)*14)] bottom-0 left-0 right-0 min-h-dvh transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 overflow-y-auto backdrop-blur bg-background/80 no-scrollbar',

                children: [
                  {
                    blockType: 'AtomicChild',
                    type: 'tag',
                    tagType: 'div',
                    ClassName: 'flex flex-col gap-12 overflow-auto px-6 py-6',

                    children: [
                      {
                        blockType: 'AtomicChild',
                        type: 'tag',
                        tagType: 'div',
                        ClassName: 'flex flex-col gap-4',

                        children: [
                          {
                            blockType: 'SimpleTextChild',
                            tagType: 'div',
                            ClassName: 'text-muted-foreground text-sm font-medium',
                            text: 'Menu',
                            id: '6928b638ae41f527d2ef0b80',

                            contentActions: {
                              actionBlocks: [],
                            },

                            staticDataAttributes: [],
                          },

                          {
                            blockType: 'AtomicChild',
                            type: 'tag',
                            tagType: 'div',
                            ClassName: 'flex flex-col gap-3',

                            children: [
                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'link',
                                linkType: 'internalLink',

                                internalLink: toPageRelationship(home),
                                triggerClassName: 'text-2xl font-medium',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    text: 'Home',
                                    id: '6928b681ae41f527d2ef0b83',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetPortalOpen',
                                      portal: 'menu',
                                      id: '6931e71f7deeea1f1c1366ec',
                                    },
                                  ],

                                  actions: ['ActSetPortalOpen'],

                                  runners: [
                                    {
                                      type: 'RunSetBool',
                                      key: 'menu',
                                      initialValue: false,
                                      persisted: false,
                                    },
                                  ],

                                  attributers: [],
                                },
                                id: '6928b661ae41f527d2ef0b82',
                                blockName: 'Home',

                                children: [],

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
                                linkType: 'internalLink',

                                internalLink: toPageRelationship(testing),
                                triggerClassName: 'text-2xl font-medium',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    text: 'Testing',
                                    id: '6928b772ae41f527d2ef0b87',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetPortalOpen',
                                      portal: 'menu',
                                      id: '6931e6fa7deeea1f1c1366eb',
                                    },
                                  ],

                                  actions: ['ActSetPortalOpen'],

                                  runners: [
                                    {
                                      type: 'RunSetBool',
                                      key: 'menu',
                                      initialValue: false,
                                      persisted: false,
                                    },
                                  ],

                                  attributers: [],
                                },
                                id: '6928b772ae41f527d2ef0b86',
                                blockName: 'Testing',

                                children: [],

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
                                linkType: 'internalLink',

                                internalLink: toPageRelationship(prose),
                                triggerClassName: 'text-2xl font-medium',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    text: 'Prose',
                                    id: '6928b772ae41f527d2ef0b87',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetPortalOpen',
                                      portal: 'menu',
                                      id: '6931e6fa7deeea1f1c1366eb',
                                    },
                                  ],

                                  actions: ['ActSetPortalOpen'],

                                  runners: [
                                    {
                                      type: 'RunSetBool',
                                      key: 'menu',
                                      initialValue: false,
                                      persisted: false,
                                    },
                                  ],

                                  attributers: [],
                                },
                                id: '6928b772ae41f527d2ef0b86',
                                blockName: 'Prose',

                                children: [],

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
                            id: '6928b653ae41f527d2ef0b81',
                            blockName: 'Links',

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
                        id: '6928b630ae41f527d2ef0b7f',
                        blockName: 'Menu Links',

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
                        ClassName: 'flex flex-col gap-4',

                        children: [
                          {
                            blockType: 'SimpleTextChild',
                            tagType: 'div',
                            ClassName: 'text-muted-foreground text-sm font-medium',
                            text: 'Reference',
                            id: '6931e6a97deeea1f1c1366e3',

                            contentActions: {
                              actionBlocks: [],
                            },

                            staticDataAttributes: [],
                          },

                          {
                            blockType: 'AtomicChild',
                            type: 'tag',
                            tagType: 'div',
                            ClassName: 'flex flex-col gap-3',

                            children: [
                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'link',
                                linkType: 'externalLink',
                                externalLink: 'atomicpayload.com',
                                triggerClassName: 'text-2xl font-medium',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    text: 'Docs',
                                    id: '6931e6a97deeea1f1c1366e6',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],
                                id: '6931e6a97deeea1f1c1366e5',
                                blockName: 'Docs',

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
                            id: '6931e6a97deeea1f1c1366e4',
                            blockName: 'Links',

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
                        id: '6931e6a97deeea1f1c1366e2',
                        blockName: 'Reference Links',

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
                    id: '6928b626ae41f527d2ef0b7e',

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
                triggerClassName:
                  " flex lg:hidden cursor-pointer group/menu text-xl whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:text-accent-foreground px-4 py-2 has-[>svg]:px-3 extend-touch-target touch-manipulation items-center justify-start gap-2.5 !p-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",

                triggerChildren: [
                  {
                    blockType: 'IconChild',
                    icon: 'menu',
                    ClassName: 'group-data-[popup-open]/menu:hidden flex',
                    id: '692f33d7d7ed1cbbd4cb346d',
                    blockName: 'Menu',

                    staticDataAttributes: [],
                  },

                  {
                    blockType: 'IconChild',
                    icon: 'close',
                    ClassName: 'group-data-[popup-open]/menu:flex hidden',
                    id: '692f33dcd7ed1cbbd4cb346e',
                    blockName: '',

                    staticDataAttributes: [],
                  },

                  {
                    blockType: 'SimpleTextChild',
                    tagType: 'span',
                    ClassName: 'flex items-center leading-none font-medium ',
                    text: 'Menu',
                    id: '692893c518f4a1a54c700a69',

                    contentActions: {
                      actionBlocks: [],
                    },

                    staticDataAttributes: [],
                  },
                ],

                triggerActions: {
                  actionBlocks: [],

                  actions: ['ActSetPortalOpen'],

                  runners: [
                    {
                      type: 'RunSetBool',
                      key: 'menu',
                      persisted: false,
                      initialValue: false,
                    },
                  ],

                  attributers: [],
                },
                backdropClassName: '',
                id: '6928923418f4a1a54c700a67',

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
                linkType: 'internalLink',

                internalLink: toPageRelationship(home),
                triggerClassName: 'menu-trigger-icon hidden lg:flex',

                triggerChildren: [
                  {
                    blockType: 'IconChild',
                    icon: 'logo',
                    ClassName: 'size-5',
                    id: '69288190df37686e6978aec2',

                    staticDataAttributes: [],
                  },
                ],
                id: '69288150df37686e6978aec1',
                blockName: 'Logo Home Page Link',

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
                type: 'tag',
                tagType: 'nav',
                ClassName: 'items-center hidden lg:flex',

                children: [
                  {
                    blockType: 'AtomicChild',
                    type: 'button',
                    tagType: 'div',
                    buttonType: 'link',
                    linkType: 'internalLink',

                    internalLink: toPageRelationship(testing),
                    triggerClassName: 'menu-trigger-text',

                    triggerChildren: [
                      {
                        blockType: 'SimpleTextChild',
                        tagType: 'span',
                        text: 'Testing',
                        id: '69287facdf37686e6978aeb5',

                        contentActions: {
                          actionBlocks: [],
                        },

                        staticDataAttributes: [],
                      },
                    ],
                    id: '69287facdf37686e6978aeb4',
                    blockName: 'Testing',

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
                    linkType: 'internalLink',

                    internalLink: toPageRelationship(prose),
                    triggerClassName: 'menu-trigger-text',

                    triggerChildren: [
                      {
                        blockType: 'SimpleTextChild',
                        tagType: 'span',
                        text: 'Prose',
                        id: '69287facdf37686e6978aeb5',

                        contentActions: {
                          actionBlocks: [],
                        },

                        staticDataAttributes: [],
                      },
                    ],
                    id: '69287facdf37686e6978aeb4',
                    blockName: 'Prose',

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
                    externalLink: 'atomicpayload.com',
                    triggerClassName: 'menu-trigger-text',

                    triggerChildren: [
                      {
                        blockType: 'SimpleTextChild',
                        tagType: 'span',
                        text: 'Docs',
                        id: '69287e50df37686e6978aeb2',

                        contentActions: {
                          actionBlocks: [],
                        },

                        staticDataAttributes: [],
                      },
                    ],
                    id: '69287e2ddf37686e6978aeb1',
                    blockName: 'Docs',

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
                id: '69287e05df37686e6978aeb0',
                blockName: 'Main Nav',

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
                ClassName: 'ml-auto flex items-center gap-2 md:flex-1 md:justify-end',

                children: [
                  {
                    blockType: 'AtomicChild',
                    type: 'button',
                    tagType: 'div',
                    buttonType: 'link',
                    linkType: 'externalLink',
                    externalLink: 'www.github.com',
                    triggerClassName: 'menu-trigger-both',

                    triggerChildren: [
                      {
                        blockType: 'IconChild',
                        icon: 'github',
                        ClassName: 'position-center',
                        id: '69288c9e18f4a1a54c700a57',

                        staticDataAttributes: [],
                      },

                      {
                        blockType: 'SimpleTextChild',
                        tagType: 'span',
                        ClassName: 'text-muted-foreground w-fit text-xs tabular-nums',
                        text: 'Github',
                        id: '692882d1df37686e6978aec8',

                        contentActions: {
                          actionBlocks: [],
                        },

                        staticDataAttributes: [],
                      },
                    ],
                    id: '692882bfdf37686e6978aec7',
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
                    type: 'tag',
                    tagType: 'div',
                    ClassName: 'ui-seperator',

                    staticDataAttributes: [
                      {
                        key: 'orientation',
                        value: 'vertical',
                        id: '692882acdf37686e6978aec6',
                      },
                    ],
                    id: '69288266df37686e6978aec4',
                    blockName: 'Seperator',

                    children: [],

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
                  },

                  {
                    blockType: 'AtomicChild',
                    type: 'button',
                    tagType: 'div',
                    buttonType: 'portal',
                    portalType: 'dialog',
                    portalName: 'consent',
                    persisted: true,
                    ClassName:
                      'fixed top-[calc(50%+1.25rem*var(--nested-dialogs))] left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 scale-[calc(1-0.1*var(--nested-dialogs))] rounded-lg bg-background p-6 text-foreground outline outline-1 outline-border transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[nested-dialog-open]:after:absolute data-[nested-dialog-open]:after:inset-0 data-[nested-dialog-open]:after:rounded-[inherit] data-[nested-dialog-open]:after:bg-accent/5 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 border-border',

                    children: [
                      {
                        blockType: 'AtomicChild',
                        type: 'tag',
                        tagType: 'div',
                        ClassName: 'flex flex-col gap-1.5 relative',

                        children: [
                          {
                            blockType: 'SimpleTextChild',
                            tagType: 'h3',
                            ClassName: 'text-2xl leading-none',
                            text: 'Cookie Consent',
                            id: '69330e270e7c3976269e9092',

                            contentActions: {
                              actionBlocks: [],
                            },

                            staticDataAttributes: [],
                          },

                          {
                            blockType: 'SimpleTextChild',
                            tagType: 'p',
                            text: 'This is the cookie consent management dialog. Enhance as you see fit.',
                            id: '69330e3d0e7c3976269e9093',

                            contentActions: {
                              actionBlocks: [],
                            },

                            staticDataAttributes: [],
                          },

                          {
                            blockType: 'AtomicChild',
                            type: 'button',
                            tagType: 'div',
                            buttonType: 'regular',
                            triggerClassName: 'trigger trigger-style-ghost trigger-size-sm absolute top-0 right-0 mt-[-8px] mr-[-4px]',
                            screenReaderText: 'Close consent dialog.',

                            triggerChildren: [
                              {
                                blockType: 'IconChild',
                                icon: 'close',
                                ariaHidden: true,
                                ClassName: 'size-3',
                                id: '693334d6187048963ccfa145',

                                staticDataAttributes: [],
                              },
                            ],

                            triggerActions: {
                              actionBlocks: [
                                {
                                  blockType: 'ActSetPortalOpen',
                                  portal: 'consent',
                                  id: '693334d6187048963ccfa146',
                                },
                              ],

                              actions: ['ActSetPortalOpen'],

                              runners: [
                                {
                                  type: 'RunSetBool',
                                  key: 'consent',
                                  initialValue: true,
                                  persisted: true,
                                },
                              ],

                              attributers: [],
                            },
                            id: '693334ce3dc3aa372c7fa57d',

                            children: [],

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
                        id: '69330e180e7c3976269e9091',
                        blockName: 'Title & Description & Close',

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
                        ClassName: 'flex flex-col gap-2 mt-4',

                        children: [
                          {
                            blockType: 'AtomicChild',
                            type: 'tag',
                            tagType: 'div',
                            ClassName: 'flex flex-row justify-between items-center',

                            children: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'label',
                                ClassName: 'text-lg',
                                htmlFor: 'functional',
                                text: 'Functional',
                                id: '693326e43dc3aa372c7fa53e',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },

                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'regular',
                                triggerClassName: 'trigger consent-trigger group',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:flex hidden',
                                    text: 'Enabled',
                                    id: '693327423dc3aa372c7fa540',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },

                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:hidden flex',
                                    text: 'Disabled',
                                    id: '6933280d3dc3aa372c7fa542',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetCC',
                                      perform: 'preference',
                                      key: 'functional',
                                      setDA: true,
                                      changeKey: 'enabled',
                                      id: '6933282b3dc3aa372c7fa543',
                                    },
                                  ],

                                  actions: ['ActSetCC'],

                                  runners: [
                                    {
                                      type: 'RunSetCC',

                                      values: {
                                        perform: 'preference',
                                        key: 'functional',
                                      },
                                    },
                                  ],

                                  attributers: [
                                    {
                                      type: 'AttCCToDA',

                                      listen: {
                                        listen: 'preference',
                                        key: 'functional',
                                      },
                                      changeKey: 'enabled',
                                    },
                                  ],
                                },
                                cid: 'functional',
                                id: '693327103dc3aa372c7fa53f',

                                children: [],

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
                            id: '693326773dc3aa372c7fa53d',
                            blockName: 'Functional',

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
                            ClassName: 'flex flex-row justify-between items-center',

                            children: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'label',
                                ClassName: 'text-lg',
                                htmlFor: 'security',
                                text: 'Security',
                                id: '69332c933dc3aa372c7fa555',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },

                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'regular',
                                triggerClassName: 'trigger consent-trigger group',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:flex hidden',
                                    text: 'Enabled',
                                    id: '69332c933dc3aa372c7fa557',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },

                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:hidden flex',
                                    text: 'Disabled',
                                    id: '69332c933dc3aa372c7fa558',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetCC',
                                      perform: 'preference',
                                      key: 'security',
                                      setDA: true,
                                      changeKey: 'enabled',
                                      id: '69332c933dc3aa372c7fa559',
                                    },
                                  ],

                                  actions: ['ActSetCC'],

                                  runners: [
                                    {
                                      type: 'RunSetCC',

                                      values: {
                                        perform: 'preference',
                                        key: 'security',
                                      },
                                    },
                                  ],

                                  attributers: [
                                    {
                                      type: 'AttCCToDA',

                                      listen: {
                                        listen: 'preference',
                                        key: 'security',
                                      },
                                      changeKey: 'enabled',
                                    },
                                  ],
                                },
                                cid: 'security',
                                id: '69332c933dc3aa372c7fa556',

                                children: [],

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
                            id: '69332c933dc3aa372c7fa554',
                            blockName: 'Security',

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
                            ClassName: 'flex flex-row justify-between items-center',

                            children: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'label',
                                ClassName: 'text-lg',
                                htmlFor: 'analytics',
                                text: 'Analytics',
                                id: '69332ce63dc3aa372c7fa55b',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },

                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'regular',
                                triggerClassName: 'trigger consent-trigger group',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:flex hidden',
                                    text: 'Enabled',
                                    id: '69332ce63dc3aa372c7fa55d',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },

                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:hidden flex',
                                    text: 'Disabled',
                                    id: '69332ce63dc3aa372c7fa55e',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetCC',
                                      perform: 'preference',
                                      key: 'analytics',
                                      setDA: true,
                                      changeKey: 'enabled',
                                      id: '69332ce63dc3aa372c7fa55f',
                                    },
                                  ],

                                  actions: ['ActSetCC'],

                                  runners: [
                                    {
                                      type: 'RunSetCC',

                                      values: {
                                        perform: 'preference',
                                        key: 'analytics',
                                      },
                                    },
                                  ],

                                  attributers: [
                                    {
                                      type: 'AttCCToDA',

                                      listen: {
                                        listen: 'preference',
                                        key: 'analytics',
                                      },
                                      changeKey: 'enabled',
                                    },
                                  ],
                                },
                                cid: 'analytics',
                                id: '69332ce63dc3aa372c7fa55c',

                                children: [],

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
                            id: '69332ce63dc3aa372c7fa55a',
                            blockName: 'Analytics',

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
                            ClassName: 'flex flex-row justify-between items-center',

                            children: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'label',
                                ClassName: 'text-lg',
                                htmlFor: 'marketing',
                                text: 'Marketing',
                                id: '693330dc3dc3aa372c7fa561',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },

                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'regular',
                                triggerClassName: 'trigger consent-trigger group',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:flex hidden',
                                    text: 'Enabled',
                                    id: '693330dc3dc3aa372c7fa563',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },

                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:hidden flex',
                                    text: 'Disabled',
                                    id: '693330dc3dc3aa372c7fa564',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetCC',
                                      perform: 'preference',
                                      key: 'marketing',
                                      setDA: true,
                                      changeKey: 'enabled',
                                      id: '693330dc3dc3aa372c7fa565',
                                    },
                                  ],

                                  actions: ['ActSetCC'],

                                  runners: [
                                    {
                                      type: 'RunSetCC',

                                      values: {
                                        perform: 'preference',
                                        key: 'marketing',
                                      },
                                    },
                                  ],

                                  attributers: [
                                    {
                                      type: 'AttCCToDA',

                                      listen: {
                                        listen: 'preference',
                                        key: 'marketing',
                                      },
                                      changeKey: 'enabled',
                                    },
                                  ],
                                },
                                cid: 'marketing',
                                id: '693330dc3dc3aa372c7fa562',

                                children: [],

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
                            id: '693330dc3dc3aa372c7fa560',
                            blockName: 'Marketing',

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
                            ClassName: 'flex flex-row justify-between items-center',

                            children: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'label',
                                ClassName: 'text-lg',
                                htmlFor: 'userData',
                                text: 'User Data',
                                id: '6933311d3dc3aa372c7fa567',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },

                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'regular',
                                triggerClassName: 'trigger consent-trigger group',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:flex hidden',
                                    text: 'Enabled',
                                    id: '6933311d3dc3aa372c7fa569',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },

                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:hidden flex',
                                    text: 'Disabled',
                                    id: '6933311d3dc3aa372c7fa56a',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetCC',
                                      perform: 'preference',
                                      key: 'userData',
                                      setDA: true,
                                      changeKey: 'enabled',
                                      id: '6933311d3dc3aa372c7fa56b',
                                    },
                                  ],

                                  actions: ['ActSetCC'],

                                  runners: [
                                    {
                                      type: 'RunSetCC',

                                      values: {
                                        perform: 'preference',
                                        key: 'userData',
                                      },
                                    },
                                  ],

                                  attributers: [
                                    {
                                      type: 'AttCCToDA',

                                      listen: {
                                        listen: 'preference',
                                        key: 'userData',
                                      },
                                      changeKey: 'enabled',
                                    },
                                  ],
                                },
                                cid: 'userData',
                                id: '6933311d3dc3aa372c7fa568',

                                children: [],

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
                            id: '6933311d3dc3aa372c7fa566',
                            blockName: 'User Data',

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
                            ClassName: 'flex flex-row justify-between items-center',

                            children: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'label',
                                ClassName: 'text-lg',
                                htmlFor: 'adPersonalization',
                                text: 'Ad Personalization',
                                id: '693331693dc3aa372c7fa56d',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },

                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'regular',
                                triggerClassName: 'trigger consent-trigger group',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:flex hidden',
                                    text: 'Enabled',
                                    id: '693331693dc3aa372c7fa56f',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },

                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:hidden flex',
                                    text: 'Disabled',
                                    id: '693331693dc3aa372c7fa570',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetCC',
                                      perform: 'preference',
                                      key: 'adPersonalization',
                                      setDA: true,
                                      changeKey: 'enabled',
                                      id: '693331693dc3aa372c7fa571',
                                    },
                                  ],

                                  actions: ['ActSetCC'],

                                  runners: [
                                    {
                                      type: 'RunSetCC',

                                      values: {
                                        perform: 'preference',
                                        key: 'adPersonalization',
                                      },
                                    },
                                  ],

                                  attributers: [
                                    {
                                      type: 'AttCCToDA',

                                      listen: {
                                        listen: 'preference',
                                        key: 'adPersonalization',
                                      },
                                      changeKey: 'enabled',
                                    },
                                  ],
                                },
                                cid: 'adPersonalization',
                                id: '693331693dc3aa372c7fa56e',

                                children: [],

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
                            id: '693331693dc3aa372c7fa56c',
                            blockName: 'Ad Personalization',

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
                            ClassName: 'flex flex-row justify-between items-center',

                            children: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'label',
                                ClassName: 'text-lg',
                                htmlFor: 'contentPersonalization',
                                text: 'Content Personalization',
                                id: '693331be3dc3aa372c7fa573',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },

                              {
                                blockType: 'AtomicChild',
                                type: 'button',
                                tagType: 'div',
                                buttonType: 'regular',
                                triggerClassName: 'trigger consent-trigger group',

                                triggerChildren: [
                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:flex hidden',
                                    text: 'Enabled',
                                    id: '693331be3dc3aa372c7fa575',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },

                                  {
                                    blockType: 'SimpleTextChild',
                                    tagType: 'span',
                                    ClassName: 'group-data-[enabled]:hidden flex',
                                    text: 'Disabled',
                                    id: '693331be3dc3aa372c7fa576',

                                    contentActions: {
                                      actionBlocks: [],
                                    },

                                    staticDataAttributes: [],
                                  },
                                ],

                                triggerActions: {
                                  actionBlocks: [
                                    {
                                      blockType: 'ActSetCC',
                                      perform: 'preference',
                                      key: 'contentPersonalization',
                                      setDA: true,
                                      changeKey: 'enabled',
                                      id: '693331be3dc3aa372c7fa577',
                                    },
                                  ],

                                  actions: ['ActSetCC'],

                                  runners: [
                                    {
                                      type: 'RunSetCC',

                                      values: {
                                        perform: 'preference',
                                        key: 'contentPersonalization',
                                      },
                                    },
                                  ],

                                  attributers: [
                                    {
                                      type: 'AttCCToDA',

                                      listen: {
                                        listen: 'preference',
                                        key: 'contentPersonalization',
                                      },
                                      changeKey: 'enabled',
                                    },
                                  ],
                                },
                                cid: 'contentPersonalization',
                                id: '693331be3dc3aa372c7fa574',

                                children: [],

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
                            id: '693331be3dc3aa372c7fa572',
                            blockName: 'Content Personalization',

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
                        id: '693326473dc3aa372c7fa53c',
                        blockName: 'Toggles',

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
                        ClassName: 'flex flex-row justify-between mt-4',

                        children: [
                          {
                            blockType: 'AtomicChild',
                            type: 'button',
                            tagType: 'div',
                            buttonType: 'regular',
                            triggerClassName: 'trigger trigger-style-destructive trigger-size-base',

                            triggerChildren: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'fragment',
                                text: 'Decline',
                                id: '693336213dc3aa372c7fa580',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },
                            ],

                            triggerActions: {
                              actionBlocks: [
                                {
                                  blockType: 'ActSetCC',
                                  perform: 'decline',
                                  setDA: true,
                                  id: '6933364d3dc3aa372c7fa581',
                                },

                                {
                                  blockType: 'ActSetPortalOpen',
                                  portal: 'consent',
                                  id: '6933365b3dc3aa372c7fa582',
                                },
                              ],

                              actions: ['ActSetCC', 'ActSetPortalOpen'],

                              runners: [
                                {
                                  type: 'RunSetCC',

                                  values: {
                                    perform: 'decline',
                                  },
                                },

                                {
                                  type: 'RunSetBool',
                                  key: 'consent',
                                  initialValue: true,
                                  persisted: true,
                                },
                              ],

                              attributers: [
                                {
                                  type: 'AttCCToDA',

                                  listen: {
                                    listen: 'decline',
                                  },
                                },
                              ],
                            },
                            id: '693335f93dc3aa372c7fa57f',
                            blockName: 'Decline',

                            children: [],

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
                            buttonType: 'regular',
                            triggerClassName: 'trigger trigger-size-base bg-success/60 hover:bg-success/80 data-[accepted]:bg-success/80',

                            triggerChildren: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'fragment',
                                text: 'Accept',
                                id: '6933367f3dc3aa372c7fa584',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },
                            ],

                            triggerActions: {
                              actionBlocks: [
                                {
                                  blockType: 'ActSetCC',
                                  perform: 'accept',
                                  setDA: true,
                                  id: '6933367f3dc3aa372c7fa585',
                                },

                                {
                                  blockType: 'ActSetPortalOpen',
                                  portal: 'consent',
                                  id: '6933367f3dc3aa372c7fa586',
                                },
                              ],

                              actions: ['ActSetCC', 'ActSetPortalOpen'],

                              runners: [
                                {
                                  type: 'RunSetCC',

                                  values: {
                                    perform: 'accept',
                                  },
                                },

                                {
                                  type: 'RunSetBool',
                                  key: 'consent',
                                  initialValue: true,
                                  persisted: true,
                                },
                              ],

                              attributers: [
                                {
                                  type: 'AttCCToDA',

                                  listen: {
                                    listen: 'accept',
                                  },
                                },
                              ],
                            },
                            id: '6933367f3dc3aa372c7fa583',
                            blockName: 'Accept',

                            children: [],

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
                            buttonType: 'regular',
                            triggerClassName: 'trigger trigger-size-base bg-success/60 hover:bg-success/80 data-[accepted]:bg-success/80',

                            triggerChildren: [
                              {
                                blockType: 'SimpleTextChild',
                                tagType: 'fragment',
                                text: 'Accept All',
                                id: '693337053dc3aa372c7fa588',

                                contentActions: {
                                  actionBlocks: [],
                                },

                                staticDataAttributes: [],
                              },
                            ],

                            triggerActions: {
                              actionBlocks: [
                                {
                                  blockType: 'ActSetCC',
                                  perform: 'accept',
                                  acceptAll: true,
                                  setDA: true,
                                  changeKey: '',
                                  id: '693337053dc3aa372c7fa589',
                                },

                                {
                                  blockType: 'ActSetPortalOpen',
                                  portal: 'consent',
                                  id: '693337053dc3aa372c7fa58a',
                                },
                              ],

                              actions: ['ActSetCC', 'ActSetPortalOpen'],

                              runners: [
                                {
                                  type: 'RunSetCC',

                                  values: {
                                    perform: 'accept',
                                    acceptAll: true,
                                  },
                                },

                                {
                                  type: 'RunSetBool',
                                  key: 'consent',
                                  initialValue: true,
                                  persisted: true,
                                },
                              ],

                              attributers: [
                                {
                                  type: 'AttCCToDA',

                                  listen: {
                                    listen: 'accept',
                                  },
                                  changeKey: '',
                                },
                              ],
                            },
                            id: '693337053dc3aa372c7fa587',
                            blockName: 'Accept All',

                            children: [],

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
                        id: '693335af3dc3aa372c7fa57e',
                        blockName: 'Decline & Accepts',

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
                    triggerClassName: 'menu-trigger-icon flex',
                    screenReaderText: 'Toggle theme',

                    triggerChildren: [
                      {
                        blockType: 'IconChild',
                        icon: 'cookie',
                        ClassName: 'size-4.5',
                        id: '69330b9e0e7c3976269e908f',

                        staticDataAttributes: [],
                      },
                    ],

                    triggerActions: {
                      actionBlocks: [],

                      actions: ['ActSetPortalOpen'],

                      runners: [
                        {
                          type: 'RunSetBool',
                          key: 'consent',
                          persisted: true,
                          initialValue: true,
                        },
                      ],

                      attributers: [],
                    },
                    backdropClassName:
                      'fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute',

                    ds: {
                      defaultOpen: true,
                      dismissible: true,
                    },
                    id: '69330b9e0e7c3976269e908e',
                    blockName: 'Cookie Toggle',

                    contentActions: {
                      actionBlocks: [],
                    },

                    formRateLimitBlocks: [],

                    formSanitationBlocks: [],

                    formValidationBlocks: [],

                    inputSanitationBlocks: [],

                    inputValidationBlocks: [],

                    backdropChildren: [],

                    pops: {},

                    triggerStaticDataAttributes: [],

                    staticDataAttributes: [],
                  },

                  {
                    blockType: 'AtomicChild',
                    type: 'tag',
                    tagType: 'div',
                    ClassName: 'ui-seperator',

                    staticDataAttributes: [
                      {
                        key: 'orientation',
                        value: 'vertical',
                        id: '693309ab0e7c3976269e908a',
                      },
                    ],
                    id: '693309ab0e7c3976269e9089',
                    blockName: 'Seperator',

                    children: [],

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
                  },

                  {
                    blockType: 'AtomicChild',
                    type: 'button',
                    tagType: 'div',
                    buttonType: 'regular',
                    triggerClassName: 'menu-trigger-icon flex',
                    screenReaderText: 'Toggle theme',

                    triggerChildren: [
                      {
                        blockType: 'IconChild',
                        icon: 'theme',
                        ClassName: 'size-4.5',
                        id: '6928859adf37686e6978aeca',

                        staticDataAttributes: [],
                      },
                    ],

                    triggerActions: {
                      actionBlocks: [
                        {
                          blockType: 'ActSetTheme',
                          perform: 'cycle',
                          id: '692885eb5a0c1e888eb3e6f1',
                        },
                      ],

                      actions: ['ActSetTheme'],

                      runners: [
                        {
                          type: 'RunSetTheme',
                          perform: 'cycle',
                        },
                      ],

                      attributers: [],
                    },
                    id: '69288588df37686e6978aec9',
                    blockName: 'Theme Toggle',

                    children: [],

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
                id: '692881e8df37686e6978aec3',
                blockName: 'Right Side Nav / Functional Buttons',

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
            id: '69275275eb8aaaca85b3a423',

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
        id: '69275249eb8aaaca85b3a422',

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

    storedAtomicClasses: [
      'bg-background',
      'sticky',
      'top-0',
      'z-50',
      'w-full',
      'container-wrapper',
      '3xl:fixed:px-0',
      'px-6',
      '3xl:fixed:container',
      'flex',
      'h-hh',
      'items-center',
      '**:data-[slot=separator]:!h-4',
      'fixed',
      'top-[calc(var(--spacing)*14)]',
      'bottom-0',
      'left-0',
      'right-0',
      'min-h-dvh',
      'transition-all',
      'duration-150',
      'data-[ending-style]:opacity-0',
      'data-[starting-style]:opacity-0',
      'overflow-y-auto',
      'backdrop-blur',
      'bg-background/80',
      'no-scrollbar',
      'flex-col',
      'gap-12',
      'overflow-auto',
      'py-6',
      'gap-4',
      'text-muted-foreground',
      'text-sm',
      'font-medium',
      'gap-3',
      'text-2xl',
      '',
      'lg:hidden',
      'cursor-pointer',
      'group/menu',
      'text-xl',
      'whitespace-nowrap',
      'rounded-md',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      '[&_svg]:pointer-events-none',
      "[&_svg:not([class*='size-'])]:size-4",
      'shrink-0',
      '[&_svg]:shrink-0',
      'outline-none',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'aria-invalid:ring-destructive/20',
      'dark:aria-invalid:ring-destructive/40',
      'aria-invalid:border-destructive',
      'hover:text-accent-foreground',
      'px-4',
      'py-2',
      'has-[>svg]:px-3',
      'extend-touch-target',
      'touch-manipulation',
      'justify-start',
      'gap-2.5',
      '!p-0',
      'hover:bg-transparent',
      'focus-visible:bg-transparent',
      'focus-visible:ring-0',
      'active:bg-transparent',
      'dark:hover:bg-transparent',
      'group-data-[popup-open]/menu:hidden',
      'group-data-[popup-open]/menu:flex',
      'hidden',
      'leading-none',
      'menu-trigger-icon',
      'lg:flex',
      'size-5',
      'menu-trigger-text',
      'ml-auto',
      'gap-2',
      'md:flex-1',
      'md:justify-end',
      'menu-trigger-both',
      'position-center',
      'w-fit',
      'text-xs',
      'tabular-nums',
      'ui-seperator',
      'top-[calc(50%+1.25rem*var(--nested-dialogs))]',
      'left-1/2',
      '-mt-8',
      'w-96',
      'max-w-[calc(100vw-3rem)]',
      '-translate-x-1/2',
      '-translate-y-1/2',
      'scale-[calc(1-0.1*var(--nested-dialogs))]',
      'rounded-lg',
      'p-6',
      'text-foreground',
      'outline',
      'outline-1',
      'outline-border',
      'data-[ending-style]:scale-90',
      'data-[nested-dialog-open]:after:absolute',
      'data-[nested-dialog-open]:after:inset-0',
      'data-[nested-dialog-open]:after:rounded-[inherit]',
      'data-[nested-dialog-open]:after:bg-accent/5',
      'data-[starting-style]:scale-90',
      'border-border',
      'gap-1.5',
      'relative',
      'trigger',
      'trigger-style-ghost',
      'trigger-size-sm',
      'absolute',
      'mt-[-8px]',
      'mr-[-4px]',
      'size-3',
      'mt-4',
      'flex-row',
      'justify-between',
      'text-lg',
      'consent-trigger',
      'group',
      'group-data-[enabled]:flex',
      'group-data-[enabled]:hidden',
      'trigger-style-destructive',
      'trigger-size-base',
      'bg-success/60',
      'hover:bg-success/80',
      'data-[accepted]:bg-success/80',
      'inset-0',
      'bg-black',
      'opacity-20',
      'dark:opacity-70',
      'supports-[-webkit-touch-callout:none]:absolute',
      'size-4.5',
    ],

    storedAtomicForms: [],

    storedAtomicActions: {
      '6928b661ae41f527d2ef0b82': {
        id: '6928b661ae41f527d2ef0b82',

        actions: ['ActSetPortalOpen'],

        runners: [
          {
            type: 'RunSetBool',
            key: 'menu',
            initialValue: false,
            persisted: false,
          },
        ],

        attributers: [],
      },

      '6928b772ae41f527d2ef0b86': {
        id: '6928b772ae41f527d2ef0b86',

        actions: ['ActSetPortalOpen'],

        runners: [
          {
            type: 'RunSetBool',
            key: 'menu',
            initialValue: false,
            persisted: false,
          },
        ],

        attributers: [],
      },

      '6928923418f4a1a54c700a67': {
        id: '6928923418f4a1a54c700a67',

        actions: ['ActSetPortalOpen'],

        runners: [
          {
            type: 'RunSetBool',
            key: 'menu',
            persisted: false,
            initialValue: false,
          },
        ],

        attributers: [],
      },

      '693334ce3dc3aa372c7fa57d': {
        id: '693334ce3dc3aa372c7fa57d',

        actions: ['ActSetPortalOpen'],

        runners: [
          {
            type: 'RunSetBool',
            key: 'consent',
            initialValue: true,
            persisted: true,
          },
        ],

        attributers: [],
      },

      '693327103dc3aa372c7fa53f': {
        id: '693327103dc3aa372c7fa53f',

        actions: ['ActSetCC'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'preference',
              key: 'functional',
            },
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'preference',
              key: 'functional',
            },
            changeKey: 'enabled',
          },
        ],
      },

      '69332c933dc3aa372c7fa556': {
        id: '69332c933dc3aa372c7fa556',

        actions: ['ActSetCC'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'preference',
              key: 'security',
            },
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'preference',
              key: 'security',
            },
            changeKey: 'enabled',
          },
        ],
      },

      '69332ce63dc3aa372c7fa55c': {
        id: '69332ce63dc3aa372c7fa55c',

        actions: ['ActSetCC'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'preference',
              key: 'analytics',
            },
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'preference',
              key: 'analytics',
            },
            changeKey: 'enabled',
          },
        ],
      },

      '693330dc3dc3aa372c7fa562': {
        id: '693330dc3dc3aa372c7fa562',

        actions: ['ActSetCC'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'preference',
              key: 'marketing',
            },
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'preference',
              key: 'marketing',
            },
            changeKey: 'enabled',
          },
        ],
      },

      '6933311d3dc3aa372c7fa568': {
        id: '6933311d3dc3aa372c7fa568',

        actions: ['ActSetCC'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'preference',
              key: 'userData',
            },
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'preference',
              key: 'userData',
            },
            changeKey: 'enabled',
          },
        ],
      },

      '693331693dc3aa372c7fa56e': {
        id: '693331693dc3aa372c7fa56e',

        actions: ['ActSetCC'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'preference',
              key: 'adPersonalization',
            },
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'preference',
              key: 'adPersonalization',
            },
            changeKey: 'enabled',
          },
        ],
      },

      '693331be3dc3aa372c7fa574': {
        id: '693331be3dc3aa372c7fa574',

        actions: ['ActSetCC'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'preference',
              key: 'contentPersonalization',
            },
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'preference',
              key: 'contentPersonalization',
            },
            changeKey: 'enabled',
          },
        ],
      },

      '693335f93dc3aa372c7fa57f': {
        id: '693335f93dc3aa372c7fa57f',

        actions: ['ActSetCC', 'ActSetPortalOpen'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'decline',
            },
          },

          {
            type: 'RunSetBool',
            key: 'consent',
            initialValue: true,
            persisted: true,
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'decline',
            },
            changeKey: null,
          },
        ],
      },

      '6933367f3dc3aa372c7fa583': {
        id: '6933367f3dc3aa372c7fa583',

        actions: ['ActSetCC', 'ActSetPortalOpen'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'accept',
            },
          },

          {
            type: 'RunSetBool',
            key: 'consent',
            initialValue: true,
            persisted: true,
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'accept',
            },
            changeKey: null,
          },
        ],
      },

      '693337053dc3aa372c7fa587': {
        id: '693337053dc3aa372c7fa587',

        actions: ['ActSetCC', 'ActSetPortalOpen'],

        runners: [
          {
            type: 'RunSetCC',

            values: {
              perform: 'accept',
              acceptAll: true,
            },
          },

          {
            type: 'RunSetBool',
            key: 'consent',
            initialValue: true,
            persisted: true,
          },
        ],

        attributers: [
          {
            type: 'AttCCToDA',

            listen: {
              listen: 'accept',
            },
            changeKey: '',
          },
        ],
      },

      '69330b9e0e7c3976269e908e': {
        id: '69330b9e0e7c3976269e908e',

        actions: ['ActSetPortalOpen'],

        runners: [
          {
            type: 'RunSetBool',
            key: 'consent',
            persisted: true,
            initialValue: true,
          },
        ],

        attributers: [],
      },

      '69288588df37686e6978aec9': {
        id: '69288588df37686e6978aec9',

        actions: ['ActSetTheme'],

        runners: [
          {
            type: 'RunSetTheme',
            perform: 'cycle',
          },
        ],

        attributers: [],
      },
    },
  }
}
