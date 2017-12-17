#!/usr/bin/env node
'use strict'
/**
 * Task runner for npac
 *
 * @module task
 */
import _ from 'lodash'

/**
 * Run an API endpoint available in the context 
 *
 * Required ctx properties:
 *   - logger
 *
 * @arg {Object} task - An object, that describe the task to run:
 *   {
 *      name: {String} // The name of he executive
 *      args: {Object} // A dictionary object which holds the actual arguments of the executive to run
 *   }
 *
 * @return {Function} - A function that the `npac.startup()` will call, during the startup process.
 * It has the standard signature of startup functions: `(ctx: {Object} , next: {Function})`
 * see also: the `npac.startup` process description.
 *
 * @function
 */
const execute = (task, resCb) => {

    const execNotDefined = (ctx, args) => ctx.logger.error('executive is not defined')
    const contFun = (next) => (err, result, cb) 

    return (ctx, next) => {
        console.log('execute: ', ctx, next)
        const executive = _.hasIn(ctx, task.name) ? ctx[task.name] : execNotDefined
        executive(ctx, task.args, contFun(next))
    }
}

module.exports = execute
