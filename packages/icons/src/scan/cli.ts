#!/usr/bin/env node
/**
 * `atomic-icons-scan` — CLI wrapper around {@link scanIconUsages}. Run it in a
 * project's build (e.g. a `prebuild` script or CI step) to regenerate the
 * icon-usage manifest the admin "requested icons" panel reads.
 *
 * @example
 * ```sh
 * atomic-icons-scan src app --out icon-usage-manifest.json
 * atomic-icons-scan --component Icon --component Glyph --ext tsx,jsx
 * ```
 */

import { resolveManifestPath, scanIconUsages, writeIconUsageManifest } from './index.js'

interface ParsedArgs {
  roots: string[]
  out?: string
  components: string[]
  extensions: string[]
  ignore: string[]
  help: boolean
}

const HELP = `atomic-icons-scan — scan source for literal <Icon name="…"> usages

Usage:
  atomic-icons-scan [roots...] [options]

Arguments:
  roots                  Directories/files to scan (default: src app)

Options:
  -o, --out <path>       Manifest output path
                         (default: $ICON_USAGE_MANIFEST or icon-usage-manifest.json)
  -c, --component <name> Component tag to treat as an icon (repeatable; default: Icon)
  -e, --ext <list>       Comma-separated extensions (default: tsx,jsx,ts,js,mdx)
  -i, --ignore <list>    Comma-separated dir names to skip
  -h, --help             Show this help
`

/** Splits a repeated or comma-joined option value into trimmed, non-empty parts. */
const collect = (acc: string[], raw: string): void => {
  for (const part of raw.split(',')) {
    const v = part.trim()
    if (v) acc.push(v)
  }
}

const parseArgs = (argv: string[]): ParsedArgs => {
  const parsed: ParsedArgs = { roots: [], out: undefined, components: [], extensions: [], ignore: [], help: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    const next = (): string => argv[++i] ?? ''
    switch (arg) {
      case '-h':
      case '--help':
        parsed.help = true
        break
      case '-o':
      case '--out':
        parsed.out = next()
        break
      case '-c':
      case '--component':
        collect(parsed.components, next())
        break
      case '-e':
      case '--ext':
        collect(parsed.extensions, next())
        break
      case '-i':
      case '--ignore':
        collect(parsed.ignore, next())
        break
      default:
        if (arg.startsWith('-')) {
          process.stderr.write(`Unknown option: ${arg}\n`)
          process.exitCode = 1
        } else {
          parsed.roots.push(arg)
        }
    }
  }
  return parsed
}

const main = (): void => {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    process.stdout.write(HELP)
    return
  }

  const { manifest, filesScanned } = scanIconUsages({
    roots: args.roots.length ? args.roots : undefined,
    components: args.components.length ? args.components : undefined,
    extensions: args.extensions.length ? args.extensions : undefined,
    ignore: args.ignore.length ? args.ignore : undefined,
  })

  const outPath = resolveManifestPath(args.out)
  const written = writeIconUsageManifest(manifest, outPath)
  process.stdout.write(
    `atomic-icons-scan: ${manifest.names.length} icon name(s) across ${manifest.usages.length} usage(s) in ${filesScanned} file(s)\n`,
  )
  process.stdout.write(`atomic-icons-scan: wrote ${written}\n`)
}

main()
