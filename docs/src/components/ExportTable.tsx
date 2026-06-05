import type { ReactNode } from 'react'
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'

type ParamEntry = {
  /** The parameter's type. */
  type: string
  /** What the parameter is / what to pass. */
  description?: ReactNode
}

type ExportEntry = {
  /** What kind of export it is — e.g. "plugin", "collection", "function", "field", "constant", "type". */
  type: ReactNode
  /** The path you import it from. */
  location: ReactNode
  description: ReactNode
  /** For functions: each parameter, in order, keyed by name. Append `?` to an optional param's key. */
  params?: Record<string, ParamEntry>
  /** For functions: the return value. */
  returns?: { type: string; description?: ReactNode }
  /** A real, in-context usage example, rendered as a highlighted code block. */
  example?: string
  /** Language for the example block. Defaults to `ts`. */
  exampleLang?: string
}

const fieldLabel = 'text-fd-muted-foreground not-prose pe-2 text-xs font-medium uppercase tracking-wide'
const inlineCode = 'rounded bg-fd-muted px-1 py-0.5 font-mono text-[0.85em] text-fd-foreground'

/** Render a description, turning `inline code` spans in a plain string into styled `<code>`. */
function renderDescription(description: ReactNode): ReactNode {
  if (typeof description !== 'string') return description
  return description.split(/(`[^`]+`)/g).map((part, i) => {
    if (!part.startsWith('`') || !part.endsWith('`')) return part
    return (
      // biome-ignore lint/suspicious/noArrayIndexKey: static regex split; the parts never reorder between renders
      <code key={`${i}-${part}`} className={inlineCode}>
        {part.slice(1, -1)}
      </code>
    )
  })
}

/**
 * Reference table for a package's exports, styled to match Fumadocs' `TypeTable`.
 * Each row collapses to the export name + its kind; expanding reveals fuller docs:
 * the description, and (for functions) the parameters, return value, and a real
 * in-context example as a highlighted code block.
 */
export function ExportTable({ exports }: { exports: Record<string, ExportEntry> }) {
  return (
    <div className="my-6 flex flex-col overflow-hidden rounded-2xl border bg-fd-card p-1 text-sm text-fd-card-foreground">
      <div className="not-prose flex items-center px-3 py-1 font-medium text-fd-muted-foreground">
        <p className="w-1/4">Export</p>
        <p>Type</p>
      </div>
      {Object.entries(exports).map(([name, entry]) => (
        <details
          key={name}
          className="overflow-hidden rounded-xl border border-transparent transition-all open:border-fd-border open:bg-fd-background open:shadow-sm [&[open]_svg]:rotate-180"
        >
          <summary className="not-prose relative flex w-full cursor-pointer list-none flex-row items-center px-3 py-2 text-start hover:bg-fd-accent [&::-webkit-details-marker]:hidden">
            <code className="w-1/4 min-w-fit pe-2 font-mono font-medium text-fd-primary">{name}</code>
            <span className="text-fd-muted-foreground">{entry.type}</span>
            <svg
              className="absolute end-2 size-4 text-fd-muted-foreground transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="flex flex-col gap-4 border-t p-3 text-sm">
            <div className="empty:hidden">{renderDescription(entry.description)}</div>

            {entry.params && (
              <div className="flex flex-col gap-2">
                <p className={fieldLabel}>Parameters</p>
                {Object.entries(entry.params).map(([pName, p]) => (
                  <div key={pName} className="flex flex-col gap-0.5">
                    <span className="not-prose">
                      <code className={inlineCode}>{pName}</code>
                      <span className="px-1 text-fd-muted-foreground">:</span>
                      <code className={inlineCode}>{p.type}</code>
                    </span>
                    {p.description && <span className="text-fd-muted-foreground">{renderDescription(p.description)}</span>}
                  </div>
                ))}
              </div>
            )}

            {entry.returns && (
              <div className="flex flex-col gap-0.5">
                <p className={fieldLabel}>Returns</p>
                <code className={`not-prose w-fit ${inlineCode}`}>{entry.returns.type}</code>
                {entry.returns.description && <span className="text-fd-muted-foreground">{renderDescription(entry.returns.description)}</span>}
              </div>
            )}

            {entry.example && (
              <div className="flex flex-col gap-1">
                <p className={fieldLabel}>Example</p>
                <DynamicCodeBlock lang={entry.exampleLang ?? 'ts'} code={entry.example} />
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              <p className={fieldLabel}>Location</p>
              <code className="w-fit font-mono not-prose">{entry.location}</code>
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}
