const actionsExec = require('@actions/exec')

async function exec (command, args, options) {
  return await actionsExec.exec(command, args, options)
}

async function execAndGrabStdout (command, args, options) {
  let output = ''

  const listeners = {
    stdout (data) {
      output += data.toString()
    }
  }

  const actualOptions = Object.assign({}, options, { listeners })

  await actionsExec.exec(command, args, actualOptions)

  return output
}

module.exports = {
  exec,
  execAndGrabStdout
}
