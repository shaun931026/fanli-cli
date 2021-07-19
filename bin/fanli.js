#!/usr/bin/env node
const program = require('commander')
const figlet = require('figlet')
const chalk = require('chalk')

program
  .version(`fanli-cli ${require('../package').version}`)
  .usage('<command> [options]')

program
  .command('create <module-name>')
  .description('创建一个模块')
  .option('-f --force', '如果目录存在强制覆盖')
  .action((name, options) => {
    require('../lib/create')(name, options)
  })

program.commands.forEach((c) => c.on('--help', () => console.log()))

program.on('--help', () => {
  console.log(
    figlet.textSync('Fanli', {
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    })
  )
  console.log()
  console.log(
    `  输入 ${chalk.cyanBright(
      `fanli <command> --help`
    )} 来查看相关命令的详细用法.`
  )
  console.log()
})

program.parse(process.argv)
