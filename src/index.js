#!/usr/bin/env node
'use strict'
/**
 * A lightweight Ports and Adapters Container for Node
 *
 * @module npac
 */

import { loadJsonFileSync } from 'datafile'
import { makeConfig } from './config'
import { makeLogger } from './logger'
import { makeComm } from './comm'

const execNotDefined = (container, commandArgs) => container.logger.warn('executive is not defined')

module.exports = (defaults, cli, exec, startup=[], shutdown=[]) => {
    const { cliConfig, command } = cli.parse(defaults)
    const config = makeConfig(defaults, cliConfig)

    const container = {
        config: config,
        logger: makeLogger(config),
        comm: makeComm(config)
    }

    return ({
        start: () => {
            container.logger.info('app is starting...', container.config, command.args)
            //TODO: startup
            const executive = exec[command.name] || execNotDefined
            executive(container, command)
        },
        stop: () => {
            // TODO: shutdown
            container.logger.info('app is stopping...')
        }
    })
}
