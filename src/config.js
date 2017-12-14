#!/usr/bin/env node
'use strict'
/**
 * Configuration module of npac
 *
 * @module config
 */
import _ from 'lodash'
import thisPackage from '../package.json'

const npacDefaults = {
    app: {
        name: thisPackage.name,
        version: thisPackage.version
    }
}

const makeConfig = (defaults, cliConfig) => {
    const configFile = _.merge({},
            npacDefaults,
            _.has(defaults, 'configFileName') ? loadJsonFileSync(defaults.configFileName, false) : {},
            _.has(cliConfig, 'configFileName') ? loadJsonFileSync(cliConfig.configFileName, false) : {})
    const config = _.merge({}, defaults, configFile, cliConfig)
    return config
}

module.exports = {
    makeConfig
}
