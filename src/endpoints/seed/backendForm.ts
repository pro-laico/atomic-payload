import type { Form } from '@/ts/types'

export const backendForm: Omit<Form, 'createdAt' | 'id' | 'updatedAt'> = {
  title: 'Contact',
  emails: [
    {
      emailTo: 'example@example.com',
      cc: '',
      bcc: '',
      replyTo: '',
      emailFrom: '',
      subject: "You've received a new message.",

      message: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Hey you got an email. Go check it out',
                  type: 'text',
                  version: 1,
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
      id: '6913bf1adbbb6737477aac4e',
    },
  ],
}
