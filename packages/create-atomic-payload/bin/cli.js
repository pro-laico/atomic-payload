#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import fsp from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

import ora from 'ora'
import chalk from 'chalk'
import { execa } from 'execa'

import { defaultScaffold, scaffolds } from '../scaffolds.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Resolve a scaffold's source directory — bundled (published) or monorepo (dev). */
function resolveScaffoldSource(scaffold) {
  const bundled = path.join(__dirname, '..', 'scaffolds', scaffold.name)
  if (fs.existsSync(path.join(bundled, 'package.json'))) return bundled
  const dev = path.join(__dirname, '..', '..', '..', scaffold.dir)
  if (fs.existsSync(path.join(dev, 'package.json'))) return dev
  throw new Error(`Scaffold "${scaffold.name}" not found (neither bundled nor in the monorepo).`)
}

function isCurrentDir(projectName) {
  return projectName === '.'
}

function printBanner() {
  console.log()
  console.log(chalk.cyan.bold('  Atomic Payload'))
  console.log(chalk.gray('  The Payload CMS starter where all you need to know is Tailwind'))
  console.log(chalk.cyan('  ─────────────────────────────────────────'))
  console.log()
}

function printHelp() {
  const list = scaffolds.map((s) => `    ${chalk.cyan(s.name.padEnd(16))} ${chalk.gray(s.description)}`).join('\n')
  console.log(`
  ${chalk.cyan.bold('create-atomic-payload')} - Scaffold a new Atomic Payload project or example

  ${chalk.gray('Usage:')}
    npx @pro-laico/create-atomic-payload ${chalk.dim('[project-name] [--template <name>]')}

  ${chalk.gray('Options:')}
    --template, -t <name>   Scaffold to use (skips the prompt)
    --help, -h              Show this help message

  ${chalk.gray('Scaffolds:')}
${list}

  ${chalk.gray('Examples:')}
    npx @pro-laico/create-atomic-payload
    npx @pro-laico/create-atomic-payload my-website
    npx @pro-laico/create-atomic-payload my-icons --template icons-only
    npx @pro-laico/create-atomic-payload .          ${chalk.dim('# create in current directory')}
`)
}

/** Pick a scaffold: from `--template`, an interactive prompt, or the default. */
async function selectScaffold(requested) {
  if (requested) {
    const match = scaffolds.find((s) => s.name === requested)
    if (!match) {
      console.error(chalk.red(`  ✗ Unknown scaffold "${requested}". Available: ${scaffolds.map((s) => s.name).join(', ')}`))
      process.exit(1)
    }
    return match
  }

  // Non-interactive (piped/CI): fall back to the default rather than hang on a prompt.
  if (!input.isTTY) return scaffolds.find((s) => s.name === defaultScaffold) ?? scaffolds[0]

  console.log(chalk.gray('  Which scaffold?'))
  scaffolds.forEach((s, i) => {
    const tag = s.type === 'template' ? chalk.green('template') : chalk.magenta('example')
    console.log(`    ${chalk.cyan(`${i + 1})`)} ${chalk.bold(s.title.padEnd(16))} ${tag}  ${chalk.gray(s.description)}`)
  })
  console.log()

  const rl = readline.createInterface({ input, output })
  const answer = (await rl.question(chalk.cyan('  Select [1]: '))).trim()
  rl.close()
  console.log()

  const index = answer === '' ? 0 : Number(answer) - 1
  if (!Number.isInteger(index) || index < 0 || index >= scaffolds.length) {
    console.error(chalk.red(`  ✗ Invalid selection "${answer}".`))
    process.exit(1)
  }
  return scaffolds[index]
}

