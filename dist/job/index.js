#!/usr/bin/env node

'use strict';
/**
 * Task runner for npac
 *
 * @module job
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeCallSync = exports.makeCall = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var makeCall = exports.makeCall = function makeCall(jobDesc) {

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
var makeCallSync = exports.makeCallSync = function makeCallSync(jobDesc) {

    var jobNotDefined = function jobNotDefined(ctx, args) {
        return ctx.logger.error('job is not defined');
    };

    return function (ctx, responseCb) {
        ctx.logger.debug('execute: ', jobDesc);
        var job = _lodash2.default.hasIn(ctx, jobDesc.name) ? ctx[jobDesc.name] : execNotDefined;
        var args = jobDesc.args || {};
        responseCb(null, job(ctx, args));
    };
};