#!/usr/bin/env node
'use strict'
/**
 * Configuration module of npac
 *
 * @module config
 */
import _ from 'lodash'
import { loadJsonFileSync } from 'datafile'

/**
 * Make one unite configuration object from the following sources:
 * - built-in defaults,
 * - config file content, (if exists),
 * - command line config parameters
 *
 * @arg {Object} defaults - The dictionary of default parameters
 * @arg {Object} cliConfig - The dictionary of parameters parsed by the CLI
 * @arg {String} configFileProp - The property name of the config file, if it is used at all.
 *
 * @return {Object} - The configuration parameters merged into one object
 *
 * @function
 */
export const makeConfig = (defaults = {}, cliConfig = {}, configFileProp = 'configFile') => {
    const configFileName = _.has(cliConfig, configFileProp)
        ? cliConfig[configFileProp]
        : _.has(defaults, configFileProp)
        ? defaults[configFileProp]
        : null
    const configFileContent = _.isNull(configFileName) ? {} : loadJsonFileSync(configFileName, false)
    const config = _.mergeWith({}, defaults, configFileContent, cliConfig)

    return config
}

/**
 * Create an adapter function that merges the configuration object into the context.
 *
 * It returns with an `npac` adapter function that merges the given configuration object
 * with the current content of the `config` member of the context.
 *
 * @arg {Object} config - The configuration object to merge with the context.
 *
 * @return {Function} - The adapter function that can be executed during the start process.
 * It has the standard signature of adapter functions: `(ctx: {Object} , next: {Function})`
 * see also: the `npac.start` process description.
 *
 * @function
 */
export const mergeConfig = (config = {}) => (ctx, next) => {
    next(null, _.mergeWith({}, ctx, { config: config }))
}
