import _ from 'lodash'
import expect from 'expect'
import { makeConfig, mergeConfig } from './index'
import { loadJsonFileSync } from 'datafile'

describe('config', () => {
    const defaults = loadJsonFileSync('src/config/fixtures/defaults.yml')
    const defaultsWithConfigFileName = loadJsonFileSync('src/config/fixtures/defaultsWithConfigFileName.yml')
    const configFile = loadJsonFileSync('src/config/fixtures/configFile.yml')
    const cliConfig = loadJsonFileSync('src/config/fixtures/cliConfig.yml')
    const cliConfigWithConfigFileName = loadJsonFileSync('src/config/fixtures/cliConfigWithConfigFileName.yml')
    const ctxOrig = loadJsonFileSync('src/config/fixtures/ctxOrig.yml')
    const ctxPlusDefaults = loadJsonFileSync('src/config/fixtures/ctxPlusDefaults.yml')

    it('#makeConfig - with no parameters', () => {
        const expectedConfig = {}
        expect(makeConfig()).toEqual(expectedConfig)
    })

    it('#makeConfig - with defaults only', () => {
        const expectedConfig = defaults
        expect(makeConfig(defaults)).toEqual(expectedConfig)
    })


    it('#makeConfig - with defaults and cliConfig', () => {
        const expectedConfig = loadJsonFileSync('src/config/fixtures/defaultsPlusCliConfig.yml')
        expect(makeConfig(defaults, cliConfig)).toEqual(expectedConfig)
    })

    it('#makeConfig - with defaults, missing config file and cliConfig', () => {
        const expectedConfig = loadJsonFileSync('src/config/fixtures/defaultsPlusCliConfig.yml')
        expect(makeConfig(defaults, cliConfig, 'configFileName')).toEqual(expectedConfig)
    })

    it('#makeConfig - with defaults, config file defined in defaults and cliConfig', () => {
        const expectedConfig = loadJsonFileSync('src/config/fixtures/allInOne.yml')
        expect(makeConfig(defaultsWithConfigFileName, cliConfig, 'configFileName')).toEqual(expectedConfig)
    })

    it('#makeConfig - with defaults, config file defined in cliConfig and cliConfig', () => {
        const expectedConfig = loadJsonFileSync('src/config/fixtures/allInOne.yml')
        expect(makeConfig(defaults, cliConfigWithConfigFileName, 'configFileName')).toEqual(expectedConfig)
    })

    it('#mergeConfig - with no args', (done) => {
        const expectedConfig = ctxOrig
        const adapterFun = mergeConfig()
        adapterFun(ctxOrig, (err, result) => {
            expect(result).toEqual(expectedConfig)
            done()
        })
    })

    it('#mergeConfig - with defaults', (done) => {
        const expectedConfig = ctxPlusDefaults
        const adapterFun = mergeConfig(defaults)
        adapterFun(ctxOrig, (err, result) => {
            expect(result).toEqual(expectedConfig)
            done()
        })
    })
})
