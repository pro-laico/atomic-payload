import { codeToHtml } from 'shiki'

type Props = { children: string; lang?: string; theme?: string }

/** Async server component that runs Shiki at render time. Output is a pre-styled
 *  `<pre class="shiki">…</pre>` block — no client-side JS, no flash of unstyled
 *  code. The page's CSS overrides the theme's `background-color` so the block
 *  blends with our card token instead of carrying Shiki's own background. */
export async function CodeBlock({ children, lang = 'tsx', theme = 'github-dark' }: Props) {
  const html = await codeToHtml(children.replace(/\s+$/, ''), { lang, theme })
  return <div className="code-block" dangerouslySetInnerHTML={{ __html: html }} />
}
