#!/usr/bin/env node
'use strict'
/**
 * Task runner for npac
 *
 * @module job
 */
import _ from 'lodash'

/**
 * Make a job function, that will call an asynchronous API endpoint available through the context.
 *
 * @arg {Object} jobDesc - An object, that describe the job to run:
 *
 *      {
 *          name: {String} // The name of the executive
 *          args: {Object} // A dictionary object which holds the actual arguments of the executive to run
 *      }
 *
 * @return {Function} - A function that the `npac.start()` will call, during the runJobs process.
 * It has the standard signature of adapter functions: `(ctx: {Object}, next: {Function})`
 *
 * see also: the `npac.start` process description.
 *
 * @function
 */
export const makeCall = jobDesc => {
    const jobNotDefined = (ctx, args) => ctx.logger.error('job is not defined')

    return (ctx, responseCb) => {
        //        ctx.logger.debug('execute: ', jobDesc)
        const job = _.hasIn(ctx, jobDesc.name) ? ctx[jobDesc.name] : jobNotDefined
        const args = jobDesc.args || {}
        job(ctx, args, responseCb)
    }
}

/**
 * Make a job function, that will call an synchronous API endpoint available through the context.
 *
 * Similar to the makeCall, but the API endpoint is synchronous.
 *
 * @arg {Object} jobDesc - The job descriptor object.
 *
 * @return {Function} - The job function.
 *
 * @function
 */
export const makeCallSync = jobDesc => {
    const jobNotDefined = (ctx, args) => ctx.logger.error('job is not defined')

    return (ctx, responseCb) => {
        //        ctx.logger.debug('execute: ', jobDesc)
        const job = _.hasIn(ctx, jobDesc.name) ? ctx[jobDesc.name] : jobNotDefined
        const args = jobDesc.args || {}
        responseCb(null, job(ctx, args))
    }
}
