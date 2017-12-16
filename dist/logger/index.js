#!/usr/bin/env node

'use strict';
/**
 * Logger module for npac
 *
 * @module logger
 */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaultConfig = require('./defaultConfig');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _winston = require('winston');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combine = _winston.format.combine,
    timestamp = _winston.format.timestamp,
    label = _winston.format.label,
    printf = _winston.format.printf,
    colorize = _winston.format.colorize,
    json = _winston.format.json;


var logFormat = printf(function (info) {
    return info.timestamp + ' [' + info.label + '] ' + info.level + ': ' + info.message;
});
var appLabel = function appLabel(config) {
    return { label: config.app.name + '@' + config.app.version };
};
var textFormatter = function textFormatter(config) {
    return combine(label(appLabel(config)), timestamp(), colorize(), logFormat);
};
var jsonFormatter = function jsonFormatter(config) {
    return combine(label(appLabel(config)), timestamp(), json());
};
var makeFormatter = function makeFormatter(config, format) {
    return format === 'json' ? jsonFormatter(config) : textFormatter(config);
};

var makeTransport = function makeTransport(config) {
    return function (transConfig) {
        console.log('makeTransport: ', config, transConfig);
        if (transConfig.type === 'file') {
            return new _winston.transports.File({
                filename: './tmp/output.log',
                format: makeFormatter(config, transConfig.format),
                level: transConfig.level || 'info'
            });
        } else if (transConfig.type === 'console') {
            return new _winston.transports.Console({
                format: makeFormatter(config, transConfig.format),
                level: transConfig.level || 'info'
            });
        }
    };
};

/**
 * Make a logger described by the `config` parameters.
 *
 * This adapter uses the winston logger library.
 * It uses the default levels: `error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5`
 *
 * @arg {Object} config - The configuration of the logger
 *
 * @return {Object} - The logger object
 *
 * @function
 */
var makeLogger = function makeLogger(config) {
    return (0, _winston.createLogger)({
        level: config.logger.level,
        transports: _lodash2.default.map(config.logger.transports, makeTransport(config))
    });
};

/**
 * Create an adapter function that adds a default logger to the context.
 *
 * @arg {Object} ctx    - The actual context
 * @arg {Function} next - Error-first callback function to pass the result partial context extended with the logger.
 *
 * see also: the `npac.startup` process description.
 *
 * @function
 */
var addLogger = function addLogger(ctx, next) {
    var loggerConfig = _lodash2.default.merge({}, _defaultConfig2.default, ctx.config);
    console.log('addLogger: ', JSON.stringify(loggerConfig, null, ' '));
    next(null, { logger: makeLogger(loggerConfig) });
};

module.exports = {
    addLogger: addLogger
};