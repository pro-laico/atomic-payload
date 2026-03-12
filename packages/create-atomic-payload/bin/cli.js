#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'
import fsp from 'fs/promises'
import { execa } from 'execa'
import chalk from 'chalk'
import ora from 'ora'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function getTemplatePath() {
  // When published: template is bundled in package/template
  const bundledPath = path.join(__dirname, '..', 'template')
  if (fs.existsSync(path.join(bundledPath, 'package.json'))) {
    return bundledPath
  }
  // When in monorepo: templates/atomic-payload is at ../../templates/atomic-payload
  const monorepoPath = path.join(__dirname, '..', '..', '..', 'templates', 'atomic-payload')
  if (fs.existsSync(path.join(monorepoPath, 'package.json'))) {
    return monorepoPath
  }
  throw new Error('Template not found. Run from monorepo root or use published package.')
}

function getProjectName() {
  const arg = process.argv[2]
  if (arg && arg !== '--help' && !arg.startsWith('-')) {
    return arg
  }
  return 'my-atomic-payload'
}

function isCurrentDir(projectName) {
  return projectName === '.'
}

function printBanner() {
  const title = chalk.cyan.bold('  Atomic Payload')
  const tagline = chalk.gray('  The Payload CMS starter where all you need to know is Tailwind')
  const line = chalk.cyan('  ─────────────────────────────────────────')
  console.log()
  console.log(title)
  console.log(tagline)
  console.log(line)
  console.log()
}

function printHelp() {
  console.log(`
  ${chalk.cyan.bold('create-atomic-payload')} - Scaffold a new Atomic Payload project

  ${chalk.gray('Usage:')}
    npx @pro-laico/create-atomic-payload ${chalk.dim('[project-name]')}

  ${chalk.gray('Options:')}
    --help, -h    Show this help message

  ${chalk.gray('Examples:')}
    npx @pro-laico/create-atomic-payload
    npx @pro-laico/create-atomic-payload my-website
    npx @pro-laico/create-atomic-payload .          ${chalk.dim('# create in current directory')}
`)
}

function printNextSteps(projectName) {
  const steps = isCurrentDir(projectName)
    ? ['# Edit .env with your MongoDB URI, Payload secret, etc.', 'pnpm dev']
    : [`cd ${projectName}`, '# Edit .env with your MongoDB URI, Payload secret, etc.', 'pnpm dev']
  const maxLen = Math.max(...steps.map((s) => s.length), 40)
  const line = '─'.repeat(maxLen + 2)

  console.log()
  console.log(chalk.green.bold('  ✓ Created ') + chalk.green(isCurrentDir(projectName) ? 'in current directory' : projectName))
  console.log()
  console.log(chalk.gray('  Next steps:'))
  console.log(chalk.cyan('  ╭' + line + '╮'))
  for (const step of steps) {
    const padding = ' '.repeat(Math.max(0, maxLen - step.length))
    const styled = step.startsWith('#') ? chalk.gray(step) : chalk.cyan(step)
    console.log(chalk.cyan('  │ ') + styled + padding + chalk.cyan(' │'))
  }
  console.log(chalk.cyan('  ╰' + line + '╯'))
  console.log()
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    printBanner()
    printHelp()
    return
  }

  const projectName = getProjectName()

  if (!isCurrentDir(projectName) && !/^[a-z0-9-]+$/.test(projectName)) {
    console.error(chalk.red('  ✗ Project name must use only lowercase letters, numbers, and hyphens, or "." for current directory'))
    process.exit(1)
  }

  printBanner()

  const targetDir = path.resolve(process.cwd(), projectName)

  if (isCurrentDir(projectName)) {
    if (fs.existsSync(path.join(targetDir, 'package.json'))) {
      console.error(chalk.red('  ✗ Current directory already has a package.json. Use a different directory or remove it first.'))
      process.exit(1)
    }
  } else {
    const targetExists = fs.existsSync(targetDir)
    if (targetExists) {
      console.error(chalk.red(`  ✗ Directory "${projectName}" already exists. Remove it or choose a different name.`))
      process.exit(1)
    }
  }

  const templatePath = await getTemplatePath()
  const copySpinner = ora({ text: 'Copying template...', color: 'cyan' }).start()
  const startCopy = Date.now()

  if (!isCurrentDir(projectName)) {
    await fsp.mkdir(path.dirname(targetDir), { recursive: true })
  }
  await fsp.cp(templatePath, targetDir, {
    recursive: true,
    filter: (src) => {
      const name = path.basename(src)
      return !['node_modules', '.next', '.git', '.env'].includes(name) && !name.endsWith('.tsbuildinfo')
    },
  })

  // Rename gitignore.template → .gitignore (npm renames .gitignore to .npmignore during pack/extract)
  const gitignoreTemplate = path.join(targetDir, 'gitignore.template')
  if (fs.existsSync(gitignoreTemplate)) {
    await fsp.rename(gitignoreTemplate, path.join(targetDir, '.gitignore'))
  }

  // Copy .env.example → .env so the project is ready to run
  const envExample = path.join(targetDir, '.env.example')
  if (fs.existsSync(envExample)) {
    await fsp.copyFile(envExample, path.join(targetDir, '.env'))
  }

  copySpinner.succeed(`Template copied in ${((Date.now() - startCopy) / 1000).toFixed(1)}s`)

  const installSpinner = ora({ text: 'Installing dependencies with pnpm...', color: 'cyan' }).start()
  try {
    await execa('pnpm', ['install'], { cwd: targetDir, stdio: 'pipe' })
    installSpinner.succeed('Dependencies installed')
  } catch (err) {
    installSpinner.fail('Failed to install dependencies')
    throw err
  }

  // Rebuild sharp to ensure native binary is built for current platform (fixes Windows/OneDrive issues)
  const sharpSpinner = ora({ text: 'Building sharp (image processing)...', color: 'cyan' }).start()
  try {
    await execa('pnpm', ['rebuild', 'sharp'], { cwd: targetDir, stdio: 'pipe' })
    sharpSpinner.succeed('Sharp ready')
  } catch (err) {
    sharpSpinner.warn('Sharp rebuild skipped (run "pnpm rebuild sharp" if images fail)')
  }

  const fontsSpinner = ora({ text: 'Downloading fonts...', color: 'cyan' }).start()
  try {
    await execa('pnpm', ['download:fonts'], { cwd: targetDir, stdio: 'pipe' })
    fontsSpinner.succeed('Fonts ready')
  } catch (err) {
    fontsSpinner.fail('Font download failed')
    throw err
  }

  printNextSteps(projectName)
}

main().catch((err) => {
  console.error(chalk.red('\n  ✗ ' + err.message))
  process.exit(1)
})
