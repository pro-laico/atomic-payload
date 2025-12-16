import type { Page } from '@/ts/types'
import { toPageRelationship } from '@/utilities/seedNestedRelationship'

type NotFoundArgs = {
  home: Page
}

export const notFoundPage: (args: NotFoundArgs) => Omit<Page, 'createdAt' | 'updatedAt' | 'publishedAt' | 'id'> = ({ home }) => {
  return {
    title: '404',
    slug: '404',
    slugLock: true,
    href: '/404',
    live: true,
    mainClassName: 'page-main items-center justify-center',
    _status: 'published',

    children: [
      {
        blockType: 'AtomicChild',
        type: 'tag',
        tagType: 'div',
        ClassName: 'max-w-2xl w-full text-center mx-auto bg-accent pb-12 rounded-xl p-4 text-accent-foreground',

        children: [
          {
            blockType: 'SimpleTextChild',
            tagType: 'h1',
            ClassName: 'text-[12rem] md:text-[16rem] font-bold leading-none tracking-tighter mb-8',
            text: '404',
            id: '6931de857deeea1f1c1366d2',

            contentActions: {
              actionBlocks: [],
            },

            staticDataAttributes: [],
          },

          {
            blockType: 'AtomicChild',
            type: 'tag',
            tagType: 'div',
            ClassName: 'mb-12 space-y-4',

            children: [
              {
                blockType: 'SimpleTextChild',
                tagType: 'h2',
                ClassName: 'text-3xl md:text-4xl font-bold',
                text: 'Page not found',
                id: '6931dea87deeea1f1c1366d4',

                contentActions: {
                  actionBlocks: [],
                },

                staticDataAttributes: [],
              },

              {
                blockType: 'SimpleTextChild',
                tagType: 'p',
                ClassName: 'text-lg max-w-md mx-auto leading-relaxed',
                text: "The page you're looking for doesn't exist or has been moved. ",
                id: '6931deca7deeea1f1c1366d5',

                contentActions: {
                  actionBlocks: [],
                },

                staticDataAttributes: [],
              },
            ],
            id: '6931de9f7deeea1f1c1366d3',
            blockName: 'Main Message',

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

            children: [
              {
                blockType: 'AtomicChild',
                type: 'button',
                tagType: 'div',
                buttonType: 'link',
                linkType: 'internalLink',

                internalLink: toPageRelationship(home),
                triggerClassName: 'trigger trigger-style-base trigger-size-lg',

                triggerChildren: [
                  {
                    blockType: 'SimpleTextChild',
                    tagType: 'p',
                    text: 'Home',
                    id: '6931df347deeea1f1c1366d8',

                    contentActions: {
                      actionBlocks: [],
                    },

                    staticDataAttributes: [],
                  },
                ],
                id: '6931df1b7deeea1f1c1366d7',
                blockName: 'Home',

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
            id: '6931df117deeea1f1c1366d6',
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
        id: '69274da9241f5cfdd32d4461',

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
    devMode: false,

    breadcrumbs: [
      {
        doc: '69274dbdc6c6fa92adf99960',
        url: '/404',
        label: '/404',
        id: '69274dbd58b4d28e286cff1a',
      },
    ],

    storedAtomicClasses: [
      'page-main',
      'items-center',
      'justify-center',
      'max-w-2xl',
      'w-full',
      'text-center',
      'mx-auto',
      'bg-accent',
      'pb-12',
      'rounded-xl',
      'p-4',
      'text-accent-foreground',
      'text-[12rem]',
      'md:text-[16rem]',
      'font-bold',
      'leading-none',
      'tracking-tighter',
      'mb-8',
      'mb-12',
      'space-y-4',
      'text-3xl',
      'md:text-4xl',
      'text-lg',
      'max-w-md',
      'leading-relaxed',
      'trigger',
      'trigger-style-base',
      'trigger-size-lg',
    ],
  }
}
