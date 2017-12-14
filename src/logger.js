#!/usr/bin/env node
'use strict'
/**
 * Logger module of npac
 *
 * @module logger
 */

import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf } = format

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
})

const makeLogger = (config) => createLogger({
    level: 'info',
    format: combine(
        label({ label: `${config.app.name}_v${config.app.version}` }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console({ level: 'info' })
    ]
})

module.exports = {
    makeLogger
}
