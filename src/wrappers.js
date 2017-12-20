#!/usr/bin/env node
'use strict'

/**
 * Application wrapper functions for typical use cases with npac
 *
 * @module wrappers
 */
import { start } from './core'
import { mergeConfig } from './config/'
import { addLogger } from './logger/'
import { makeCall, makeCallSync } from './job/'

const buildAndRun = (config, executives, jobDesc, jobFun, cb) => {
    start([
        mergeConfig(config),
        addLogger,
        executives
    ], [ jobFun(jobDesc) ], cb)
}
/**
 * Run a synchronous executive function in a plain container
 *
 * The function builds a container that provides only `config`, `logger`
 * and the executives given as a parameter, then executes the synchronous job,
 * that is defined by the `jobDesc` parameter.
 *
 * @arg {Object} config - The configuration parameters of the container.
 * @arg {Object} executives - The executives, that must contain at least the sync job function that is referred by the `jobDesc` argument.
 * @arg {Object} jobDesc - The job `{ name: {String}, args: {Object} }` descriptor object.
 * @arg {Function} cb - An error-first callback function, will be called with th re final results of container run.
 *
 * @function
 */
export const runJobSync = (config, executives, jobDesc, cb) =>
    buildAndRun(config, executives, jobDesc, makeCallSync, cb)

export const runJob = (config, executives, jobDesc, cb) =>
    buildAndRun(config, executives, jobDesc, makeCall, cb)
