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
 * The `startup()` function will merge the original context object with the `ctxExtension`,
 * and the next adapter function in the pipeline will be called with this extended context object.
 *
 * @arg {Object} ctx - The initial context
 * @arg {Array} adapters - The array of adapter functions
 * @arg {Function} endCb - An error-first callback function to call when the startup process finished.
 *
 * @function
 */
const setupAdapters = (ctx, adapters=[], endCb) => {
    ctx.logger.info('app is starting up...')
    async.reduce(adapters, ctx, (memoCtx, adapter, callback) => {
        if (_.isFunction(adapter)) {
            memoCtx.logger.debug('call adapter registration function')
            adapter(memoCtx, (err, ctxExtension=null) => {
                if (err) {
                    memoCtx.logger.error('Adapter registration function returned: ', err)
                    callback(err, memoCtx)
                } else {
                    // Merge the adapter extensions to the context
                    if (_.isNull(ctxExtension)) {
                        memoCtx.logger.debug('Adapter extensions is null. Do not merge.')
                        callback(null, memoCtx)
                    } else {
                        memoCtx.logger.debug('Merge adapter extensions to the context: ', ctxExtension)
                        callback(null, _.merge({}, memoCtx, ctxExtension))
                    }
                }
            })
        } else {
            memoCtx.logger.debug('merge adapter object to ctx')
            callback(null, _.merge({}, memoCtx, adapter))
        }
    }, function(err, resultCtx) {
        if (_.isNull(err)) {
            endCb(null, resultCtx)
        } else {
            endCb(err, resultCtx)
        }
    })
}

const runJobs = (ctx, jobs, endCb) => {
    ctx.logger.info('app runs the jobs...')
    async.mapSeries(jobs, (job, callback) => {
        if (_.isFunction(job)) {
            ctx.logger.debug('call job function')
            job(ctx, (err, result) => {
                if (err) {
                    ctx.logger.error('Task call failed', err)
                    callback(err, null)
                } else {
                    ctx.logger.debug('Task call completed', result)
                    callback(null, result)
                }
            })
        } else {
            ctx.logger.error('Task is not a function')
            callback(new Error('Task must be a function'), null)
        }
    }, function(err, results) {
        if (_.isNull(err)) {
            if (! _.isNull(endCb)) {
                endCb(null, results)
            }
        } else {
            if (_.isNull(endCb)) {
                throw(err)
            } else {
                endCb(err, results)
            }
        }
    })
}

/**
 * Run an `npac` application
 *
 * First setup the adapters, then run the jobs if they are available.
 *
 * @arg {Array} adapters    - The list of adapters that make the context, inlcuding the executives
 * @arg {Array} jobs       - The list of jobs to execute
 * @arg {Function} endCb    - An error-first callback to call when the function finished
 *
 * @function
 */
const start = (adapters=[], jobs=[], endCb=null) =>
    setupAdapters(initialCtx, adapters, (err, ctx) => {
        if (_.isNull(err)) {
            runJobs(ctx, jobs, endCb)
        } else if (! _.isNull(endCb)) {
            endCb(err, ctx)
        }
    })

module.exports = {
    start: start
}
