import type { Page } from '@/ts/types'

export const prosePage: Omit<Page, 'createdAt' | 'updatedAt' | 'publishedAt' | 'id'> = {
  title: 'Prose',
  slug: 'prose',
  slugLock: true,
  href: '/prose',
  live: true,
  mainClassName: 'page-main',

  children: [
    {
      blockType: 'AtomicChild',
      type: 'tag',
      tagType: 'div',
      ClassName: 'grid grid-cols-4 gap-4 divide-dashed divide-x',

      children: [
        {
          blockType: 'AtomicChild',
          type: 'tag',
          tagType: 'div',
          ClassName: 'flex flex-col p-2 divide-y',

          children: [
            {
              blockType: 'SimpleTextChild',
              tagType: 'h2',
              ClassName: 'pb-2 text-brand-primary',
              text: '"prose dark:prose-invert"',
              id: '696e84fd958b03d39c9eea6f',

              contentActions: {
                actionBlocks: [],
              },

              staticDataAttributes: [],
            },

            {
              blockType: 'RichTextChild',
              ClassName: 'prose dark:prose-invert',

              richText: {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Two',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h2',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Three',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h3',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Four',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h4',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Ordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 1,
                        },

                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Ordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 2,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'list',
                      version: 1,
                      listType: 'number',
                      start: 1,
                      tag: 'ol',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Unordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 1,
                        },

                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Unordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 2,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'list',
                      version: 1,
                      listType: 'bullet',
                      start: 1,
                      tag: 'ul',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Blockquote',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'quote',
                      version: 1,
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Link',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'link',
                          version: 3,

                          fields: {
                            url: 'https://atomicpayload.com',
                            newTab: true,
                            linkType: 'custom',
                          },
                          id: '696e774b1afb0034478aaad7',
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'root',
                  version: 1,
                },
              },
              id: '696e8516958b03d39c9eea70',

              staticDataAttributes: [],
            },
          ],
          id: '696e84ea958b03d39c9eea6e',

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
          ClassName: 'flex flex-col p-2 divide-y',

          children: [
            {
              blockType: 'SimpleTextChild',
              tagType: 'h2',
              ClassName: 'pb-2 text-brand-primary',
              text: '"prose dark:prose-invert prose-sm"',
              id: '696e852c958b03d39c9eea72',

              contentActions: {
                actionBlocks: [],
              },

              staticDataAttributes: [],
            },

            {
              blockType: 'RichTextChild',
              ClassName: 'prose dark:prose-invert prose-sm',

              richText: {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Two',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h2',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Three',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h3',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Four',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h4',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Ordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 1,
                        },

                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Ordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 2,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'list',
                      version: 1,
                      listType: 'number',
                      start: 1,
                      tag: 'ol',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Unordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 1,
                        },

                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Unordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 2,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'list',
                      version: 1,
                      listType: 'bullet',
                      start: 1,
                      tag: 'ul',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Blockquote',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'quote',
                      version: 1,
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Link',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'link',
                          version: 3,

                          fields: {
                            url: 'https://atomicpayload.com',
                            newTab: true,
                            linkType: 'custom',
                          },
                          id: '696e774b1afb0034478aaad7',
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'root',
                  version: 1,
                },
              },
              id: '696e852c958b03d39c9eea73',

              staticDataAttributes: [],
            },
          ],
          id: '696e852c958b03d39c9eea71',

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
          ClassName: 'flex flex-col p-2 divide-y',

          children: [
            {
              blockType: 'SimpleTextChild',
              tagType: 'h2',
              ClassName: 'pb-2 text-brand-primary',
              text: '"prose dark:prose-invert prose-base"',
              id: '696e852e958b03d39c9eea75',

              contentActions: {
                actionBlocks: [],
              },

              staticDataAttributes: [],
            },

            {
              blockType: 'RichTextChild',
              ClassName: 'prose dark:prose-invert prose-base',

              richText: {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Two',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h2',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Three',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h3',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Four',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h4',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Ordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 1,
                        },

                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Ordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 2,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'list',
                      version: 1,
                      listType: 'number',
                      start: 1,
                      tag: 'ol',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Unordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 1,
                        },

                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Unordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 2,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'list',
                      version: 1,
                      listType: 'bullet',
                      start: 1,
                      tag: 'ul',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Blockquote',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'quote',
                      version: 1,
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Link',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'link',
                          version: 3,

                          fields: {
                            url: 'https://atomicpayload.com',
                            newTab: true,
                            linkType: 'custom',
                          },
                          id: '696e774b1afb0034478aaad7',
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'root',
                  version: 1,
                },
              },
              id: '696e852e958b03d39c9eea76',

              staticDataAttributes: [],
            },
          ],
          id: '696e852e958b03d39c9eea74',

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
          ClassName: 'flex flex-col p-2 divide-y',

          children: [
            {
              blockType: 'SimpleTextChild',
              tagType: 'h2',
              ClassName: 'pb-2 text-brand-primary',
              text: '"prose dark:prose-invert prose-lg"',
              id: '696e852f958b03d39c9eea78',

              contentActions: {
                actionBlocks: [],
              },

              staticDataAttributes: [],
            },

            {
              blockType: 'RichTextChild',
              ClassName: 'prose dark:prose-invert prose-lg',

              richText: {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Two',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h2',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Three',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h3',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Header Four',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'heading',
                      version: 1,
                      tag: 'h4',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Ordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 1,
                        },

                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Ordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 2,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'list',
                      version: 1,
                      listType: 'number',
                      start: 1,
                      tag: 'ol',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Unordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 1,
                        },

                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Unordered List',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'listitem',
                          version: 1,
                          value: 2,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'list',
                      version: 1,
                      listType: 'bullet',
                      start: 1,
                      tag: 'ul',
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: 'Blockquote',
                          type: 'text',
                          version: 1,
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'quote',
                      version: 1,
                    },

                    {
                      children: [],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },

                    {
                      children: [
                        {
                          children: [
                            {
                              detail: 0,
                              format: 0,
                              mode: 'normal',
                              style: '',
                              text: 'Link',
                              type: 'text',
                              version: 1,
                            },
                          ],
                          direction: null,
                          format: '',
                          indent: 0,
                          type: 'link',
                          version: 3,

                          fields: {
                            url: 'https://atomicpayload.com',
                            newTab: true,
                            linkType: 'custom',
                          },
                          id: '696e774b1afb0034478aaad7',
                        },
                      ],
                      direction: null,
                      format: '',
                      indent: 0,
                      type: 'paragraph',
                      version: 1,
                      textFormat: 0,
                      textStyle: '',
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'root',
                  version: 1,
                },
              },
              id: '696e852f958b03d39c9eea79',

              staticDataAttributes: [],
            },
          ],
          id: '696e852f958b03d39c9eea77',

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
      id: '696e84de958b03d39c9eea6d',

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

  meta: {
    noIndex: false,
    priority: 0.5,
  },
  devMode: false,

  breadcrumbs: [
    {
      doc: '696e7462ddb913b4400af4f3',
      url: '/prose',
      label: '/prose',
      id: '696e7462804f41182c29e7fa',
    },
  ],
  _status: 'published',

  storedAtomicClasses: [
    'page-main',
    'prose',
    'dark:prose-invert',
    'grid',
    'grid-cols-4',
    'gap-4',
    'divide-dashed',
    'divide-x',
    'flex',
    'flex-col',
    'p-2',
    'divide-y',
    'pb-2',
    'text-brand-primary',
    'prose-sm',
    'prose-base',
    'prose-lg',
  ],
}
