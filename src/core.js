#!/usr/bin/env node
'use strict'

/**
 * A lightweight Ports and Adapters Container for Node
 *
 * @module core
 */
import _ from 'lodash'
import async from 'async'
import npacDefaultConfig from './defaultConfig'

const initialCtx = {
    config: npacDefaultConfig,
    logger: console
}

/**
 * Setup the adapters
 *
 * The function calls the adapter functions in the order they are defined by the `adapters` argument.
 * Each adapter function gets the context object, and can use all the APIs that are available through it.
 * It means, each adapter that provides an API that is required by an other adapter function,
 * must be called earlier. It can be achieved by placing them into the `adapters` array before the
 * function that is willing to use that.
 *
 * Each adapter function must call the `next` callback function, when it finishes its job.
 * The `next` function has two arguments: next(err: {Object}, ctxExtension: {Object})
 * - `err` is an error object, or null, in case of successful execution,
 * - `ctxExtension` is a partial context object, that the adapter would like to merge with the context.
 * The `start()` function will merge the original context object with the `ctxExtension`,
 * and the next adapter function in the pipeline will be called with this extended context object.
 *
 * @arg {Object} ctx - The initial context
 * @arg {Array} adapters - The array of adapter functions
 * @arg {Function} endCb - An error-first callback function to call when the start process finished.
 *
 * @function
 */
const setupAdapters = (ctx, adapters = []) => endCb => {
    // ctx.logger.debug('App is starting up...', ctx, adapters)
    async.reduce(
        adapters,
        ctx,
        (memoCtx, adapter, callback) => {
            if (_.isFunction(adapter)) {
                // memoCtx.logger.debug('Call adapter registration function')
                adapter(memoCtx, (err, ctxExtension = null) => {
                    if (err) {
                        memoCtx.logger.error('Adapter registration function returned: ', err)
                        callback(err, memoCtx)
                    } else {
                        // Merge the adapter extensions to the context
                        if (_.isNull(ctxExtension)) {
                            // memoCtx.logger.debug('Adapter extensions is null. Do not merge.')
                            callback(null, memoCtx)
                        } else {
                            // memoCtx.logger.debug('Merge adapter extensions to the context: ', ctxExtension)
                            callback(null, _.merge({}, memoCtx, ctxExtension))
                        }
                    }
                })
            } else {
                // memoCtx.logger.debug('Merge adapter object to ctx')
                callback(null, _.merge({}, memoCtx, adapter))
            }
        },
        (err, resultCtx) => {
            endCb(err, resultCtx)
        }
    )
}

const shutDown = (ctx, terminators) => signal => {
    // wasSigterm = true
    ctx.logger.debug('App starts the shutdown process...')
    async.mapSeries(
        terminators,
        (terminator, callback) => {
            if (_.isFunction(terminator)) {
                ctx.logger.debug('Call terminator function')
                terminator(ctx, (err, result) => {
                    if (err) {
                        ctx.logger.error('Terminator call failed', err)
                    } else {
                        //ctx.logger.debug('Terminator call completed', result)
                    }
                    callback(err, result)
                })
            } else {
                ctx.logger.error('Terminator is not a function')
                callback(new Error('Terminator is not a function'), null)
            }
        },
        (err, res) => {
            if (err) {
                ctx.logger.info('Shutdown process failed', err)
                process.exit(1)
            } else {
                ctx.logger.info('Shutdown process successfully finished')
                process.exit(0)
            }
        }
    )
}

/**
 * Prepare for termination
 *
 * @arg {Array} terminators - The array of terminators functions
 * @arg {Function} endCb - An error-first callback function to call when the shutdown process finished.
 *
 * @function
 */
const prepareForTermination = (terminators = []) => (ctx, endCb) => {
    ctx.logger.debug('App is preparing for SIGTERM, SIGINT and SIGHUP ...', terminators)
    const signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2']
    for (const signal in signals) {
        process.on(signals[signal], shutDown(ctx, terminators))
    }
    endCb(null, ctx)
}

/**
 * Prepare jobs to run in series.
 *
 * Creates a function that will map through the list of jobs, and executes them one ofter the other,
 * in series. The results will be collected into an array, that will be returned as a whole,
 * after the execution of the last job.
 *
 * @arg {Array} jobs  - An array of job functions.
 *
 * @return {Function} - An asynchronous function that has two parameters:
 * `ctx: {Object}` that is the context object, and `endCb: {Function}`,
 * that is an error-first callback to return with the results of the job execution.
 *
 * @function
 */
const runJobs = jobs => (ctx, endCb) => {
    ctx.logger.debug('App runs the jobs...')
    async.mapSeries(
        jobs,
        (job, callback) => {
            if (_.isFunction(job)) {
                ctx.logger.debug('Call job function')
                job(ctx, (err, result) => {
                    if (err) {
                        ctx.logger.error('Job call failed', err)
                    } else {
                        ctx.logger.debug('Job call completed', result)
                    }
                    callback(err, result)
                })
            } else {
                ctx.logger.error('Job is not a function')
                callback(new Error('Job must be a function'), null)
            }
        },
        endCb
    )
}

/**
 * Run an `npac` application
 *
 * First setup the adapters, then run the jobs if they are available.
 * If any of the errors returns with error, then immediately stops the execution.
 * If `endCb` defined, then calls it, with the list of results of every jobs.
 * In case of error occured, and no `endCb` defined then it throws and error instead of returning.
 *
 * @arg {Array} adapters    - The list of adapters, (including the executives) that make the context. Default: `[]`.
 *
 * @arg {Array} jobs        - The list of job functions to execute. Default: `[]`.
 * Every job function must have the following signature: `(ctx: {Object}, cb: {Function})`,
 * where `ctx` is the context object, and `cb` is an error-first callback,
 * with the results of the call as a second parameters.
 *
 * @arg {Array} terminators - The list of terminator functions to execute during the shutdown phase.
 * Default: `[]`. Every terminator function must have the following signature:
 * `(ctx: {Object}, cb: {Function})`, where `ctx` is the context object,
 * and `cb` is an error-first callback, with the results of the call as a second parameters.
 *
 * @arg {Function} endCb    - An error-first callback to call with the result of the call,
 * when the function finished. Default: `null`.
 *
 * @function
 */
export const start = (adapters = [], jobs = [], terminators = [], endCb = null) => {
    const errorHandler = (err, results) => {
        if (!_.isNull(endCb)) {
            // There is end callback, so call it either if the process succeeded or failed
            endCb(err, results)
        } else if (!_.isNull(err)) {
            // There is no end callback, and the process failed, so throw an error
            throw err
        }
    }

    async.seq(setupAdapters(initialCtx, adapters), prepareForTermination(terminators), runJobs(jobs))(errorHandler)
}