function printNextSteps(projectName, hasFonts) {
  const editEnv = '# Edit .env with your MongoDB URI, Payload secret, etc.'
  const steps = isCurrentDir(projectName) ? [editEnv, 'pnpm dev'] : [`cd ${projectName}`, editEnv, 'pnpm dev']
  const maxLen = Math.max(...steps.map((s) => s.length), 40)
  const line = '─'.repeat(maxLen + 2)

  console.log()
  console.log(chalk.green.bold('  ✓ Created ') + chalk.green(isCurrentDir(projectName) ? 'in current directory' : projectName))
  console.log()
  console.log(chalk.gray('  Next steps:'))
  console.log(chalk.cyan(`  ╭${line}╮`))
  for (const step of steps) {
    const padding = ' '.repeat(Math.max(0, maxLen - step.length))
    const styled = step.startsWith('#') ? chalk.gray(step) : chalk.cyan(step)
    console.log(chalk.cyan('  │ ') + styled + padding + chalk.cyan(' │'))
  }
  console.log(chalk.cyan(`  ╰${line}╯`))
  if (!hasFonts) console.log(chalk.gray('  (this scaffold has no font step)'))
  console.log()
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't' },
      help: { type: 'boolean', short: 'h' },
    },
  })

  if (values.help) {
    printBanner()
    printHelp()
    return
  }

  printBanner()

  const scaffold = await selectScaffold(values.template)
  const projectName = positionals[0] ?? `my-${scaffold.name}`

  if (!isCurrentDir(projectName) && !/^[a-z0-9-]+$/.test(projectName)) {
    console.error(chalk.red('  ✗ Project name must use only lowercase letters, numbers, and hyphens, or "." for current directory'))
    process.exit(1)
  }

  const targetDir = path.resolve(process.cwd(), projectName)

  if (isCurrentDir(projectName)) {
    if (fs.existsSync(path.join(targetDir, 'package.json'))) {
      console.error(chalk.red('  ✗ Current directory already has a package.json. Use a different directory or remove it first.'))
      process.exit(1)
    }
  } else if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`  ✗ Directory "${projectName}" already exists. Remove it or choose a different name.`))
    process.exit(1)
  }

  const scaffoldSource = resolveScaffoldSource(scaffold)
  const copySpinner = ora({ text: `Copying ${chalk.bold(scaffold.title)}...`, color: 'cyan' }).start()
  const startCopy = Date.now()

  if (!isCurrentDir(projectName)) await fsp.mkdir(path.dirname(targetDir), { recursive: true })
  await fsp.cp(scaffoldSource, targetDir, {
    recursive: true,
    filter: (src) => {
      const name = path.basename(src)
      return !['node_modules', '.next', '.git', '.env'].includes(name) && !name.endsWith('.tsbuildinfo')
    },
  })

  // Rename gitignore.template → .gitignore (npm renames .gitignore to .npmignore during pack/extract)
  const gitignoreTemplate = path.join(targetDir, 'gitignore.template')
  if (fs.existsSync(gitignoreTemplate)) await fsp.rename(gitignoreTemplate, path.join(targetDir, '.gitignore'))

  // Copy .env.example → .env so the project is ready to run
  const envExample = path.join(targetDir, '.env.example')
  if (fs.existsSync(envExample)) await fsp.copyFile(envExample, path.join(targetDir, '.env'))

  copySpinner.succeed(`${scaffold.title} copied in ${((Date.now() - startCopy) / 1000).toFixed(1)}s`)

  const installSpinner = ora({ text: 'Installing dependencies with pnpm...', color: 'cyan' }).start()
  try {
    await execa('pnpm', ['install'], { cwd: targetDir, stdio: 'pipe' })
    installSpinner.succeed('Dependencies installed')
  } catch (err) {
    installSpinner.fail('Failed to install dependencies')
    throw err
  }

  // Rebuild sharp so its native binary matches the current platform (fixes Windows/OneDrive issues)
  const sharpSpinner = ora({ text: 'Building sharp (image processing)...', color: 'cyan' }).start()
  try {
    await execa('pnpm', ['rebuild', 'sharp'], { cwd: targetDir, stdio: 'pipe' })
    sharpSpinner.succeed('Sharp ready')
  } catch (_err) {
    sharpSpinner.warn('Sharp rebuild skipped (run "pnpm rebuild sharp" if images fail)')
  }

  // Only scaffolds that ship a `download:fonts` script need the font step.
  const scaffoldPkg = JSON.parse(await fsp.readFile(path.join(targetDir, 'package.json'), 'utf8'))
  const hasFonts = Boolean(scaffoldPkg.scripts?.['download:fonts'])
  if (hasFonts) {
    const fontsSpinner = ora({ text: 'Downloading fonts...', color: 'cyan' }).start()
    try {
      await execa('pnpm', ['download:fonts'], { cwd: targetDir, stdio: 'pipe' })
      fontsSpinner.succeed('Fonts ready')
    } catch (err) {
      fontsSpinner.fail('Font download failed')
      throw err
    }
  }

  printNextSteps(projectName, hasFonts)
}

main().catch((err) => {
  console.error(chalk.red(`\n  ✗ ${err.message}`))
  process.exit(1)
})
