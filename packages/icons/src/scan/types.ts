/**
 * Shared shape of the icon-usage manifest — the JSON the build-time scan writes
 * and the admin "requested icons" panel reads. Kept in its own dependency-free
 * module so both the Node CLI and the React admin component can import it
 * without dragging in `fs` or JSX.
 */

/** One literal `<Icon name="…">` occurrence and where it was found. */
export interface IconUsage {
  /** The resolved literal icon name. */
  name: string
  /** Repo-relative POSIX path of the file the usage was found in. */
  file: string
  /** 1-based line of the `name` value. */
  line: number
  /** 1-based column of the `name` value. */
  column: number
}

/** The manifest written by the scan and consumed by the admin panel. */
export interface IconUsageManifest {
  /** Schema version, so a future format change can be detected/migrated. */
  version: 1
  /** ISO timestamp of when the scan ran. */
  generatedAt: string
  /** Unique, sorted list of every literal icon name requested in the repo. */
  names: string[]
  /** Every individual occurrence, in deterministic (name, file, line) order. */
  usages: IconUsage[]
}
