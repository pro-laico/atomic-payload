import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { RichText as ConvertRichText } from '@payloadcms/richtext-lexical/react'
import { jsxConverter } from './converters'

type Props = { data: DefaultTypedEditorState } & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, ...rest } = props
  return <ConvertRichText className={className} converters={jsxConverter} {...rest} />
}
