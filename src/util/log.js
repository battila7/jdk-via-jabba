const core = require('@actions/core')

const log = {
  debug (message) {
    core.debug(message)
  },
  info (message) {
    core.info(message)
  },
  warning (message) {
    core.warning(message)
  },
  error (message) {
    core.error(message)
  }
}

module.exports = log
