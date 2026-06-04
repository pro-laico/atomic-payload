import type { ReactNode } from 'react'

type ExportEntry = {
  /** What kind of export it is — e.g. "plugin", "collection", "global", "function", "constant", "type". */
  type: ReactNode
  /** The path you import it from. */
  location: ReactNode
  description: ReactNode
}

const fieldLabel = 'text-fd-muted-foreground not-prose pe-2'

/**
 * Reference table for a package's exports, styled to match Fumadocs' `TypeTable`.
 * Each row collapses to the export name + its kind; expanding reveals the
 * description and the import location.
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
          <div className="grid grid-cols-[1fr_3fr] gap-y-4 border-t p-3 text-sm">
            <div className="col-span-full empty:hidden">{entry.description}</div>
            <p className={fieldLabel}>Location</p>
            <code className="my-auto font-mono not-prose">{entry.location}</code>
          </div>
        </details>
      ))}
    </div>
  )
}
