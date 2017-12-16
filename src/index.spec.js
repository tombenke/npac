import _ from 'lodash'
import expect from 'expect'
import app from './index'
import npacDefaultConfig from './defaultConfig'
import { makeConfig, mergeConfig } from './config/'

/*
import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

const destCleanup = function(cb) {
    const dest = path.resolve('./tmp/')
    console.log('Remove: ', dest)
    rimraf(dest, cb)
}

before(function(done) {
    destCleanup(function() {
        fs.mkdirSync(path.resolve('./tmp'))
        done()
    })
})

after(function(done) {
    destCleanup(done)
})
*/
//    const { cliConfig, command } = cli.parse(defaults)
//    const config = makeConfig(defaults, cliConfig)

//const cliMock = (cmdName, cmdArgs, cliConfig) => ({
//    parse: (defaults, argv) => ({ command: {name: cmdName, args: cmdArgs}, cliConfig: cliConfig })
//})


describe('npac', () => {

    const checkCtx = (checkFun) => (ctx, next) => {
        console.log('checkCtx: ', ctx)
        checkFun(ctx)
        next(null, ctx)
    }

    it('#startup - check default config', () => {
        const expectedConfig = npacDefaultConfig
        app.startup([checkCtx(ctx => expect(ctx.config).toEqual(expectedConfig))])
    })

    it('#startup - #makeConfig, #mergeConfig', () => {
        const configToMerge = makeConfig({ logger: { level: "debug" }, projectPath: "/home/testuser/testproject" })
        const expectedCtx = { config: _.merge({}, npacDefaultConfig, configToMerge ) }

        app.startup([
            mergeConfig(configToMerge),
            checkCtx(ctx => expect(ctx.config).toEqual(expectedCtx.config))
        ])
    })

})
