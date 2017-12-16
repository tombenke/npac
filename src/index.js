import { makeConfig, mergeConfig } from './config/'
import core from './core'

module.exports = {
    startup: core.startup,

    makeConfig: makeConfig,
    mergeConfig: mergeConfig
}
