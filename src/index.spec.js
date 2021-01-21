import _ from 'lodash'
import expect from 'expect'
import app from './index'
import npacDefaultConfig from './defaultConfig'
import { makeConfig, mergeConfig } from './config/'
import { addLogger } from './logger/'

import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

const testDirectory = path.resolve('./tmp')
const destCleanup = function (cb) {
    const dest = testDirectory
    console.log('Remove: ', dest)
    rimraf(dest, cb)
}

//    const { cliConfig, command } = cli.parse(defaults)
//    const config = makeConfig(defaults, cliConfig)

//const cliMock = (cmdName, cmdArgs, cliConfig) => ({
//    parse: (defaults, argv) => ({ command: {name: cmdName, args: cmdArgs}, cliConfig: cliConfig })
//})

describe('npac', () => {
    before(function (done) {
        destCleanup(function () {
            console.log('Create: ', testDirectory)
            fs.mkdirSync(testDirectory)
            done()
        })
    })

    after(function (done) {
        //        destCleanup(done)
        done()
    })

    const checkCtx = (checkFun) => (ctx, next) => {
        checkFun(ctx)
        next(null, ctx)
    }

    it('#start - check default config', () => {
        const expectedConfig = npacDefaultConfig
        app.start([checkCtx((ctx) => expect(ctx.config).toEqual(expectedConfig))])
    })

    it('#start - #makeConfig, #mergeConfig', () => {
        const configToMerge = makeConfig({ logger: { level: 'debug' }, projectPath: '/home/testuser/testproject' })
        const expectedCtx = { config: _.merge({}, npacDefaultConfig, configToMerge) }

        app.start([mergeConfig(configToMerge), checkCtx((ctx) => expect(ctx.config).toEqual(expectedCtx.config))])
    })

    it('#start - #makeConfig, #mergeConfig, #addLogger', () => {
        const configToMerge = makeConfig({ logger: { level: 'debug' }, projectPath: testDirectory })
        //        const expectedCtx = { config: _.merge({}, npacDefaultConfig, configToMerge ) }

        app.start(
            [
                mergeConfig(configToMerge),
                addLogger
                //            checkCtx(ctx => expect(ctx.config).toEqual(expectedCtx.config))
            ],
            [
                (ctx, next) => {
                    ctx.logger.info('This is a DEBUG message')
                    console.log('This is a DEBUG message')
                    next(null, {})
                }
            ],
            [], // No terminators defined
            (err, results) => {
                console.log('Final results:', err, results)
            }
        )
    })

    it('#start - call sync executive function', (done) => {
        app.start(
            [{ addSync: (ctx, a, b) => a + b }],
            [
                (ctx, cb) => {
                    const result = ctx.addSync(ctx, 1, 1)
                    expect(result).toEqual(2)
                    cb(null, result)
                }
            ],
            [], // No terminators defined
            done
        )
    })

    it('#start - call async executive function', (done) => {
        app.start(
            [{ add: (ctx, a, b, cb) => cb(null, a + b) }],
            [
                (ctx, cb) => {
                    ctx.add(ctx, 1, 1, (err, result) => {
                        expect(result).toEqual(2)
                        cb(null, result)
                    })
                }
            ],
            [], // No terminators defined
            done
        )
    })

    it('#start - call sync job', (done) => {
        app.start(
            [{ addSync: (ctx, args) => args.a + args.b }],
            [app.makeCallSync({ name: 'addSync', args: { a: 1, b: 1 } })],
            [], // No terminators defined
            (err, result) => {
                expect(result).toEqual([2])
                done()
            }
        )
    })

    it('#start - call async job', (done) => {
        app.start(
            [{ add: (ctx, args, cb) => cb(null, args.a + args.b) }],
            [app.makeCall({ name: 'add', args: { a: 1, b: 1 } })],
            [], // No terminators defined
            (err, result) => {
                expect(result).toEqual([2])
                done()
            }
        )
    })

    it('#start - call sync job that uses logger', (done) => {
        app.start(
            [
                addLogger,
                {
                    addSync: (ctx, args) => {
                        const result = args.a + args.b
                        ctx.logger.info(`addSync(${args.a}, ${args.b}) => ${result}`)
                        return result
                    }
                }
            ],
            [app.makeCallSync({ name: 'addSync', args: { a: 1, b: 1 } })],
            [], // No terminators defined
            (err, result) => {
                expect(result).toEqual([2])
                done()
            }
        )
    })

    it('#start - call async job that uses logger', (done) => {
        app.start(
            [
                addLogger,
                {
                    add: (ctx, args, cb) => {
                        const result = args.a + args.b
                        ctx.logger.info(`add(${args.a}, ${args.b}) => ${result}`)
                        cb(null, result)
                    }
                }
            ],
            [app.makeCall({ name: 'add', args: { a: 1, b: 1 } })],
            [], // No terminators defined
            (err, result) => {
                expect(result).toEqual([2])
                done()
            }
        )
    })
})
