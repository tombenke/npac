#!/usr/bin/env node
'use strict'
/**
 * Logger module for npac
 *
 * @module logger
 */

import _ from 'lodash'
import defaultConfig from './defaultConfig'
import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf, colorize, json } = format

const logPlainFormat = printf(info => (`${info.level}: ${info.message}`))
const logFormat = printf(info => (`${info.timestamp} [${info.label}] ${info.level}: ${info.message}`))
const appLabel = (config) => ({ label: `${config.app.name}@${config.app.version}` })
const textPlainFormatter = config => combine(colorize(), logPlainFormat)
const textFormatter = config => combine(label(appLabel(config)), timestamp(), colorize(), logFormat)
const jsonFormatter = config => combine(label(appLabel(config)), timestamp(), json())
const makeFormatter = (config, format) => format === 'json' ? jsonFormatter(config) : (format === 'textPlain') ? textPlainFormatter(config) : textFormatter(config) 

const makeTransport = config => transConfig => {
    //console.log('makeTransport: ', config, transConfig)
    if (transConfig.type === 'file') {
        return new transports.File({
            filename: './tmp/output.log',
            format: makeFormatter(config, transConfig.format),
            level: transConfig.level || 'info'
        })
    } else if (transConfig.type === 'console') {
        return new transports.Console({
            format: makeFormatter(config, transConfig.format),
            level: transConfig.level || 'info'
        })
    }
}

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
const makeLogger = (config) => createLogger({
    level: config.logger.level,
    transports: _.map(config.logger.transports, makeTransport(_.merge({}, config, { level: config.logger.level})))
})

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
export const addLogger = (ctx, next) => {
    const loggerConfig = _.merge({}, defaultConfig, ctx.config)
    //console.log('addLogger: ', JSON.stringify(loggerConfig, null, ' '))
    next(null, { logger: makeLogger(loggerConfig) })
}
