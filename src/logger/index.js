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

const logPlainFormat = printf((info) => `${info.level}: ${info.message}`)
const logFormat = printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)
const appLabel = (config) => ({ label: `${config.app.name}@${config.app.version}` })
const textPlainFormatter = (config) => combine(colorize(), logPlainFormat)
const textFormatter = (config) => combine(label(appLabel(config)), timestamp(), colorize(), logFormat)
const jsonFormatter = (config) => combine(label(appLabel(config)), timestamp(), json())
const makeFormatter = (config, format) =>
    format === 'json'
        ? jsonFormatter(config)
        : format === 'textPlain'
        ? textPlainFormatter(config)
        : textFormatter(config)

export const makeTransport = (config) => (transConfig) => {
    if (transConfig.type === 'file') {
        return new transports.File({
            filename: _.get(transConfig, 'filename', './output.log'),
            format: makeFormatter(config, transConfig.format),
            level: _.get(transConfig, 'level', _.get(config, 'logger.level', 'info'))
        })
    } else if (transConfig.type === 'console') {
        return new transports.Console({
            format: makeFormatter(config, transConfig.format),
            level: _.get(transConfig, 'level', _.get(config, 'logger.level', 'info'))
        })
    }
}

/**
 * Make a winston logger described by the `config` parameters.
 *
 * This adapter uses the winston logger library.
 * It uses the default levels: `error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5`
 *
 * @arg {Object} config - The configuration of the logger
 * The structure of the config object:
 *
 * @return {Object} - The logger object
 *
 * @function
 */
const makeWinstonLogger = (config) =>
    createLogger({
        level: config.logger.level,
        transports: _.map(config.logger.transports, makeTransport(_.merge({}, config, { level: config.logger.level })))
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
    next(null, { logger: makeWinstonLogger(loggerConfig) })
}
