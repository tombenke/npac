#!/usr/bin/env node

'use strict';
/**
 * Task runner for npac
 *
 * @module job
 */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var runJob = function runJob(jobDesc) {

    var jobNotDefined = function jobNotDefined(ctx, args) {
        return ctx.logger.error('job is not defined');
    };

    return function (ctx, responseCb) {
        ctx.logger.debug('execute: ', jobDesc);
        var job = _lodash2.default.hasIn(ctx, jobDesc.name) ? ctx[jobDesc.name] : execNotDefined;
        var args = jobDesc.args || {};
        job(ctx, args, responseCb);
    };
};

var runJobSync = function runJobSync(jobDesc) {

    var jobNotDefined = function jobNotDefined(ctx, args) {
        return ctx.logger.error('job is not defined');
    };

    return function (ctx, responseCb) {
        ctx.logger.debug('execute: ', jobDesc);
        var job = _lodash2.default.hasIn(ctx, jobDesc.name) ? ctx[jobDesc.name] : execNotDefined;
        var args = jobDesc.args || {};
        responseCb(null, job(ctx, args, responseCb));
    };
};

module.exports = {
    runJob: runJob,
    runJobSync: runJobSync
};