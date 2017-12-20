#!/usr/bin/env node

'use strict';

/**
 * Application wrapper functions for typical use cases with npac
 *
 * @module wrappers
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runJob = exports.runJobSync = undefined;

var _core = require('./core');

var _config = require('./config/');

var _logger = require('./logger/');

var _job = require('./job/');

var buildAndRun = function buildAndRun(config, executives, jobDesc, jobFun, cb) {
    (0, _core.start)([(0, _config.mergeConfig)(config), _logger.addLogger, executives], [jobFun(jobDesc)], cb);
};

/**
 * Run a synchronous executive function in a plain container
 *
 * The function builds a container that provides only `config`, `logger`
 * and the executives given as a parameter, then executes the synchronous job,
 * that is defined by the `jobDesc` parameter.
 *
 * @arg {Object} config - The configuration parameters of the container.
 * @arg {Object} executives - The executives, that must contain at least the sync job function that is referred by the `jobDesc` argument.
 * @arg {Object} jobDesc - The job `{ name: {String}, args: {Object} }` descriptor object.
 * @arg {Function} cb - An error-first callback function, will be called with th re final results of container run.
 *
 * @function
 */
var runJobSync = exports.runJobSync = function runJobSync(config, executives, jobDesc, cb) {
    return buildAndRun(config, executives, jobDesc, _job.makeCallSync, cb);
};

/**
 * Run an asynchronous executive function in a plain container
 *
 * The function builds a container that provides only `config`, `logger`
 * and the executives given as a parameter, then executes the synchronous job,
 * that is defined by the `jobDesc` parameter.
 *
 * @arg {Object} config - The configuration parameters of the container.
 * @arg {Object} executives - The executives, that must contain at least the async job function that is referred by the `jobDesc` argument.
 * @arg {Object} jobDesc - The job `{ name: {String}, args: {Object} }` descriptor object.
 * @arg {Function} cb - An error-first callback function, will be called with th re final results of container run.
 *
 * @function
 */
var runJob = exports.runJob = function runJob(config, executives, jobDesc, cb) {
    return buildAndRun(config, executives, jobDesc, _job.makeCall, cb);
};