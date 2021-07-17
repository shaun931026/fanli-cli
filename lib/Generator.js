const path = require('path')
const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const { getRepoList, getTagList } = require('./http')

async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message)
  spinner.start()

  try {
    const result = await fn(...args)
    spinner.succeed()
    return result
  } catch (error) {
    spinner.fail('请求失败，请重试')
  }
}

class Generator {
  constructor(moduleName, targetDir) {
    this.moduleName = moduleName
    this.targetDir = targetDir

    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  async getRepo() {
    const repoList = await wrapLoading(getRepoList, '正在加载模板列表...')

    if (!repoList) return

    const repos = repoList.map((item) => item.name)

    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: '请选择模板来创建你的模块',
    })

    return repo
  }

  async getTag(repo) {
    const tags = await wrapLoading(getTagList, '正在加载模板风格...', repo)

    if (!tags) return

    const tagsList = tags.map((item) => item.name)

    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: '请选择模板风格',
    })

    return tag
  }

  async download(repo, tag) {
    const requestUrl = `fanli-cli/${repo}${tag ? '#' + tag : ''}`

    await wrapLoading(
      this.downloadGitRepo,
      '下载模板中...',
      requestUrl,
      path.resolve(process.cwd(), this.targetDir)
    )
  }

  async create() {
    const repo = await this.getRepo()

    const tag = await this.getTag(repo)

    await this.download(repo, tag)

    console.log(`成功创建模块 ${chalk.cyanBright(this.moduleName)}`)
    console.log(`cd ${chalk.cyanBright(this.moduleName)}`)
  }
}

module.exports = Generator
