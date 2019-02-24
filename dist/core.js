#!/usr/bin/env node

'use strict';

/**
 * A lightweight Ports and Adapters Container for Node
 *
 * @module core
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _defaultConfig = require('./defaultConfig');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialCtx = {
    config: _defaultConfig2.default,
    logger: console

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
};var setupAdapters = function setupAdapters(ctx) {
    var adapters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return function (endCb) {
        // ctx.logger.debug('App is starting up...', ctx, adapters)
        _async2.default.reduce(adapters, ctx, function (memoCtx, adapter, callback) {
            if (_lodash2.default.isFunction(adapter)) {
                // memoCtx.logger.debug('Call adapter registration function')
                adapter(memoCtx, function (err) {
                    var ctxExtension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                    if (err) {
                        memoCtx.logger.error('Adapter registration function returned: ', err);
                        callback(err, memoCtx);
                    } else {
                        // Merge the adapter extensions to the context
                        if (_lodash2.default.isNull(ctxExtension)) {
                            // memoCtx.logger.debug('Adapter extensions is null. Do not merge.')
                            callback(null, memoCtx);
                        } else {
                            // memoCtx.logger.debug('Merge adapter extensions to the context: ', ctxExtension)
                            callback(null, _lodash2.default.merge({}, memoCtx, ctxExtension));
                        }
                    }
                });
            } else {
                // memoCtx.logger.debug('Merge adapter object to ctx')
                callback(null, _lodash2.default.merge({}, memoCtx, adapter));
            }
        }, function (err, resultCtx) {
            endCb(err, resultCtx);
        });
    };
};

var shutDown = function shutDown(ctx, terminators) {
    return function (signal) {
        ctx.logger.info('App starts the shutdown process...');
        _async2.default.mapSeries(terminators, function (terminator, callback) {
            if (_lodash2.default.isFunction(terminator)) {
                // ctx.logger.debug('Call terminator function')
                terminator(ctx, function (err, result) {
                    if (err) {
                        ctx.logger.error('Terminator call failed', err);
                    } else {
                        // ctx.logger.debug('Terminator call completed', result)
                    }
                    callback(err, result);
                });
            } else {
                ctx.logger.error('Terminator is not a function');
                callback(new Error('Terminator is not a function'), null);
            }
        }, function (err, res) {
            if (err) {
                ctx.logger.error('Shutdown process failed', err);
                process.exit(1);
            } else {
                ctx.logger.info('Shutdown process successfully finished');
                process.exit(0);
            }
        });
    };
};

/**
 * Prepare for termination
 *
 * @arg {Array} terminators - The array of terminators functions
 * @arg {Function} endCb - An error-first callback function to call when the shutdown process finished.
 *
 * @function
 */
var prepareForTermination = function prepareForTermination() {
    var terminators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return function (ctx, endCb) {
        // ctx.logger.debug('App is preparing for SIGTERM, SIGINT and SIGHUP ...', terminators)
        var signals = ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGUSR1', 'SIGUSR2'];
        for (var signal in signals) {
            process.on(signals[signal], shutDown(ctx, terminators));
        }
        endCb(null, ctx);
    };
};

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
var runJobs = function runJobs(jobs) {
    return function (ctx, endCb) {
        ctx.logger.info('App runs the jobs...');
        _async2.default.mapSeries(jobs, function (job, callback) {
            if (_lodash2.default.isFunction(job)) {
                // ctx.logger.debug('Call job function')
                job(ctx, function (err, result) {
                    if (err) {
                        ctx.logger.error('Job call failed', err);
                    } else {
                        // ctx.logger.debug('Job call completed', result)
                    }
                    callback(err, result);
                });
            } else {
                ctx.logger.error('Job is not a function');
                callback(new Error('Job must be a function'), null);
            }
        }, endCb);
    };
};

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
var start = exports.start = function start() {
    var adapters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var jobs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var terminators = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var endCb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    var errorHandler = function errorHandler(err, results) {
        if (!_lodash2.default.isNull(endCb)) {
            // There is end callback, so call it either if the process succeeded or failed
            endCb(err, results);
        } else if (!_lodash2.default.isNull(err)) {
            // There is no end callback, and the process failed, so throw an error
            throw err;
        }
    };

    _async2.default.seq(setupAdapters(initialCtx, adapters), prepareForTermination(terminators), runJobs(jobs))(errorHandler);
};