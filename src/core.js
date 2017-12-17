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

let ctx = initialCtx

/**
 * Execute the startup process of an `npac` application
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
 * @arg {Array} adapters - The array of adapter functions
 * @arg {Function} endCb - An error-first callback function to call when the startup process finished.
 *
 * @function
 */
const startup = (adapters=[], endCb=null) => {

    ctx.logger.info('app is starting up...', ctx.config)
    async.reduce(adapters, initialCtx, (memoCtx, adapter, callback) => {
        if (_.isFunction(adapter)) {
            memoCtx.logger.debug('call adapter registration function')
            adapter(memoCtx, (err, ctxExtension=null) => {
                if (err) {
                    memoCtx.logger.error('Adapter registration function returned: ', err)
                    callback(err, null)
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
            ctx = resultCtx
            if (! _.isNull(endCb)) {
                endCb(null, ctx)
            }
        } else {
            if (_.isNull(endCb)) {
                throw(err)
            } else {
                endCb(err, resultCtx)
            }
        }
    })
}

module.exports = {
    startup: startup
}
