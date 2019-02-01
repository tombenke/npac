import { start } from './core'
import { makeConfig, mergeConfig } from './config/'
import { addLogger } from './logger/'
import { makeCall, makeCallSync } from './job/'
import { runJob, runJobSync } from './wrappers'
import { removeSignalHandlers, catchExitSignals, npacStart } from './testHelpers'

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
    runJobSync,

    // test helpers
    removeSignalHandlers,
    catchExitSignals,
    npacStart
}
