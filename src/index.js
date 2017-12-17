import { makeConfig, mergeConfig } from './config/'
import core from './core'

module.exports = {
    start: core.start,

    makeConfig: makeConfig,
    mergeConfig: mergeConfig
}
