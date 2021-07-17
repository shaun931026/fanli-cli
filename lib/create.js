const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Generator = require('./Generator')

async function create(moduleName, options) {
  const cwd = process.cwd()
  const targetDir = path.join(cwd, moduleName)

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: '是否覆盖当前目录？',
        },
      ])

      if (!ok) return

      console.log(`\n正在删除 ${chalk.cyanBright(targetDir)}...`)
      await fs.remove(targetDir)
    }
  }

  const generator = new Generator(moduleName, targetDir)
  generator.create()
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.error(err)
  })
}
