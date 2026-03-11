import { type Tab } from 'payload'
import { APField } from '@/fields/apf'
import { ActiveField } from '@/fields/active'
import { TestPathField } from '@/fields/testPath'
import { ClassNameField } from '@/fields/className'
import { UniqueTitleField } from '@/fields/uniqueTitle'

const d = {
  htmlClassName:
    'These are the atomic classes and shortcuts that are applied to the html element. Note that changing will unset the live previews selected theme(dark/light), ctrl + r will fix that.',
  bodyClassName: 'These are the atomic classes and shortcuts that are applied to the body element. Typically used for a background color.',
  wrapperClassName:
    'The wrapper goes around header, main, and footer. It supplies styles to the entire site. But is required for dialogs and popovers to work. Isolate will automatically be added to the beginning of the class name if not included.',
}

export const SettingsTab = () => {
  const settingsField: Tab = {
    label: 'Settings',
    fields: [
      { type: 'row', fields: [ActiveField(), UniqueTitleField('New Design Set'), TestPathField] },
      {
        type: 'row',
        fields: [
          APField({
            type: 'checkbox',
            apf: ['classes'],
            name: 'minify',
            label: 'Minify CSS',
            required: true,
            defaultValue: true,
            admin: { style: { maxWidth: '100px', alignSelf: 'center' } },
          }),
          //TODO: Add enableSystem checkbox for next themes
          APField({
            name: 'defaultTheme',
            type: 'select',
            apf: ['classes'],
            required: true,
            defaultValue: 'light',
            options: ['light', 'dark'],
            admin: { style: { maxWidth: '300px' } },
          }),
        ],
      },
      ClassNameField({ namePrefix: 'html', label: 'HTML Class Name', admin: { description: d.htmlClassName } }),
      ClassNameField({ namePrefix: 'body', label: 'Body Class Name', admin: { description: d.bodyClassName } }),
      ClassNameField({ namePrefix: 'wrapper', label: 'Wrapper Class Name', admin: { description: d.wrapperClassName } }),
    ],
  }

  return settingsField
}
