import { start } from './core'
import { makeConfig, mergeConfig } from './config/'
import { addLogger } from './logger/'
import { makeCall, makeCallSync } from './job/'
import { runJob, runJobSync } from './wrappers'

module.exports = {
    start,

    // adapters
    makeConfig,
    mergeConfig,
    addLogger,

    // jobs
    makeCall,
    makeCallSync,

    // wrappers
    runJob,
    runJobSync
}
