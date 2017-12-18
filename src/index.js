import core from './core'
import { makeConfig, mergeConfig } from './config/'
import { addLogger } from './logger/'
import { makeCall, makeCallSync } from './job/'

module.exports = {
    start: core.start,

    // adapters
    makeConfig,
    mergeConfig,
    addLogger,

    // jobs
    makeCall,
    makeCallSync
}
