#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'
import fsp from 'fs/promises'
import { execa } from 'execa'
import chalk from 'chalk'

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

async function main() {
  const projectName = getProjectName()

  if (!/^[a-z0-9-]+$/.test(projectName)) {
    console.error(chalk.red('Project name must use only lowercase letters, numbers, and hyphens'))
    process.exit(1)
  }

  console.log(chalk.cyan('\n  Atomic Payload\n  The Payload CMS starter where all you need to know is Tailwind.\n'))

  const targetDir = path.resolve(process.cwd(), projectName)
  const targetExists = fs.existsSync(targetDir)

  if (targetExists) {
    console.error(chalk.red(`Directory "${projectName}" already exists. Remove it or choose a different name.`))
    process.exit(1)
  }

  console.log(chalk.gray('Copying template...'))

  const templatePath = await getTemplatePath()
  await fsp.mkdir(path.dirname(targetDir), { recursive: true })
  await fsp.cp(templatePath, targetDir, {
    recursive: true,
    filter: (src) => {
      const name = path.basename(src)
      return !['node_modules', '.next', '.git', '.env'].includes(name) && !name.endsWith('.tsbuildinfo')
    },
  })

  console.log(chalk.gray('Installing dependencies with pnpm...'))
  await execa('pnpm', ['install'], { cwd: targetDir, stdio: 'inherit' })

  console.log(chalk.green(`\n✓ Created ${projectName}\n`))
  console.log(chalk.gray('Next steps:'))
  console.log(chalk.cyan(`  cd ${projectName}`))
  console.log(chalk.cyan('  cp .env.example .env'))
  console.log(chalk.cyan('  # Edit .env with your MongoDB URI, Payload secret, etc.'))
  console.log(chalk.cyan('  pnpm dev\n'))
}

main().catch((err) => {
  console.error(chalk.red(err.message))
  process.exit(1)
})
