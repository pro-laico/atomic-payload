import type { Page } from '@/ts/types'

export const testingPage: Omit<Page, 'createdAt' | 'updatedAt' | 'publishedAt' | 'id'> = {
  title: 'Testing',
  slug: 'testing',
  slugLock: true,
  href: '/testing',
  live: true,
  mainClassName: 'page-main',
  _status: 'published',
  devMode: false,

  children: [
    {
      blockType: 'AtomicChild',
      type: 'tag',
      tagType: 'section',
      ClassName: 'py-4 lg:py-32',

      children: [
        {
          blockType: 'AtomicChild',
          type: 'tag',
          tagType: 'div',
          ClassName: 'container mx-auto',

          children: [
            {
              blockType: 'AtomicChild',
              type: 'tag',
              tagType: 'div',
              ClassName: 'mx-auto flex max-w-7xl flex-col justify-between gap-4 lg:flex-row lg:gap-20',

              children: [
                {
                  blockType: 'AtomicChild',
                  type: 'tag',
                  tagType: 'div',
                  ClassName: 'mx-auto flex max-w-sm flex-col justify-between gap-4 lg:gap-10',

                  children: [
                    {
                      blockType: 'AtomicChild',
                      type: 'tag',
                      tagType: 'div',
                      ClassName: 'text-center lg:text-left',

                      children: [
                        {
                          blockType: 'SimpleTextChild',
                          tagType: 'h1',
                          ClassName: 'mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl',
                          text: 'Contact Us',
                          id: '693082a9a267440308d1a1fe',

                          contentActions: {
                            actionBlocks: [],
                          },

                          staticDataAttributes: [],
                        },
                      ],
                      id: '693082a3a267440308d1a1fd',
                      blockName: 'Title',

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
                      ClassName: 'mx-auto w-fit lg:mx-0',

                      children: [
                        {
                          blockType: 'SimpleTextChild',
                          tagType: 'h3',
                          ClassName: 'mb-2 lg:mb-6 text-center text-2xl font-semibold lg:text-left',
                          text: 'Contact Details',
                          id: '693082daa267440308d1a200',

                          contentActions: {
                            actionBlocks: [],
                          },

                          staticDataAttributes: [],
                        },

                        {
                          blockType: 'AtomicChild',
                          type: 'tag',
                          tagType: 'ul',
                          ClassName: 'ml-4 list-disc',

                          children: [
                            {
                              blockType: 'AtomicChild',
                              type: 'tag',
                              tagType: 'li',

                              children: [
                                {
                                  blockType: 'SimpleTextChild',
                                  tagType: 'span',
                                  ClassName: 'font-bold',
                                  text: 'Phone: ',
                                  id: '6930836ea267440308d1a203',

                                  contentActions: {
                                    actionBlocks: [],
                                  },

                                  staticDataAttributes: [],
                                },

                                {
                                  blockType: 'SimpleTextChild',
                                  tagType: 'span',
                                  text: '123-456-7890',
                                  id: '693083a2a267440308d1a204',

                                  contentActions: {
                                    actionBlocks: [],
                                  },

                                  staticDataAttributes: [],
                                },
                              ],
                              id: '69308362a267440308d1a202',
                              blockName: 'Phone',

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
                              tagType: 'li',

                              children: [
                                {
                                  blockType: 'SimpleTextChild',
                                  tagType: 'span',
                                  ClassName: 'font-bold',
                                  text: 'Email: ',
                                  id: '693083c2a267440308d1a206',

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
                                  linkType: 'email',
                                  email: 'john@example.com',
                                  triggerClassName: 'underline',

                                  triggerChildren: [
                                    {
                                      blockType: 'SimpleTextChild',
                                      tagType: 'fragment',
                                      text: 'john@example.com',
                                      id: '6930939a8ec5108984da0c46',

                                      contentActions: {
                                        actionBlocks: [],
                                      },

                                      staticDataAttributes: [],
                                    },
                                  ],
                                  id: '693083d4a267440308d1a208',

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
                              id: '693083c2a267440308d1a205',
                              blockName: 'Email',

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
                              tagType: 'li',

                              children: [
                                {
                                  blockType: 'SimpleTextChild',
                                  tagType: 'span',
                                  ClassName: 'font-bold',
                                  text: 'Web: ',
                                  id: '6930840ca267440308d1a20a',

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
                                  externalLink: 'www.atomicpayload.com',
                                  email: '',
                                  triggerClassName: 'underline',

                                  triggerChildren: [
                                    {
                                      blockType: 'SimpleTextChild',
                                      tagType: 'span',
                                      text: 'atomicpayload.com',
                                      id: '6930842ca267440308d1a20c',

                                      contentActions: {
                                        actionBlocks: [],
                                      },

                                      staticDataAttributes: [],
                                    },
                                  ],
                                  id: '6930840ca267440308d1a20b',

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
                              id: '6930840ca267440308d1a209',
                              blockName: 'Website',

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
                          id: '6930835ba267440308d1a201',
                          blockName: 'Contact List',

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
                      id: '693082d0a267440308d1a1ff',
                      blockName: 'Contact Details',

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
                  id: '69308298a267440308d1a1fc',
                  blockName: 'Contact Us',

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
                  type: 'form',
                  tagType: 'div',
                  backendForm: 'Contact',
                  formName: 'contact',
                  ClassName: 'mx-auto flex max-w-3xl flex-col gap-6 rounded-lg border border-border p-4 lg:p-10',

                  children: [
                    {
                      blockType: 'AtomicChild',
                      type: 'tag',
                      tagType: 'div',
                      ClassName: 'flex gap-4',

                      children: [
                        {
                          blockType: 'AtomicChild',
                          type: 'tag',
                          tagType: 'div',
                          ClassName: 'flex flex-col w-full items-start gap-1.5',

                          children: [
                            {
                              blockType: 'SimpleTextChild',
                              tagType: 'label',
                              ClassName: 'form-label',
                              htmlFor: 'firstName',
                              text: 'First Name',
                              id: '6930865aa267440308d1a210',

                              contentActions: {
                                actionBlocks: [],
                              },

                              staticDataAttributes: [],
                            },

                            {
                              blockType: 'AtomicChild',
                              type: 'input',
                              tagType: 'div',
                              inputType: 'text',
                              inputName: 'firstName',
                              ClassName: 'form-input',

                              contentActions: {
                                actionBlocks: [
                                  {
                                    blockType: 'ActFormErrorToDA',
                                    inputName: 'firstName',
                                    id: '6931b576e9d7311d50b365df',
                                  },
                                ],

                                actions: ['ActFormErrorToDA'],

                                attributers: [
                                  {
                                    type: 'AttFormErrorToDA',
                                    key: 'contact',
                                    inputName: 'firstName',
                                  },
                                ],
                              },
                              required: true,

                              inputValidationBlocks: [
                                {
                                  blockType: 'IvContains',
                                  containsValue: 'John',
                                  validationMessage: "Must Contain 'John'",
                                  id: '6931b96ee9d7311d50b365e1',
                                },
                              ],
                              autocomplete: 'given-name',
                              textPlaceholder: 'John',
                              id: '693086bba267440308d1a211',

                              children: [],

                              triggerChildren: [],

                              triggerActions: {
                                actionBlocks: [],
                              },

                              formRateLimitBlocks: [],

                              formSanitationBlocks: [],

                              formValidationBlocks: [],

                              inputSanitationBlocks: [],

                              backdropChildren: [],

                              ds: {},

                              pops: {},

                              triggerStaticDataAttributes: [],

                              staticDataAttributes: [],
                            },

                            {
                              blockType: 'SimpleTextChild',
                              tagType: 'p',
                              ClassName: 'hidden data-[error]:flex text-sm text-destructive',
                              text: '{{error}}',

                              contentActions: {
                                actionBlocks: [
                                  {
                                    blockType: 'ActFormErrorToDA',
                                    inputName: 'firstName',
                                    id: '6931bb70e9d7311d50b365e6',
                                  },
                                ],

                                actions: ['ActFormErrorToDA'],

                                attributers: [
                                  {
                                    type: 'AttFormErrorToDA',
                                    key: 'contact',
                                    inputName: 'firstName',
                                  },
                                ],
                              },
                              id: '6931bac9e9d7311d50b365e4',

                              staticDataAttributes: [],
                            },
                          ],
                          id: '69308653a267440308d1a20f',
                          blockName: 'First Name',

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
                          ClassName: 'flex flex-col w-full items-start gap-1.5',

                          children: [
                            {
                              blockType: 'SimpleTextChild',
                              tagType: 'label',
                              ClassName: 'form-label',
                              htmlFor: 'lastName',
                              text: 'Last Name',
                              id: '69308742a267440308d1a213',

                              contentActions: {
                                actionBlocks: [],
                              },

                              staticDataAttributes: [],
                            },

                            {
                              blockType: 'AtomicChild',
                              type: 'input',
                              tagType: 'div',
                              inputType: 'text',
                              inputName: 'lastName',
                              ClassName: 'form-input',

                              contentActions: {
                                actionBlocks: [
                                  {
                                    blockType: 'ActFormErrorToDA',
                                    inputName: 'lastName',
                                    id: '6931b597e9d7311d50b365e0',
                                  },
                                ],

                                actions: ['ActFormErrorToDA'],

                                attributers: [
                                  {
                                    type: 'AttFormErrorToDA',
                                    key: 'contact',
                                    inputName: 'lastName',
                                  },
                                ],
                              },
                              required: true,

                              inputValidationBlocks: [
                                {
                                  blockType: 'IvContains',
                                  containsValue: 'Doe',
                                  validationMessage: "Must Contain 'Doe'",
                                  id: '6931b0d765fe13059d5031b1',
                                },
                              ],
                              autocomplete: 'family-name',
                              textPlaceholder: 'Doe',
                              id: '69308742a267440308d1a214',

                              children: [],

                              triggerChildren: [],

                              triggerActions: {
                                actionBlocks: [],
                              },

                              formRateLimitBlocks: [],

                              formSanitationBlocks: [],

                              formValidationBlocks: [],

                              inputSanitationBlocks: [],

                              backdropChildren: [],

                              ds: {},

                              pops: {},

                              triggerStaticDataAttributes: [],

                              staticDataAttributes: [],
                            },

                            {
                              blockType: 'SimpleTextChild',
                              tagType: 'p',
                              ClassName: 'hidden data-[error]:flex text-sm text-destructive',
                              text: '{{error}}',

                              contentActions: {
                                actionBlocks: [
                                  {
                                    blockType: 'ActFormErrorToDA',
                                    inputName: 'lastName',
                                    id: '6931bbdca45ce72c08287479',
                                  },
                                ],

                                actions: ['ActFormErrorToDA'],

                                attributers: [
                                  {
                                    type: 'AttFormErrorToDA',
                                    key: 'contact',
                                    inputName: 'lastName',
                                  },
                                ],
                              },
                              id: '6931bbd7e9d7311d50b365e7',

                              staticDataAttributes: [],
                            },
                          ],
                          id: '69308742a267440308d1a212',
                          blockName: 'Last Name',

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
                      id: '69308648a267440308d1a20e',
                      blockName: 'First & Last Name',

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
                      ClassName: 'flex flex-col w-full items-start gap-1.5',

                      children: [
                        {
                          blockType: 'SimpleTextChild',
                          tagType: 'label',
                          ClassName: 'form-label',
                          htmlFor: 'email',
                          text: 'Email',
                          id: '693088fe226fdc58c8ef9f84',

                          contentActions: {
                            actionBlocks: [],
                          },

                          staticDataAttributes: [],
                        },

                        {
                          blockType: 'AtomicChild',
                          type: 'input',
                          tagType: 'div',
                          inputType: 'email',
                          inputName: 'email',
                          ClassName: 'form-input',

                          contentActions: {
                            actionBlocks: [
                              {
                                blockType: 'ActFormErrorToDA',
                                inputName: 'email',
                                id: '6931b99ce9d7311d50b365e2',
                              },
                            ],

                            actions: ['ActFormErrorToDA'],

                            attributers: [
                              {
                                type: 'AttFormErrorToDA',
                                key: 'contact',
                                inputName: 'email',
                              },
                            ],
                          },
                          required: true,
                          autocomplete: 'email',
                          textPlaceholder: 'john@example.com',
                          id: '693088fe226fdc58c8ef9f85',

                          children: [],

                          triggerChildren: [],

                          triggerActions: {
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
                      id: '693088fa90938a01e5c20856',
                      blockName: 'Email',

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
                      inputType: 'radio',
                      ClassName: 'flex flex-col gap-1.5',

                      children: [
                        {
                          blockType: 'SimpleTextChild',
                          tagType: 'p',
                          ClassName: 'form-label',
                          htmlFor: '',
                          text: 'Subject',
                          id: '69308b9990938a01e5c20864',

                          contentActions: {
                            actionBlocks: [],
                          },

                          staticDataAttributes: [],
                        },

                        {
                          blockType: 'AtomicChild',
                          type: 'tag',
                          tagType: 'div',
                          ClassName: 'flex gap-4',

                          children: [
                            {
                              blockType: 'AtomicChild',
                              type: 'tag',
                              tagType: 'div',
                              ClassName: 'flex items-center gap-3',

                              children: [
                                {
                                  blockType: 'AtomicChild',
                                  type: 'input',
                                  tagType: 'div',
                                  inputType: 'radio',
                                  inputName: 'subject',
                                  ClassName: '',
                                  autocomplete: 'given-name',
                                  textPlaceholder: 'First Name',
                                  radioDefault: true,
                                  radioValue: 'Marketing',
                                  id: '69308e43226fdc58c8ef9f8a',
                                  blockName: 'Marketing',

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

                                  staticDataAttributes: [],
                                },

                                {
                                  blockType: 'SimpleTextChild',
                                  tagType: 'label',
                                  ClassName: 'form-label',
                                  htmlFor: 'Marketing',
                                  text: 'Marketing',
                                  id: '69308e43226fdc58c8ef9f8b',

                                  contentActions: {
                                    actionBlocks: [],
                                  },

                                  staticDataAttributes: [],
                                },
                              ],
                              id: '69308e3f90938a01e5c2086a',
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
                              ClassName: 'ui-seperator',

                              staticDataAttributes: [
                                {
                                  key: 'orientation',
                                  value: 'vertical',
                                  id: '69308f76226fdc58c8ef9f8e',
                                },
                              ],
                              id: '69308f728ec5108984da0c40',
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
                              type: 'tag',
                              tagType: 'div',
                              ClassName: 'flex items-center gap-3',

                              children: [
                                {
                                  blockType: 'AtomicChild',
                                  type: 'input',
                                  tagType: 'div',
                                  inputType: 'radio',
                                  inputName: 'subject',
                                  ClassName: '',
                                  autocomplete: 'given-name',
                                  textPlaceholder: 'First Name',
                                  radioDefault: false,
                                  radioValue: 'Web Dev',
                                  id: '69308e4d226fdc58c8ef9f8c',
                                  blockName: 'Web Dev',

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

                                  staticDataAttributes: [],
                                },

                                {
                                  blockType: 'SimpleTextChild',
                                  tagType: 'label',
                                  ClassName: 'form-label',
                                  htmlFor: 'Web Dev',
                                  text: 'Web Dev',
                                  id: '69308e4d226fdc58c8ef9f8d',

                                  contentActions: {
                                    actionBlocks: [],
                                  },

                                  staticDataAttributes: [],
                                },
                              ],
                              id: '69308e4990938a01e5c2086b',
                              blockName: 'Web Dev',

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
                              ClassName: 'ui-seperator',

                              staticDataAttributes: [
                                {
                                  key: 'orientation',
                                  value: 'vertical',
                                  id: '69308f8d8ec5108984da0c42',
                                },
                              ],
                              id: '69308f8d8ec5108984da0c41',
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
                              type: 'tag',
                              tagType: 'div',
                              ClassName: 'flex items-center gap-3',

                              children: [
                                {
                                  blockType: 'AtomicChild',
                                  type: 'input',
                                  tagType: 'div',
                                  inputType: 'radio',
                                  inputName: 'subject',
                                  ClassName: '',
                                  autocomplete: 'given-name',
                                  textPlaceholder: 'First Name',
                                  radioDefault: false,
                                  radioValue: 'Other',
                                  id: '69308f928ec5108984da0c44',
                                  blockName: 'Automation',

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

                                  staticDataAttributes: [],
                                },

                                {
                                  blockType: 'SimpleTextChild',
                                  tagType: 'label',
                                  ClassName: 'form-label',
                                  htmlFor: 'Other',
                                  text: 'Other',
                                  id: '69308f928ec5108984da0c45',

                                  contentActions: {
                                    actionBlocks: [],
                                  },

                                  staticDataAttributes: [],
                                },
                              ],
                              id: '69308f928ec5108984da0c43',
                              blockName: 'Other',

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
                          id: '69308e2090938a01e5c20869',
                          blockName: 'Radio Options',

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
                      id: '69308b8190938a01e5c2085d',
                      blockName: 'Subject',

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
                      ClassName: 'grid w-full items-center gap-1.5',

                      children: [
                        {
                          blockType: 'SimpleTextChild',
                          tagType: 'label',
                          ClassName: 'form-label',
                          htmlFor: 'message',
                          text: 'Message',
                          id: '6930898490938a01e5c20858',

                          contentActions: {
                            actionBlocks: [],
                          },

                          staticDataAttributes: [],
                        },

                        {
                          blockType: 'AtomicChild',
                          type: 'input',
                          tagType: 'div',
                          inputType: 'textarea',
                          inputName: 'message',
                          ClassName: 'form-textarea',

                          contentActions: {
                            actionBlocks: [
                              {
                                blockType: 'ActFormErrorToDA',
                                inputName: 'message',
                                id: '6931b9c0e9d7311d50b365e3',
                              },
                            ],

                            actions: ['ActFormErrorToDA'],

                            attributers: [
                              {
                                type: 'AttFormErrorToDA',
                                key: 'contact',
                                inputName: 'message',
                              },
                            ],
                          },
                          autocomplete: 'email',
                          textPlaceholder: 'Type your message here.',
                          id: '6930898490938a01e5c20859',

                          children: [],

                          triggerChildren: [],

                          triggerActions: {
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
                      id: '6930898490938a01e5c20857',
                      blockName: 'Message',

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
                      type: 'button',
                      tagType: 'div',
                      buttonType: 'regular',
                      ClassName: '',
                      triggerClassName: 'trigger trigger-style-base trigger-size-base w-full',

                      triggerChildren: [
                        {
                          blockType: 'SimpleTextChild',
                          tagType: 'span',
                          ClassName: '',
                          text: 'Submit Message',
                          id: '69308a8090938a01e5c2085c',

                          contentActions: {
                            actionBlocks: [],
                          },

                          staticDataAttributes: [],
                        },
                      ],

                      triggerActions: {
                        actionBlocks: [
                          {
                            blockType: 'ActSubmitForm',
                            id: '69308a7190938a01e5c2085b',
                          },
                        ],

                        actions: ['ActSubmitForm'],

                        runners: [
                          {
                            type: 'RunSubmitForm',
                            formName: 'contact',
                          },
                        ],

                        attributers: [
                          {
                            type: 'AttFormStatusToDA',
                            key: 'contact',
                          },
                        ],
                      },
                      id: '69308a5090938a01e5c2085a',
                      blockName: 'Submit',

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
                      blockType: 'SimpleTextChild',
                      tagType: 'p',
                      ClassName: 'hidden data-[error]:flex text-sm text-destructive',
                      text: '{{error}}',

                      contentActions: {
                        actionBlocks: [
                          {
                            blockType: 'ActFormErrorToDA',
                            formName: '',
                            id: '6931c26ee9d7311d50b365eb',
                          },
                        ],

                        actions: ['ActFormErrorToDA'],

                        attributers: [
                          {
                            type: 'AttFormErrorToDA',
                            key: 'contact',
                          },
                        ],
                      },
                      id: '6931c1c6e9d7311d50b365e9',

                      staticDataAttributes: [],
                    },
                  ],

                  contentActions: {
                    actions: ['ActResetForm', 'ActSubmitForm'],

                    attributers: [
                      {
                        type: 'AttFormStatusToDA',
                        key: 'contact',
                      },

                      {
                        type: 'AttFormStatusToDA',
                        key: 'contact',
                      },
                    ],

                    actionBlocks: [],
                  },

                  formRateLimitBlocks: [
                    {
                      blockType: 'FrlSimpleSlidingWindow',
                      atStart: true,
                      rateLimit: 3,
                      rateLimitPeriod: 1,
                      validationMessage: 'Hey {{firstName}}, you have done that too much! Please try again later.',
                      id: '6931bec2e9d7311d50b365e8',
                    },
                  ],
                  formToastEnabled: true,
                  lm: 'Submitting Message...',
                  sm: 'Thank you {{firstName}} we will get back to you shortly!',
                  em: 'Issue Submitting Form. Try again later.',
                  id: '6930856ca267440308d1a20d',
                  blockName: 'Form',

                  triggerChildren: [],

                  triggerActions: {
                    actionBlocks: [],
                  },

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
              id: '6930828ba267440308d1a1fb',

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
          id: '69308281a267440308d1a1fa',

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
      id: '69308272a267440308d1a1f9',
      blockName: 'Form',

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
      doc: '693087b7f65967916a097b26',
      url: '/testing',
      label: '/testing',
      id: '693087b7226fdc58c8ef9f83',
    },
  ],

  storedAtomicClasses: [
    'page-main',
    'py-4',
    'lg:py-32',
    'container',
    'mx-auto',
    'flex',
    'max-w-7xl',
    'flex-col',
    'justify-between',
    'gap-4',
    'lg:flex-row',
    'lg:gap-20',
    'max-w-sm',
    'lg:gap-10',
    'text-center',
    'lg:text-left',
    'mb-2',
    'text-5xl',
    'font-semibold',
    'lg:mb-1',
    'lg:text-6xl',
    'w-fit',
    'lg:mx-0',
    'lg:mb-6',
    'text-2xl',
    'ml-4',
    'list-disc',
    'font-bold',
    'underline',
    'max-w-3xl',
    'gap-6',
    'rounded-lg',
    'border',
    'border-border',
    'p-4',
    'lg:p-10',
    'w-full',
    'items-start',
    'gap-1.5',
    'form-label',
    'form-input',
    'hidden',
    'data-[error]:flex',
    'text-sm',
    'text-destructive',
    'items-center',
    'gap-3',
    'ui-seperator',
    'grid',
    'form-textarea',
    'trigger',
    'trigger-style-base',
    'trigger-size-base',
  ],

  storedAtomicActions: {
    '693086bba267440308d1a211': {
      id: '693086bba267440308d1a211',

      actions: ['ActFormErrorToDA'],

      runners: [],

      attributers: [
        {
          type: 'AttFormErrorToDA',
          key: 'contact',
          inputName: 'firstName',
        },
      ],
    },

    '6931bac9e9d7311d50b365e4': {
      id: '6931bac9e9d7311d50b365e4',

      actions: ['ActFormErrorToDA'],

      runners: [],

      attributers: [
        {
          type: 'AttFormErrorToDA',
          key: 'contact',
          inputName: 'firstName',
        },
      ],
    },

    '69308742a267440308d1a214': {
      id: '69308742a267440308d1a214',

      actions: ['ActFormErrorToDA'],

      runners: [],

      attributers: [
        {
          type: 'AttFormErrorToDA',
          key: 'contact',
          inputName: 'lastName',
        },
      ],
    },

    '6931bbd7e9d7311d50b365e7': {
      id: '6931bbd7e9d7311d50b365e7',

      actions: ['ActFormErrorToDA'],

      runners: [],

      attributers: [
        {
          type: 'AttFormErrorToDA',
          key: 'contact',
          inputName: 'lastName',
        },
      ],
    },

    '693088fe226fdc58c8ef9f85': {
      id: '693088fe226fdc58c8ef9f85',

      actions: ['ActFormErrorToDA'],

      runners: [],

      attributers: [
        {
          type: 'AttFormErrorToDA',
          key: 'contact',
          inputName: 'email',
        },
      ],
    },

    '6930898490938a01e5c20859': {
      id: '6930898490938a01e5c20859',

      actions: ['ActFormErrorToDA'],

      runners: [],

      attributers: [
        {
          type: 'AttFormErrorToDA',
          key: 'contact',
          inputName: 'message',
        },
      ],
    },

    '69308a5090938a01e5c2085a': {
      id: '69308a5090938a01e5c2085a',

      actions: ['ActSubmitForm'],

      runners: [
        {
          type: 'RunSubmitForm',
          formName: 'contact',
        },
      ],

      attributers: [
        {
          type: 'AttFormStatusToDA',
          key: 'contact',
        },
      ],
    },

    '6931c1c6e9d7311d50b365e9': {
      id: '6931c1c6e9d7311d50b365e9',

      actions: ['ActFormErrorToDA'],

      runners: [],

      attributers: [
        {
          type: 'AttFormErrorToDA',
          key: 'contact',
          inputName: null,
        },
      ],
    },

    '6930856ca267440308d1a20d': {
      id: '6930856ca267440308d1a20d',

      actions: ['ActResetForm', 'ActSubmitForm'],

      runners: [],

      attributers: [
        {
          type: 'AttFormStatusToDA',
          key: 'contact',
        },

        {
          type: 'AttFormStatusToDA',
          key: 'contact',
        },
      ],
    },
  },

  storedAtomicForms: [
    {
      id: '6930856ca267440308d1a20d',
      backendForm: 'Contact',
      sm: 'Thank you {{firstName}} we will get back to you shortly!',
      em: 'Issue Submitting Form. Try again later.',

      rateLimiting: [
        {
          id: '6931bec2e9d7311d50b365e8',
          atStart: true,
          blockType: 'FrlSimpleSlidingWindow',
          rateLimit: 3,
          rateLimitPeriod: 1,
          validationMessage: 'Hey {{firstName}}, you have done that too much! Please try again later.',
        },
      ],

      inputs: [
        {
          id: '693086bba267440308d1a211',
          type: 'text',
          inputName: 'firstName',

          validationBlocks: [
            {
              id: '6931b96ee9d7311d50b365e1',
              blockType: 'IvContains',
              containsValue: 'John',
              validationMessage: "Must Contain 'John'",
            },
          ],
        },

        {
          id: '69308742a267440308d1a214',
          type: 'text',
          inputName: 'lastName',

          validationBlocks: [
            {
              id: '6931b0d765fe13059d5031b1',
              blockType: 'IvContains',
              containsValue: 'Doe',
              validationMessage: "Must Contain 'Doe'",
            },
          ],
        },

        {
          id: '693088fe226fdc58c8ef9f85',
          type: 'email',
          inputName: 'email',
        },

        {
          id: '69308e43226fdc58c8ef9f8a',
          type: 'radio',
          inputName: 'subject',
        },

        {
          id: '69308e4d226fdc58c8ef9f8c',
          type: 'radio',
          inputName: 'subject',
        },

        {
          id: '69308f928ec5108984da0c44',
          type: 'radio',
          inputName: 'subject',
        },

        {
          id: '6930898490938a01e5c20859',
          type: 'textarea',
          inputName: 'message',
        },
      ],
    },
  ],
}
