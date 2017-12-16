#!/usr/bin/env node

'use strict';
/**
 * Configuration module of npac
 *
 * @module config
 */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Make one unite configuration object from the following sources:
 * - built-in defaults,
 * - config file content, (if exists),
 * - command line config parameters
 *
 * @arg {Object} defaults - The dictionary of default parameters
 * @arg {Object} cliconfig - The dictionary of parameters parsed by the CLI
 * @arg {String} configFileProp - The property name of the config file, if it is used at all.
 *
 * @return {Object} - The configuration parameters merged into one object
 *
 * @function
 */
var makeConfig = function makeConfig() {
    var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cliConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var configFileProp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'configFile';

    var configFileName = _lodash2.default.has(cliConfig, configFileProp) ? cliConfig[configFileProp] : _lodash2.default.has(defaults, configFileProp) ? defaults[configFileProp] : null;
    var configFileContent = _lodash2.default.isNull(configFileName) ? {} : (0, _datafile.loadJsonFileSync)(configFileName, false);
    var config = _lodash2.default.mergeWith({}, defaults, configFileContent, cliConfig);

    return config;
};

/**
 * Create an adapter function that merges the configuration object into the context.
 *
 * It returns with an `npac` adapter function that merges the given configuration object
 * with the current content of the `config` member of the context.
 *
 * @arg {Object} config - The configuration object to merge with the context.
 *
 * @return {Function} - The adapter function that can be executed during the startup process.
 * It has the standard signature of startup functions: `(ctx: {Object} , next: {Function})`
 * see also: the `npac.startup` process description.
 *
 * @function
 */
var mergeConfig = function mergeConfig() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return function (ctx, next) {
        next(null, _lodash2.default.mergeWith({}, ctx, { config: config }));
    };
};

module.exports = {
    makeConfig: makeConfig,
    mergeConfig: mergeConfig
};