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
        checkFun(ctx)
        next(null, ctx)
    }

    it('#start - check default config', () => {
        const expectedConfig = npacDefaultConfig
        app.start([checkCtx(ctx => expect(ctx.config).toEqual(expectedConfig))])
    })

    it('#start - #makeConfig, #mergeConfig', () => {
        const configToMerge = makeConfig({ logger: { level: "debug" }, projectPath: "/home/testuser/testproject" })
        const expectedCtx = { config: _.merge({}, npacDefaultConfig, configToMerge ) }

        app.start([
            mergeConfig(configToMerge),
            checkCtx(ctx => expect(ctx.config).toEqual(expectedCtx.config))
        ])
    })

    it('#start - call sync executive function', (done) => {

        app.start([
            { addSync: (ctx, a, b) => a + b },
        ], [
            (ctx, cb) => {
                const result = ctx.addSync(ctx, 1, 1)
                expect(result).toEqual(2)
                cb(null, result)
            }
        ], done)
    })

    it('#start - call async executive function', (done) => {

        app.start([
            { add: (ctx, a, b, cb) => cb(null, a + b) },
        ], [
            (ctx, cb) => {
                ctx.add(ctx, 1, 1, (err, result) => {
                    expect(result).toEqual(2)
                    cb(null, result)
                })
            }
        ], done)
    })

    it('#start - call sync job', (done) => {

        app.start([
            { addSync: (ctx, args) => args.a + args.b },
        ], [
            app.makeCallSync({ name: 'addSync', args: { a: 1, b: 1 } })
        ], (err, result) => {
            expect(result).toEqual([2])
            done()
        })
    })


    it('#start - call async job', (done) => {

        app.start([
            { add: (ctx, args, cb) => cb(null, args.a + args.b) },
        ], [
            app.makeCall({ name: 'add', args: { a: 1, b: 1 } })
        ], (err, result) => {
            expect(result).toEqual([2])
            done()
        })
    })

})
