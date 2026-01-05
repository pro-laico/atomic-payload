import type { Footer, Page } from '@/ts/types'

type FooterArgs = { page: Page }

export const footer: (args: FooterArgs) => Omit<Footer, 'createdAt' | 'updatedAt' | 'id'> = ({ page }) => {
  return {
    active: true,
    devMode: true,
    title: 'Base Footer',
    _status: 'published',

    testPath: page,

    ClassName:
      'group-has-[.section-soft]/body:bg-surface/40 3xl:fixed:bg-transparent group-has-[.docs-nav]/body:pb-20 group-has-[.docs-nav]/body:sm:pb-0 dark:bg-transparent',

    children: [
      {
        blockType: 'AtomicChild',
        type: 'tag',
        tagType: 'div',
        ClassName: 'container-wrapper px-4 xl:px-6',

        children: [
          {
            blockType: 'AtomicChild',
            type: 'tag',
            tagType: 'div',
            ClassName: 'flex h-fh items-center justify-between',

            children: [
              {
                blockType: 'AtomicChild',
                type: 'tag',
                tagType: 'div',
                ClassName: 'text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm',

                children: [
                  {
                    blockType: 'SimpleTextChild',
                    tagType: 'fragment',
                    text: 'Built by ',
                    id: '6928904b18f4a1a54c700a5b',

                    contentActions: {
                      actionBlocks: [],
                    },

                    staticDataAttributes: [],
                  },

                  {
                    blockType: 'AtomicChild',
                    type: 'button',
                    tagType: 'div',
                    buttonType: 'link',
                    linkType: 'externalLink',
                    externalLink: 'www.google.com',
                    triggerClassName: 'font-medium underline underline-offset-4',

                    triggerChildren: [
                      {
                        blockType: 'SimpleTextChild',
                        tagType: 'fragment',
                        text: 'Atomic Payload',
                        id: '6928909518f4a1a54c700a5d',

                        contentActions: {
                          actionBlocks: [],
                        },

                        staticDataAttributes: [],
                      },
                    ],
                    id: '6928905618f4a1a54c700a5c',
                    blockName: 'Atomic Payload',

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
                    blockType: 'SimpleTextChild',
                    tagType: 'fragment',
                    text: ' at ',
                    id: '692890b218f4a1a54c700a5f',

                    contentActions: {
                      actionBlocks: [],
                    },

                    staticDataAttributes: [],
                  },

                  {
                    blockType: 'AtomicChild',
                    type: 'button',
                    tagType: 'div',
                    buttonType: 'link',
                    linkType: 'externalLink',
                    externalLink: 'www.google.com',
                    triggerClassName: 'font-medium underline underline-offset-4',

                    triggerChildren: [
                      {
                        blockType: 'SimpleTextChild',
                        tagType: 'fragment',
                        text: 'Pro Laico',
                        id: '692890d518f4a1a54c700a61',

                        contentActions: {
                          actionBlocks: [],
                        },

                        staticDataAttributes: [],
                      },
                    ],
                    id: '692890c618f4a1a54c700a60',
                    blockName: 'Pro Laico',

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
                    blockType: 'SimpleTextChild',
                    tagType: 'span',
                    text: '. The source code is available on ',
                    id: '692890f118f4a1a54c700a62',

                    contentActions: {
                      actionBlocks: [],
                    },

                    staticDataAttributes: [],
                  },

                  {
                    blockType: 'AtomicChild',
                    type: 'button',
                    tagType: 'div',
                    buttonType: 'link',
                    linkType: 'externalLink',
                    externalLink: 'www.github.com',
                    triggerClassName: 'font-medium underline underline-offset-4',

                    triggerChildren: [
                      {
                        blockType: 'SimpleTextChild',
                        tagType: 'fragment',
                        text: 'Github',
                        id: '69289191fe1cea35207f00ec',

                        contentActions: {
                          actionBlocks: [],
                        },

                        staticDataAttributes: [],
                      },
                    ],
                    id: '6928918f18f4a1a54c700a65',
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
                    blockType: 'SimpleTextChild',
                    tagType: 'fragment',
                    text: '.',
                    id: '6928919718f4a1a54c700a66',

                    contentActions: {
                      actionBlocks: [],
                    },

                    staticDataAttributes: [],
                  },
                ],
                id: '6928904618f4a1a54c700a5a',

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
            id: '6928902318f4a1a54c700a58',

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
        id: '692752aceb8aaaca85b3a424',

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
      'group-has-[.section-soft]/body:bg-surface/40',
      '3xl:fixed:bg-transparent',
      'group-has-[.docs-nav]/body:pb-20',
      'group-has-[.docs-nav]/body:sm:pb-0',
      'dark:bg-transparent',
      'container-wrapper',
      'px-4',
      'xl:px-6',
      'flex',
      'h-fh',
      'items-center',
      'justify-between',
      'text-muted-foreground',
      'w-full',
      'px-1',
      'text-center',
      'text-xs',
      'leading-loose',
      'sm:text-sm',
      'font-medium',
      'underline',
      'underline-offset-4',
    ],

    storedAtomicForms: [],
  }
}
