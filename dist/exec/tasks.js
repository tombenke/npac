#!/usr/bin/env node

'use strict';
/**
 * Task runner for npac
 *
 * @module task
 */

/**
 * Run a task defined under the `executives`.
 *
 * Required ctx properties:
 *   - logger
 *   - executives
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

var runTasks = function runTasks(task) {

    var execNotDefined = function execNotDefined(ctx, args) {
        return ctx.logger.error('executive is not defined');
    };

    return function (ctx, next) {
        var executive = _.hasIn(ctx, 'executives.' + task.name) ? ctx.executives[task.name] : execNotDefined;
        executive(ctx, task.args);
        next(null, ctx);
    };
};

module.exports = {
    runTasks: runTasks
};