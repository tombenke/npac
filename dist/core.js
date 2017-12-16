#!/usr/bin/env node

'use strict';

/**
 * A lightweight Ports and Adapters Container for Node
 *
 * @module core
 */

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
};

var ctx = initialCtx;

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
var startup = function startup() {
    var adapters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var endCb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


    ctx.logger.info('app is starting up...', ctx.config);
    _async2.default.reduce(adapters, initialCtx, function (memoCtx, adapter, callback) {
        if (_lodash2.default.isFunction(adapter)) {
            memoCtx.logger.debug('call adapter registration function');
            adapter(memoCtx, function (err, ctxExtension) {
                if (err) {
                    memoCtx.logger.error('Adapter registration function returned: ', err);
                    callback(err, null);
                } else {
                    // Merge the adapter extensions to the context
                    memoCtx.logger.debug('Merge adapter extensions to the context: ', ctxExtension);
                    callback(null, _lodash2.default.merge({}, memoCtx, ctxExtension));
                }
            });
        } else {
            memoCtx.logger.debug('merge adapter object to ctx');
            callback(null, _lodash2.default.merge({}, memoCtx, adapter));
        }
    }, function (err, resultCtx) {
        if (_lodash2.default.isNull(err)) {
            ctx = resultCtx;
            if (!_lodash2.default.isNull(endCb)) {
                endCb(null, ctx);
            }
        } else {
            if (_lodash2.default.isNull(endCb)) {
                throw err;
            } else {
                endCb(err, resultCtx);
            }
        }
    });
};

module.exports = {
    startup: startup
};