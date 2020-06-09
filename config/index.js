const conf = {}

try {
  const defaultConfig = require('./default.json')
  Object.assign(conf, defaultConfig)
} catch (err) {
  console.error('[default config]', err)
}

if (process.env.STAGE) {
  try {
    const stageConfig = require(`./${process.env.STAGE}.json`)
    Object.assign(conf, stageConfig)
  } catch (err) {
    console.error(`[${process.env.STAGE} config]`, err)
  }
}

const configVars = {}
Object.keys(conf).forEach(key => {
  configVars[key] = JSON.stringify(conf[key])
})

Object.assign(process.env, configVars)
module.exports = configVars
