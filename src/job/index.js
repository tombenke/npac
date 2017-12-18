#!/usr/bin/env node
'use strict'
/**
 * Task runner for npac
 *
 * @module job
 */
import _ from 'lodash'

/**
 * Run an API endpoint available in the context 
 *
 * Required ctx properties:
 *   - logger
 *
 * @arg {Object} jobDesc - An object, that describe the job to run:
 *   {
 *      name: {String} // The name of the executive
 *      args: {Object} // A dictionary object which holds the actual arguments of the executive to run
 *   }
 *
 * @return {Function} - A function that the `npac.startup()` will call, during the runJobs process.
 * It has the standard signature of startup functions: `(ctx: {Object}, next: {Function})`
 * see also: the `npac.startup` process description.
 *
 * @function
 */
const makeCall = (jobDesc) => {

    const jobNotDefined = (ctx, args) => ctx.logger.error('job is not defined')

    return (ctx, responseCb) => {
        ctx.logger.debug('execute: ', jobDesc)
        const job = _.hasIn(ctx, jobDesc.name) ? ctx[jobDesc.name] : execNotDefined
        const args = jobDesc.args || {}
        job(ctx, args, responseCb)
    }
}

const makeCallSync = (jobDesc) => {

    const jobNotDefined = (ctx, args) => ctx.logger.error('job is not defined')

    return (ctx, responseCb) => {
        ctx.logger.debug('execute: ', jobDesc)
        const job = _.hasIn(ctx, jobDesc.name) ? ctx[jobDesc.name] : execNotDefined
        const args = jobDesc.args || {}
        responseCb(null, job(ctx, args))
    }
}

module.exports = {
    makeCall,
    makeCallSync
}
