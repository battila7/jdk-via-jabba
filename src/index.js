const fs = require('fs')
const path = require('path')

const core = require('@actions/core')
const exec = require('@actions/exec')
const cache = require('@actions/tool-cache')

const INPUTS = {
  jdk: 'jdk'
}

const EXPORTS = {
  JAVA_HOME: 'JAVA_HOME'
};

(async function main () {
  try {
    const requestedJavaDistribution = core.getInput(INPUTS.jdk)

    core.info(`Requested distribution is: ${requestedJavaDistribution}`)

    const javaDirectory = await installJava(requestedJavaDistribution)

    core.info(`Local path to the distribution is: ${javaDirectory}`)

    core.exportVariable(EXPORTS.JAVA_HOME, javaDirectory)
    core.addPath(path.join(javaDirectory, 'bin'))
  } catch (error) {
    core.setFailed(error.message)
  }
})()

async function installJava (distribution) {
  const cachedDirectory = cache.find('java', distribution)

  if (cachedDirectory) {
    core.info('Distribution found in cache.')

    return cachedDirectory
  } else {
    core.info('Distribution not found in cache, downloading.')

    const javaHome = await retrieveWithJabba(distribution)

    await cache.cacheDir(javaHome, 'java', distribution)

    core.info(`Cached directory "${javaHome}" for subsequent executions.`)

    return javaHome
  }
}

async function retrieveWithJabba (distributionExpression) {
  await installJabba()

  core.info('Installed jabba.')

  await downloadJava(distributionExpression)

  core.info(`Downloaded distribution: ${distributionExpression}`)

  return await getPathToJabbaDownloadedJava(distributionExpression)
}

async function installJabba () {
  const jabbaInstallerPath = await cache.downloadTool('https://github.com/shyiko/jabba/raw/master/install.sh')

  await exec.exec('bash', [jabbaInstallerPath])
}

async function downloadJava (distributionExpression) {
  await runJabba('install', [distributionExpression])
}

async function getPathToJabbaDownloadedJava (distribution) {
  const distributionName = await runJabba('ls')

  core.info(`Local name of distribution is: ${distributionName}`)

  return await runJabba('which', [distributionName])
}

async function runJabba (command, args) {
  const output = await execAndGrabStdout(jabbaPath(), [command, ...(args || [])])

  return output.trim()
}

async function execAndGrabStdout (command, args, options) {
  let output = ''

  const listeners = {
    stdout (data) {
      output += data.toString()
    }
  }

  const actualOptions = Object.assign({}, options, { listeners })

  await exec.exec(command, args, actualOptions)

  return output
}

function jabbaPath() {
  const homeDirectory = process.env.HOME

  return path.join(homeDirectory, '.jabba', 'bin', 'jabba')
}
