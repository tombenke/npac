import core from './core'
import { makeConfig, mergeConfig } from './config/'
import { addLogger } from './logger/'
import { runJob, runJobSync } from './job/'

module.exports = {
    start: core.start,

    // adapters
    makeConfig,
    mergeConfig,
    addLogger,

    // jobs
    runJob,
    runJobSync
}
